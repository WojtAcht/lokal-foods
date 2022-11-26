(ns backend.handler
  (:require [compojure.api.sweet :refer :all]
            [ring.util.http-response :refer :all]
            [luminus.http-server :as http]
            [luminus.ws :as ws]
            [ring.middleware.cors :refer [wrap-cors]]
            [clojure.data.json :refer [read-str write-str]]
            [schema.core :as s]))

(def user-db (ref {:0 {:name "michał"}
                   :1 {:name "wojtek"}}))
(def client-db (ref {:0 {:name "kebab"}
                     :1 {:name "pizza"}}))
(def stamp-db (ref {:0 {:client-id :0
                        :user-id :0
                        :hash "123"}
                    :1 {:client-id :0
                        :user-id :1
                        :hash "321"}
                    :2 {:client-id :1
                        :user-id :0
                        :hash "234"}}))

(def channels (ref {}))

(def ws-route-context
  "WebSocket callback functions"
  {:on-open (fn [_channel]
              (println "NEW CHANNEL!"))
   :on-close (fn [channel _code _reason]
               (println "ON CLOSE!"))
   :on-text (fn [channel message]
              (let [client-id (-> message (read-str :key-fn keyword) :id)]
                (dosync (alter channels assoc client-id channel))))
   :on-error (fn [channel error]
               (println "ON CLOSE!"))
   :context-path "/api/websockets"
   :on-bytes (fn [channel bytes _offet _len]
               (println "ON BYTES"))
   :allow-null-path-info? true})

(def core-routes
  (api
   {:swagger
    {:ui "/"
     :spec "/swagger.json"
     :data {:info {:title "Lokal foods API"
                   :description "Lokal foods API"}
            :tags [{:name "api", :description "some apis"}]}}}

   (context "/api" []
     :tags ["api"]

     (POST "/stamp/add" []
       :body-params [stamp-hash :- String
                     user-id :- String
                     client-id :- String]
       :summary "Checks stamp hash and sends information to client via websocket."
       (if-not (and ((keyword user-id) @user-db)
                    ((keyword client-id) @client-db))
         (ok {:success false})
         (let [new-id (rand-int 1000)
               new-kw-id (keyword (str new-id))
               [_ channel] (->> @channels
                                (filter (fn [[channel-user-id channel]]
                                          (= channel-user-id user-id)))
                                first)]
           (dosync
            (alter stamp-db assoc new-kw-id {:client-id (keyword client-id)
                                             :user-id (keyword user-id)
                                             :stamp-hash stamp-hash}))
           (when channel
            (ws/send! channel (write-str {:id user-id
                                          :success true
                                          :stamp-hash stamp-hash})))
           (ok {:success true}))))

     (POST "/stamp/status" []
       :body-params [client-id :- String user-id :- String]
       :summary "Check user stamps status"
       (if-not (and ((keyword user-id) @user-db)
                    ((keyword client-id) @client-db))
         (ok {:success false})
         (let [stamps (->> @stamp-db
                           vals
                           (filter #(and (= (:client-id %) (keyword client-id))
                                         (= (:user-id %) (keyword user-id)))))]
           (ok {:success true :result (count stamps)})))))))

(def handler
  (-> (routes core-routes)
      (wrap-cors :access-control-allow-origin [#".*"]
                 :access-control-allow-methods [:get :put :post :delete])))

(defn -main [& args]
  (http/start
   {:handler handler
    :ws-handlers [ws-route-context]
    :port 3000}))

(ns backend.handler
  (:require [compojure.api.sweet :refer :all]
            [ring.util.http-response :refer :all]
            [luminus.http-server :as http]
            [luminus.ws :as ws]
            [ring.middleware.cors :refer [wrap-cors]]
            [clojure.data.json :refer [read-str write-str]]
            [schema.core :as s]))

(def db (ref {:user {:id "12345"
                     :stamp-hash "00000"}
              :admin {}}))

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
                     id :- String]
       :summary "Checks stamp hash and sends information to client via websocket."
       (let [user (:user @db)]
         (when (and (= (:id user) id)
                    (= (:stamp-hash user) stamp-hash))
           (let [[_ channel] (->> @channels
                                  (filter (fn [[channel-user-id channel]]
                                            (= channel-user-id id)))
                                  first)]
             (ws/send! channel (write-str {:id id :stamp true}))
             (ok {:success true})))))

     (GET "/healthz" []
       :summary "Checks if server is healthy."
       (ok {:success true})))))

(def handler
  (-> (routes core-routes)
      (wrap-cors :access-control-allow-origin [#".*"]
                 :access-control-allow-methods [:get :put :post :delete])))

(defn -main [& args]
  (http/start
   {:handler handler
    :ws-handlers [ws-route-context]
    :port 3000}))

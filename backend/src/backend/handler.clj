(ns backend.handler
  (:require [compojure.api.sweet :refer :all]
            [ring.util.http-response :refer :all]
            [luminus.http-server :as http]
            [ring.middleware.cors :refer [wrap-cors]]
            [schema.core :as s]))

(def db (ref {:user {:id "12345"
                     :stamp-hash "00000"}
              :admin {}}))

(def ws-route-context
  "WebSocket callback functions"
  {:on-open (fn [_channel] (println "NEW CHANNEL!"))
   :on-close (fn [channel _code _reason]
               (println "ON CLOSE!"))
   :on-text (fn [channel message]
              (println "ON TEXT!"))
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
           (ok {:success true}))))

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

(ns backend.handler
  (:require [compojure.api.sweet :refer :all]
            [ring.util.http-response :refer :all]
            [schema.core :as s]))

(def db (ref {:user {:id "12345"
                     :stamp-hash "00000"}
              :admin {}}))

(def app
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

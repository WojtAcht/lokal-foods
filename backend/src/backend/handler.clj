(ns backend.handler
  (:require [compojure.api.sweet :refer :all]
            [ring.util.http-response :refer :all]
            [schema.core :as s]))

(def user-db (ref { :0 {:name "michał"}
                   :1 {:name "wojtek"}}))
(def client-db (ref { :0 {:name "kebab"}
                     :1 {:name "pizza"}}))
(def stamp-db (ref { :0 {:client-id :0
                         :user-id :0
                         :hash "123"}
                    :1 {:client-id :0
                        :user-id :1
                        :hash "321"}
                    :2 {:client-id :1
                        :user-id :0
                        :hash "234"}}))

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
                     user-id :- String
                     client-id :- String]
       :summary "Checks stamp hash and sends information to client via websocket."
       (when (not (and (contains? @user-db (keyword user-id)) (contains? @client-db (keyword client-db)))) (ok {:success false}))
        (let [new-id (rand-int 1000)]
          (dosync (alter stamp-db assoc (keyword (str new-id)) {:client-id (keyword client-id) :user-id (keyword user-id)}))
          (ok {:success true}))
        )

       (POST "/stamp/status" []
         :body-params [client-id :- String user-id :- String]
         :summary "Check user stamps status"

         (if (not (and (contains? @user-db (keyword user-id)) (contains? @client-db (keyword client-id))))
           (ok {:success false})
           (let [stamps (filter #(and (= (:client-id %) (keyword client-id)) (= (:user-id %) (keyword user-id))) (vals @stamp-db))]
             (ok {:success true :result (count stamps)})))
         )

         (GET "/healthz" []
           :summary "Checks if server is healthy."
           (ok {:success true})))))

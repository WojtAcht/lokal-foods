 (defproject backend "0.1.0-SNAPSHOT"
   :description "FIXME: write description"
   :dependencies [[org.clojure/clojure "1.10.0"]
                  [metosin/compojure-api "2.0.0-alpha30"]
                  [ring-cors "0.1.13"]
                  [luminus-jetty "0.2.0"]
                  [stylefruits/gniazdo "1.2.0"]]
   :main backend.handler
   :uberjar-name "server.jar"
   :profiles {:dev {:dependencies [[javax.servlet/javax.servlet-api "3.1.0"]]
                   :plugins [[lein-ring "0.12.5"]]}})
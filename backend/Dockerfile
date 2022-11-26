FROM clojure:lein

WORKDIR /backend
ADD . /backend

RUN apt-get update -y
RUN apt-get upgrade -y

EXPOSE 3000

ENTRYPOINT ["/backend/docker-start.sh"]
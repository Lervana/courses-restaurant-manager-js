# 03 - Docker compose

### Overview of Docker Compose

[https://docs.docker.com/compose/]

"Compose is a tool for defining and running multi-container Docker applications. With Compose, you use a YAML file to
configure your application’s services. Then, with a single command, you create and start all the services from your
configuration. [...] Using Compose is basically a three-step process:

- Define your app’s environment with a Dockerfile so it can be reproduced anywhere.
- Define the services that make up your app in docker-compose.yml so they can be run together in an isolated environment.
- Run docker compose up and the Docker compose command starts and runs your entire app. You can alternatively run
  docker-compose up using the docker-compose binary.

### Docker compose for MySQL database

docker-compose.yaml

```shell
mysql:
  image: mysql
  restart: always
  environment:
    MYSQL_DATABASE: exampledb
    MYSQL_USER: exampleuser
    MYSQL_PASSWORD: examplepass
    MYSQL_RANDOM_ROOT_PASSWORD: '1'
  ports:
    - 3307:3306
```

To run container use ```docker-compose up```

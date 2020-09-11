# Redis Cache Clear

Azure devops release plugin to handle redis cache related tasks from the pipeline.

While devloping an application with redis and azure devops you might end up in a situation that you need to Add/Delete/Flush your redis cache keys after a relase. The you can use the task to implement the same. 

tasks available in the extension

## Add Cache key 

You can create a cache entry on your Redis server using the task

| Paremeter Name | Required | Descritption |
|---|---|---|
| Redis Host Name | true |  Redis host name or url of your redis server (eg : {{yourrediscache}}.redis.cache.windows.net or 127.0.0.1)
| Redis Port Number | true | Port number of Redis Server
| Redis Authentiction key | true | It Can be SAS authentication key if you are using "Azure Cache for Redis" else it can be your Redis Server password
| Authentication Method | true | Authentication method, Choose one from "SAS Authentication key" or "Password"
| Redis prefix key | false | Prefix for the key in case if you want any
| Redis Cache key | true | Key for the cache entry
| Redis Cache Value | true | Value for the cache entry
| Redis DB index | true | Redis DB index to select DB index, Deafult will be '0'


## Flush All

You can clear all the content on your Redis server.

| Paremeter Name | Required | Descritption |
|---|---|---|
| Redis Host Name | true |  Redis host name or url of your redis server (eg : {{yourrediscache}}.redis.cache.windows.net or 127.0.0.1)
| Redis Port Number | true | Port number of Redis Server
| Redis Authentiction key | true | It Can be SAS authentication key if you are using "Azure Cache for Redis" else it can be your Redis Server password
| Authentication Method | true | Authentication method, Choose one from "SAS Authentication key" or "Password"

## Delete Cache Key

You can clear a specific key from the Redis server.

| Paremeter Name | Required | Descritption |
|---|---|---|
| Redis Host Name | true |  Redis host name or url of your redis server (eg : {{yourrediscache}}.redis.cache.windows.net or 127.0.0.1)
| Redis Port Number | true | Port number of Redis Server
| Redis Authentiction key | true | It Can be SAS authentication key if you are using "Azure Cache for Redis" else it can be your Redis Server password
| Authentication Method | true | Authentication method, Choose one from "SAS Authentication key" or "Password"
| Redis prefix key | false | Prefix for the key in case if you want any
| Redis Cache key | true | Key for the cache entry
| Redis DB index | true | Redis DB index to select DB index, Deafult will be '0'


## Flush DB

You can clear all the content from specific DB on your Redis server.

| Paremeter Name | Required | Descritption |
|---|---|---|
| Redis Host Name | true |  Redis host name or url of your redis server (eg : {{yourrediscache}}.redis.cache.windows.net or 127.0.0.1)
| Redis Port Number | true | Port number of Redis Server
| Redis Authentiction key | true | It Can be SAS authentication key if you are using "Azure Cache for Redis" else it can be your Redis Server password
| Authentication Method | true | Authentication method, Choose one from "SAS Authentication key" or "Password"
| Redis DB index | true | Redis DB index to select DB index, Deafult will be '0'




### Release Notes

| Version | Date | Changes |
| --- | --- | --- |
|1.0.12 | 23-07-2020 | Included the option to login to the Redis with password. It was supporting only SAS Token on the previous builds
|1.0.13 | 11-09-2020 | Included the option to choose the DB index in Add/Delete tasks, Included new task for FlushDB
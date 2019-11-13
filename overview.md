# Redis Cache Clear

This is a basic Release plugin for Azure DevOps release pipeline.
It uses the key based authentication to connect to the Redis server.


## Flush All

Please use Redis Cache key as '*'. When you use the key, it will trigger the flush all command on the redis server.

## Delete Cache Key

Please use desired Redis Cache key which need to be delete.
Then the specific key will be removed from the Redis.

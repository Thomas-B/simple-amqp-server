# Simple amqp server

## Goals

The goals of the library is to provide a simple way to spawn up an amqp server for automated tests.  

My current use only needs this server to be able to call back a function when a message is received by the amqp server.


## Current State

Sending a good header for the startOk method

## TODO
[ ] Finish connection  
[ ] Create channel  
[ ] Create/simulate Exchange  
[ ] Receive message

## Resources
[https://github.com/dayorbyte/dispatchd](ampq server implementation in go)

[https://github.com/ppatil9096/books/blob/master/RabbitMQ%20in%20Depth.pdf](Book about rabbitmq's protocol)

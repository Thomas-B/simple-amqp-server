# Simple amqp server

## Goals

The goals of the library is to provide a simple way to spawn up an amqp server for automated tests.  
Do not try to use this server as a real message broker as it the protocol may never be fully
implemented.

## Installation

```bash
$ npm install simple-amqp-server
```

## Usage
```javascript
const sas = require('simple-amqp-server')

async function main() {
  const server = new sas.Server({
    port: 5672,
    onPublish
  })

  await server.start()
  console.log('server started')

  async function onPublish(message) {
    console.log(`received payload: ${message.payload.toString()}`)
    await server.stop()
  }
}

main()
```

## TODO
- [ ] Write more tests
- [ ] Add Api to push event from server to queues
- [ ] Implement publish confirm

## Resources
[ampq server implementation in go](https://github.com/dayorbyte/dispatchd)

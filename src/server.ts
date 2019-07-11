import { Connection } from './connection'
import { Server as TCPServer, createServer, Socket } from 'net'
import { debug as d } from 'debug'
import { onPublishCallback } from './onPublish'

const debug = d('sas:main')

interface IServerOptions {
  port?: number
  onPublish?: onPublishCallback
}
class Server {
  private readonly connections: Map<Socket, Connection>
  private readonly server: TCPServer
  private readonly port: number = 5672
  private readonly options: IServerOptions = {}

  constructor(options?: IServerOptions) {
    if (options) {
      this.options = options
    }

    if (this.options.port !== undefined) {
      this.port = this.options.port
    }

    this.connections = new Map<Socket, Connection>()
    this.server = createServer(this.onNewConnection.bind(this))
  }

  public async start(): Promise<void> {
    return new Promise((resolve, _) => {
      this.server.listen(this.port, '127.0.0.1', () => {
        resolve()
        debug(`Server started on ${this.port}.`)
      })
    })
  }

  private onNewConnection(socket: Socket) {
    const newConnection = new Connection(socket)

    this.connections.set(socket, newConnection)
    newConnection.on('close', this.onConnectionClose.bind(this))
    newConnection.start(this.options.onPublish)
  }

  private onConnectionClose(socket: Socket) {
    this.connections.delete(socket)
  }

  public async stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.server.close((err?: Error) => {
        if (err) {
          return reject(err)
        }
        return resolve()
      })
    })
  }
}

export { Server, IServerOptions }

import { Connection } from './connection'
import { Server as TCPServer, createServer, Socket } from 'net'
import { debug as d } from 'debug'
import { onPublishCallback } from './onPublish'
import { Exchange } from './exchange'
import { Declare as DeclareExchange } from './frames/exchange/declare'
import { Declare as DeclareQueue } from './frames/queue/declare'
import { Queue } from './queue'

const debug = d('sas:main')

interface IServerOptions {
  port?: number
  onPublish?: onPublishCallback
}

class Server {
  private readonly connections: Map<Socket, Connection>
  private readonly exchanges: Map<string, Exchange>
  private readonly queues: Map<string, Queue>
  private readonly server: TCPServer
  // tslint:disable-next-line:variable-name
  private _port: number = 5672
  private readonly options: IServerOptions = {}
  get port(): number {
    return this._port
  }

  constructor(options?: IServerOptions) {
    if (options) {
      this.options = options
    }

    if (this.options.port !== undefined) {
      this._port = this.options.port
    }

    this.connections = new Map<Socket, Connection>()
    this.exchanges = new Map<string, Exchange>()
    this.queues = new Map<string, Queue>()
    this.server = createServer(this.onNewConnection.bind(this))
  }

  public async start(): Promise<void> {
    return new Promise((resolve, _) => {
      this.server.listen(this._port, '127.0.0.1', () => {
        const address = this.server.address()

        if (address && typeof address !== 'string') {
          this._port = address.port
        }

        resolve()
        debug(`Server started on ${this._port}.`)
      })
    })
  }

  public addExchange(declareFrame: DeclareExchange) {
    this.exchanges.set(declareFrame.exchange, new Exchange(declareFrame))
  }

  public addQueue(declareFrame: DeclareQueue) {
    this.queues.set(declareFrame.queue, new Queue(declareFrame))
  }

  private onNewConnection(socket: Socket) {
    const newConnection = new Connection(socket, this, this.options.onPublish)

    this.connections.set(socket, newConnection)
    newConnection.on('close', this.onConnectionClose.bind(this))
    newConnection.start()
  }

  private onConnectionClose(socket: Socket) {
    this.connections.delete(socket)
  }

  public async stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.connections.forEach((value: Connection, key: Socket) => {
        key.destroy()
      })

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

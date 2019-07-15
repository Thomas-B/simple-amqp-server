import { Connection } from './connection'
import { Server as TCPServer, createServer, Socket, AddressInfo } from 'net'
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

  private onNewConnection(socket: Socket) {
    const newConnection = new Connection(socket, this.options.onPublish)

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

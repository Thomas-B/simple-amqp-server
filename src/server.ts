import { Connection } from "./connection";
import { Server as TCPServer, createServer, Socket } from "net";
import { debug as d } from "debug";

const debug = d("sas:main");

class Server {
  private readonly connections: Map<Socket, Connection>;
  private readonly server: TCPServer;
  private readonly port: number = 5672;

  constructor() {
    this.connections = new Map<Socket, Connection>();
    this.server = createServer(this.onNewConnection.bind(this));
  }

  public async start(): Promise<void> {
    return new Promise((resolve, _) => {
      this.server.listen(this.port, "127.0.0.1", () => {
        resolve();
        debug(`Server started on ${this.port}.`);
      });
    });
  }

  private onNewConnection(socket: Socket) {
    const newConnection = new Connection(socket);

    this.connections.set(socket, newConnection);
    newConnection.on("close", this.onConnectionClose.bind(this));
    newConnection.start();
  }

  private onConnectionClose(socket: Socket) {
    this.connections.delete(socket);
  }

  public async stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.server.close((err?: Error) => {
        if (err) {
          return reject(err);
        }
        return resolve();
      });
    });
  }
}

export { Server };

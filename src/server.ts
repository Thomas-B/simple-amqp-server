import { Connection } from "./connection";
import { Server as TCPServer, createServer, Socket } from "net";

class Server {
  private readonly connections: Map<Socket, Connection>;
  private readonly server: TCPServer;
  constructor() {
    this.connections = new Map<Socket, Connection>();
    this.server = createServer(this.onNewConnection.bind(this));
  }

  public async start(): Promise<void> {
    return new Promise((resolve, _) => {
      this.server.listen(5672, "127.0.0.1", () => {
        resolve();
        console.log("Server started.");
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
}

export { Server };

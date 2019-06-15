import { createServer } from "net";
import { Connection } from "./connection";

function main() {
  const connections: Connection[] = [];
  const server = createServer(socket => {
    const newConnection = new Connection(socket);
    newConnection.start();
    connections.push(newConnection);
  });

  server.listen(5672, "0.0.0.0", () => {
    console.log("Server started.");
  });
}

main();

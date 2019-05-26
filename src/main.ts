import { createServer } from "net";

function main() {
  const server = createServer(socket => {
    socket.on("data", (data: Buffer) => {
      console.log(data, data.toString());
      const payload = Buffer.concat([
        new Buffer([0, 10, 0, 10, 0, 9])
        // Buffer.from("plain")
      ]);
      const size = payload.length;

      const message = Buffer.concat([
        new Buffer([1, 0, 0, 0, 0, 0, size]),
        payload,
        Buffer.from([206])
      ]);
      console.log(message);
      socket.write(message);
      socket.destroy();
    });
  });

  server.listen(5672, "0.0.0.0");
}

main();

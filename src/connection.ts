import { Channel } from "./channel";
import { Socket } from "net";
import { ConnectionStart } from "./frames/connection-start";
import { WireFrame } from "./frames/wire-frame";
import { FrameType } from "./constants";

class Connection {
  private channels: (Channel | undefined)[];
  private currentChannelId: number;
  constructor(private socket: Socket) {
    this.channels = [];
    this.currentChannelId = 0;
  }

  private getNewChannelId(): number {
    return this.currentChannelId++;
  }

  private handleConnection(data: Buffer): void {
    const firstFrame = Buffer.from([
      "A".charCodeAt(0),
      "M".charCodeAt(0),
      "Q".charCodeAt(0),
      "P".charCodeAt(0),
      0,
      0,
      9,
      1
    ]);

    if (firstFrame.compare(data)) {
      return this.socket.destroy();
    }

    const connectionStartFrame = new ConnectionStart(
      0,
      9,
      {
        toto: "test"
      },
      "PLAIN",
      "en_US"
    ).toBuffer();

    this.socket.removeAllListeners("data");
    this.socket.on("data", this.handleData.bind(this));
    this.socket.write(connectionStartFrame);
  }

  private handleData(data: Buffer) {
    const wireFrame = new WireFrame(data);

    // heartbeat we might have to do something with it
    if (wireFrame.frameType === FrameType.HeartBeat) {
      return;
    }

    let channel = this.channels[wireFrame.channel];

    if (!channel) {
      channel = new Channel(this.getNewChannelId(), this);
      this.channels.push(channel);
    }

    channel.handleWireFrame(wireFrame);
  }

  private handleClose(data: Buffer) {
    console.log("connection closed");
  }

  public send(data: Buffer) {
    this.socket.write(data);
  }

  public start() {
    const connectionChannel = new Channel(this.getNewChannelId(), this);

    this.channels.push(connectionChannel);
    this.socket.on("data", this.handleConnection.bind(this));
    this.socket.on("close", this.handleClose.bind(this));
    this.socket.on("error", this.handleClose.bind(this));
    this.socket.on("timeout", this.handleClose.bind(this));
  }
}

export { Connection };

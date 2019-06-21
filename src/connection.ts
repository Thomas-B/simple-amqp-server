import { Channel } from "./channel";
import { Socket } from "net";
import { ConnectionStart } from "./frames/connection-start";
import { WireFrame } from "./frames/wire-frame";
import { FrameType } from "./constants";
import { HeartBeat } from "./frames/heart-beat";

class Connection {
  private channels: (Channel | undefined)[];
  private currentChannelId: number;

  constructor(private socket: Socket) {
    console.log("new connection");
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

  private handleData(data: Buffer): void {
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

  private handleClose(data: Buffer): void {
    console.log("connection closed");
  }

  private handleError(err: Error): void {
    console.log(`Got a Connection error ${err.message}`);
  }
  public send(data: Buffer): void {
    this.socket.write(data);
  }

  public start(): void {
    const connectionChannel = new Channel(this.getNewChannelId(), this);

    this.channels.push(connectionChannel);
    this.socket.on("data", this.handleConnection.bind(this));
    this.socket.on("close", this.handleClose.bind(this));
    this.socket.on("error", this.handleError.bind(this));
    this.socket.on("timeout", this.handleClose.bind(this));
  }

  private sendHeartBeat(heartBeatDelay: number, payload: Buffer): void {
    setTimeout(() => {
      this.socket.write(payload);
      this.sendHeartBeat(heartBeatDelay, payload);
    }, (heartBeatDelay / 2) * 1000);
  }

  public startSendHeartBeat(heartBeatDelay: number): void {
    // It should always be zero because heartbeat are only sent on the connection channel
    const hb = new HeartBeat(0).toBuffer();
    this.sendHeartBeat(heartBeatDelay, hb);
  }
}

export { Connection };

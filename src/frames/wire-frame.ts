import { AmqpFrameReader } from "./amqp-frame-reader";

class WireFrame {
  public frameType: number;
  public channel: number;
  public payload: Buffer;

  constructor(data: Buffer) {
    const amqpReader = new AmqpFrameReader(data);
    this.frameType = amqpReader.readByte();
    this.channel = amqpReader.readShort();
    this.payload = amqpReader.readRest();
  }
}

export { WireFrame };

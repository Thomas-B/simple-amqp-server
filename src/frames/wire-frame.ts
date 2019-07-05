import { AmqpFrameReader } from "./amqp-frame-reader";

class WireFrame {
  public frameType: number;
  public channel: number;
  public payload: Buffer;
  public readonly length: number;

  constructor(data: Buffer) {
    const amqpReader = new AmqpFrameReader(data);
    this.frameType = amqpReader.readByte();
    this.channel = amqpReader.readShort();
    this.payload = amqpReader.readRest();
    this.length = amqpReader.getReadOffset() + 1; // this should be the terminating byte
  }
}

export { WireFrame };

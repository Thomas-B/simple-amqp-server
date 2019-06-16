import { AmqpFrameReader } from "./amqp-frame-reader";

class Open {
  public virtualHost: string;
  public reserved1: string;
  public reserved2: boolean;

  constructor(data: Buffer) {
    const amqpReader = new AmqpFrameReader(data);

    // re-read class and method ids
    amqpReader.readShort();
    amqpReader.readShort();
    this.virtualHost = amqpReader.readShortstr();
    this.reserved1 = amqpReader.readShortstr();
    this.reserved2 = Boolean(amqpReader.readByte());
  }
}

export { Open };

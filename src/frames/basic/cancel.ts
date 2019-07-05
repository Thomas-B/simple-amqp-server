import { AmqpFrameReader } from "../amqp-frame-reader";

class Cancel {
  public readonly consumerTag: string;
  public readonly noWait: boolean;

  constructor(data: Buffer) {
    const amqpReader = new AmqpFrameReader(data);

    // re-read class and method ids
    amqpReader.readShort();
    amqpReader.readShort();

    this.consumerTag = amqpReader.readShortstr();
    const bits = amqpReader.readByte();
    this.noWait = (bits & 1) === 1;
  }
}

export { Cancel };

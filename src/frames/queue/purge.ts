import { AmqpFrameReader } from "../amqp-frame-reader";

class Purge {
  public readonly reserved1: number;
  public readonly queue: string;
  public readonly noWait: boolean;

  constructor(data: Buffer) {
    const amqpReader = new AmqpFrameReader(data);

    // re-read class and method ids
    amqpReader.readShort();
    amqpReader.readShort();

    this.reserved1 = amqpReader.readShort();
    this.queue = amqpReader.readShortstr();
    const bits = amqpReader.readByte();

    this.noWait = (bits & 1) === 1;
  }
}

export { Purge };

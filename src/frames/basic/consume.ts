import { AmqpFrameReader } from "../amqp-frame-reader";

class Consume {
  public readonly reserved1: number;
  public readonly queue: string;
  public readonly consumerTag: string;
  public readonly noLocal: boolean;
  public readonly noAck: boolean;
  public readonly exclusive: boolean;
  public readonly noWait: boolean;
  public readonly arguments: object;

  constructor(data: Buffer) {
    const amqpReader = new AmqpFrameReader(data);

    // re-read class and method ids
    amqpReader.readShort();
    amqpReader.readShort();

    this.reserved1 = amqpReader.readShort();
    this.queue = amqpReader.readShortstr();
    this.consumerTag = amqpReader.readShortstr();
    const bits = amqpReader.readByte();
    this.arguments = amqpReader.readTable();

    this.noLocal = ((bits >> 0) & 1) === 1;
    this.noAck = ((bits >> 1) & 1) === 1;
    this.exclusive = ((bits >> 2) & 1) === 1;
    this.noWait = ((bits >> 3) & 1) === 1;
  }
}

export { Consume };

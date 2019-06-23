import { AmqpFrameReader } from "../amqp-frame-reader";

class Open {
  public readonly reserved1: string;
  constructor(data: Buffer) {
    const amqpReader = new AmqpFrameReader(data);

    this.reserved1 = amqpReader.readShortstr();
  }
}

export { Open };

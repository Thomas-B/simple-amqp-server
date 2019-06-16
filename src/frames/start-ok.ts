import { AmqpFrameReader } from "./amqp-frame-reader";

class StartOk {
  public clientProperties: object;
  public mechanism: string;
  public response: string;
  public locale: string;

  constructor(data: Buffer) {
    const amqpReader = new AmqpFrameReader(data);

    // re-read class and method ids
    amqpReader.readShort();
    amqpReader.readShort();

    this.clientProperties = amqpReader.readTable();
    this.mechanism = amqpReader.readShortstr();
    this.response = amqpReader.readLongstr();
    this.locale = amqpReader.readShortstr();
  }
}

export { StartOk };

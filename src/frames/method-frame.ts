import { AmqpFrameReader } from "./amqp-frame-reader";

class MethodFrame {
  public classId: number;
  public methodId: number;
  public payload: Buffer;

  constructor(data: Buffer) {
    const amqpReader = new AmqpFrameReader(data);
    this.classId = amqpReader.readShort();
    this.methodId = amqpReader.readShort();
    this.payload = amqpReader.readRest();
  }
}

export { MethodFrame };

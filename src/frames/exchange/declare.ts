import { AmqpFrameReader } from "../amqp-frame-reader";

class Declare {
  constructor(data: Buffer) {
    const amqpReader = new AmqpFrameReader(data);
  }
}

export { Declare };

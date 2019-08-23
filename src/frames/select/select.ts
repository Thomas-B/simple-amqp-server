import { AmqpFrameReader } from '../amqp-frame-reader'

class Select {
  public readonly noWait: boolean

  constructor(data: Buffer) {
    const amqpReader = new AmqpFrameReader(data)

    // re-read class and method ids
    amqpReader.readShort()
    amqpReader.readShort()

    const bits = amqpReader.readByte()

    this.noWait = ((bits >> 0) & 1) === 1
  }
}

export { Select }

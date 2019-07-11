import { AmqpFrameReader } from '../amqp-frame-reader'

class Get {
  public readonly reserved1: number
  public readonly noAck: boolean
  public readonly queue: string

  constructor(data: Buffer) {
    const amqpReader = new AmqpFrameReader(data)

    // re-read class and method ids
    amqpReader.readShort()
    amqpReader.readShort()

    this.reserved1 = amqpReader.readShort()
    this.queue = amqpReader.readShortstr()
    const bits = amqpReader.readByte()
    this.noAck = (bits & 1) === 1
  }
}

export { Get }

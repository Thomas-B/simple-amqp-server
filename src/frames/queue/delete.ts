import { AmqpFrameReader } from '../amqp-frame-reader'

class Delete {
  public readonly reserved1: number
  public readonly exchange: string

  constructor(data: Buffer) {
    const amqpReader = new AmqpFrameReader(data)

    // re-read class and method ids
    amqpReader.readShort()
    amqpReader.readShort()

    this.reserved1 = amqpReader.readShort()
    this.exchange = amqpReader.readShortstr()
  }
}

export { Delete }

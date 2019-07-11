import { AmqpFrameReader } from '../amqp-frame-reader'

class QOS {
  public readonly prefetchSize: number
  public readonly prefetchCount: number
  public readonly global: boolean

  constructor(data: Buffer) {
    const amqpReader = new AmqpFrameReader(data)

    // re-read class and method ids
    amqpReader.readShort()
    amqpReader.readShort()

    this.prefetchSize = amqpReader.readLong()
    this.prefetchCount = amqpReader.readShort()
    const bits = amqpReader.readByte()

    this.global = (bits & 1) === 1
  }
}

export { QOS }

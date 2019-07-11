import { AmqpFrameReader } from '../amqp-frame-reader'

class Reject {
  public readonly deliveryTag: bigint
  public readonly requeue: boolean

  constructor(data: Buffer) {
    const amqpReader = new AmqpFrameReader(data)

    // re-read class and method ids
    amqpReader.readShort()
    amqpReader.readShort()

    this.deliveryTag = amqpReader.readLongLong()
    const bits = amqpReader.readByte()
    this.requeue = (bits & 1) === 1
  }
}

export { Reject }

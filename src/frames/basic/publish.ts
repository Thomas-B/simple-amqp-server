import { AmqpFrameReader } from '../amqp-frame-reader'

class Publish {
  public readonly reserved1: number
  public readonly exchangeName: string
  public readonly routingKey: string
  public readonly mandatory: boolean
  public readonly immediate: boolean

  constructor(data: Buffer) {
    const amqpReader = new AmqpFrameReader(data)

    // re-read class and method ids
    amqpReader.readShort()
    amqpReader.readShort()

    this.reserved1 = amqpReader.readShort()
    this.exchangeName = amqpReader.readShortstr()
    this.routingKey = amqpReader.readShortstr()
    const bits = amqpReader.readByte()

    this.mandatory = (bits & 1) === 1
    this.immediate = ((bits >> 1) & 1) === 1
  }
}

export { Publish }

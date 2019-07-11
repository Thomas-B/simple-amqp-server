import { AmqpFrameReader } from '../amqp-frame-reader'

class Bind {
  public readonly reserved1: number
  public readonly queue: string
  public readonly exchange: string
  public readonly routingKey: string
  public readonly noWait: boolean
  public readonly arguments: object

  constructor(data: Buffer) {
    const amqpReader = new AmqpFrameReader(data)

    // re-read class and method ids
    amqpReader.readShort()
    amqpReader.readShort()

    this.reserved1 = amqpReader.readShort()
    this.queue = amqpReader.readShortstr()
    this.exchange = amqpReader.readShortstr()
    this.routingKey = amqpReader.readShortstr()
    const bits = amqpReader.readByte()
    this.arguments = amqpReader.readTable()

    this.noWait = (bits & 1) === 1
  }
}

export { Bind }

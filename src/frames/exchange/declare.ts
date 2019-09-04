import { AmqpFrameReader } from '../amqp-frame-reader'

class Declare {
  public readonly reserved1: number
  public readonly exchange: string
  public readonly type: 'direct' | 'fanout' | 'topic'
  public readonly passive: boolean
  public readonly durable: boolean
  public readonly exclusive: boolean
  public readonly autoDelete: boolean
  public readonly noWait: boolean
  public readonly arguments: object

  constructor(data: Buffer) {
    const amqpReader = new AmqpFrameReader(data)

    // re-read class and method ids
    amqpReader.readShort()
    amqpReader.readShort()

    this.reserved1 = amqpReader.readShort()
    this.exchange = amqpReader.readShortstr()
    const type = amqpReader.readShortstr()
    if (type === 'direct' || type === 'fanout' || type === 'topic') {
      this.type = type
    } else {
      throw new Error('received bad exchange type')
    }
    const bits = amqpReader.readByte()
    this.arguments = amqpReader.readTable()

    this.passive = ((bits >> 0) & 1) === 1
    this.durable = ((bits >> 1) & 1) === 1
    this.exclusive = ((bits >> 2) & 1) === 1
    this.autoDelete = ((bits >> 3) & 1) === 1
    this.noWait = ((bits >> 4) & 1) === 1
  }
}

export { Declare }

import { AmqpFrameReader } from '../amqp-frame-reader'

class TuneOk {
  public maxChannel: number
  public maxFrameSize: number
  public heartBeatDelay: number

  constructor(data: Buffer) {
    const amqpReader = new AmqpFrameReader(data)

    // re-read class and method ids
    amqpReader.readShort()
    amqpReader.readShort()

    this.maxChannel = amqpReader.readShort()
    this.maxFrameSize = amqpReader.readLong()
    this.heartBeatDelay = amqpReader.readShort()
  }
}

export { TuneOk }

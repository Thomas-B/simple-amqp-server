import { AmqpFrameReader } from '../amqp-frame-reader'
import { AmqpFrameWriter } from '../amqp-frame-writer'
import { Frame } from '../frame'
import { FrameType, ClassId, BasicMethodId } from '../../constants'

class AckReader {
  public readonly deliveryTag: bigint
  public readonly multiple: boolean

  constructor(data: Buffer) {
    const amqpReader = new AmqpFrameReader(data)

    // re-read class and method ids
    amqpReader.readShort()
    amqpReader.readShort()

    this.deliveryTag = amqpReader.readLongLong()
    const bits = amqpReader.readByte()

    this.multiple = (bits & 1) === 1
  }
}

class AckWriter extends Frame {
  constructor(
    private readonly deliveryTag: bigint,
    private readonly multiple: boolean,
    channelId: number
  ) {
    super(FrameType.Method, ClassId.Basic, BasicMethodId.Ack, channelId)
  }

  protected getPayload(): Buffer {
    const payload = new AmqpFrameWriter()

    payload.writeLongLong(this.deliveryTag)
    let bits = 0
    if (this.multiple) {
      bits |= 1
    }
    payload.writeByte(bits)

    return payload.toBuffer()
  }
}

export { AckReader, AckWriter }

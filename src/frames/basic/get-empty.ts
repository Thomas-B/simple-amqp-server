import { ClassId, FrameType, BasicMethodId } from '../../constants'
import { Frame } from '../frame'
import { AmqpFrameWriter } from '../amqp-frame-writer'

class GetEmpty extends Frame {
  constructor(private readonly reserved1: number, channelId: number) {
    super(FrameType.Method, ClassId.Exchange, BasicMethodId.GetEmpty, channelId)
  }

  protected getPayload(): Buffer {
    const payload = new AmqpFrameWriter()

    payload.writeShort(this.reserved1)
    return payload.toBuffer()
  }
}

export { GetEmpty }

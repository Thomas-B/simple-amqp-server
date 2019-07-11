import { AmqpFrameWriter } from '../amqp-frame-writer'
import { ClassId, ChannelMethodId, FrameType } from '../../constants'
import { Frame } from '../frame'

class OpenOk extends Frame {
  constructor(public readonly reserved1: string, channelId: number) {
    super(FrameType.Method, ClassId.Channel, ChannelMethodId.OpenOk, channelId)
  }

  getPayload(): Buffer {
    const payload = new AmqpFrameWriter()

    payload.writeLongStr(this.reserved1)

    return payload.toBuffer()
  }
}

export { OpenOk }

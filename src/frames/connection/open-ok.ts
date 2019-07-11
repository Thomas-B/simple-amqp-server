import { AmqpFrameWriter } from '../amqp-frame-writer'
import { ClassId, ConnectionMethodId, FrameType } from '../../constants'
import { Frame } from '../frame'

class OpenOk extends Frame {
  constructor(private reserved1: string, channelId: number) {
    super(FrameType.Method, ClassId.Connnection, ConnectionMethodId.OpenOk, channelId)
  }

  protected getPayload(): Buffer {
    const payload = new AmqpFrameWriter()

    payload.writeShortStr(this.reserved1)

    return payload.toBuffer()
  }
}

export { OpenOk }

import { AmqpFrameWriter } from '../amqp-frame-writer'
import { ClassId, ConnectionMethodId, FrameType } from '../../constants'
import { Frame } from '../frame'

class Tune extends Frame {
  constructor(
    private readonly maxChannels: number,
    private readonly maxFrameSize: number,
    private readonly hearBeartInterval: number,
    channelId: number
  ) {
    super(FrameType.Method, ClassId.Connnection, ConnectionMethodId.Tune, channelId)
  }

  protected getPayload(): Buffer {
    const payload = new AmqpFrameWriter()

    payload.writeShort(this.maxChannels)
    payload.writeLong(this.maxFrameSize)
    payload.writeShort(this.hearBeartInterval)

    return payload.toBuffer()
  }
}

export { Tune }

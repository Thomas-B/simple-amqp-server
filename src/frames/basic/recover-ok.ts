import { ClassId, FrameType, BasicMethodId } from '../../constants'
import { Frame } from '../frame'

class RecoverOk extends Frame {
  constructor(channelId: number) {
    super(FrameType.Method, ClassId.Exchange, BasicMethodId.RecoverOk, channelId)
  }

  protected getPayload(): Buffer {
    return Buffer.from([])
  }
}

export { RecoverOk }

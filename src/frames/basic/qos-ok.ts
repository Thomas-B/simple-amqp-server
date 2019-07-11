import { ClassId, FrameType, BasicMethodId } from '../../constants'
import { Frame } from '../frame'

class QOSOk extends Frame {
  constructor(channelId: number) {
    super(FrameType.Method, ClassId.Exchange, BasicMethodId.QOSOk, channelId)
  }

  protected getPayload(): Buffer {
    return Buffer.from([])
  }
}

export { QOSOk }

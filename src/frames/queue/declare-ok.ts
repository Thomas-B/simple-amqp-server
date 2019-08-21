import { ClassId, FrameType, QueueMethodId } from '../../constants'
import { Frame } from '../frame'

class DeclareOk extends Frame {
  constructor(channelId: number) {
    super(FrameType.Method, ClassId.Queue, QueueMethodId.DeclareOk, channelId)
  }

  protected getPayload(): Buffer {
    return Buffer.from([])
  }
}

export { DeclareOk }

import { ClassId, FrameType, QueueMethodId } from '../../constants'
import { Frame } from '../frame'

class PurgeOk extends Frame {
  constructor(channelId: number) {
    super(FrameType.Method, ClassId.Queue, QueueMethodId.PurgeOk, channelId)
  }

  protected getPayload(): Buffer {
    return Buffer.from([])
  }
}

export { PurgeOk }

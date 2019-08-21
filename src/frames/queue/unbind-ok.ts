import { ClassId, FrameType, ExchangeMethodId } from '../../constants'
import { Frame } from '../frame'

class UnBindOk extends Frame {
  constructor(channelId: number) {
    super(FrameType.Method, ClassId.Queue, ExchangeMethodId.UnBindOk, channelId)
  }

  protected getPayload(): Buffer {
    return Buffer.from([])
  }
}

export { UnBindOk }

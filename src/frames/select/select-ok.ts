import { ClassId, FrameType, ConfirmMethodId } from '../../constants'
import { Frame } from '../frame'

class SelectOk extends Frame {
  constructor(channelId: number) {
    super(FrameType.Method, ClassId.Confirm, ConfirmMethodId.SelectOk, channelId)
  }

  protected getPayload(): Buffer {
    return Buffer.from([])
  }
}

export { SelectOk }

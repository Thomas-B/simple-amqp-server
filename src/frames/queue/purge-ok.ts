import { ClassId, FrameType, QueueMethodId } from "../../constants";
import { Frame } from "../frame";

class PurgeOk extends Frame {
  constructor(channelId: number) {
    super(FrameType.Method, ClassId.Exchange, QueueMethodId.PurgeOk, channelId);
  }

  protected getPayload(): Buffer {
    return Buffer.from([]);
  }
}

export { PurgeOk };

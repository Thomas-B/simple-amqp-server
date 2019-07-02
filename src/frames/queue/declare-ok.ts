import { ClassId, FrameType, QueueMethodId } from "../../constants";
import { Frame } from "../frame";

class DeclareOk extends Frame {
  constructor(channelId: number) {
    super(
      FrameType.Method,
      ClassId.Exchange,
      QueueMethodId.DeclareOk,
      channelId
    );
  }

  protected getPayload(): Buffer {
    return Buffer.from([]);
  }
}

export { DeclareOk };

import { ClassId, FrameType, ExchangeMethodId } from "../../constants";
import { Frame } from "../frame";

class DeleteOk extends Frame {
  constructor(channelId: number) {
    super(
      FrameType.Method,
      ClassId.Exchange,
      ExchangeMethodId.DeleteOk,
      channelId
    );
  }

  protected getPayload(): Buffer {
    return Buffer.from([]);
  }
}

export { DeleteOk };

import { ClassId, FrameType, ExchangeMethodId } from "../../constants";
import { Frame } from "../frame";

class BindOk extends Frame {
  constructor(channelId: number) {
    super(
      FrameType.Method,
      ClassId.Exchange,
      ExchangeMethodId.BindOk,
      channelId
    );
  }

  protected getPayload(): Buffer {
    return Buffer.from([]);
  }
}

export { BindOk };

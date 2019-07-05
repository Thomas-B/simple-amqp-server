import { ClassId, FrameType, BasicMethodId } from "../../constants";
import { Frame } from "../frame";
import { AmqpFrameWriter } from "../amqp-frame-writer";

class ConsumeOk extends Frame {
  constructor(private readonly consumerTag: string, channelId: number) {
    super(
      FrameType.Method,
      ClassId.Exchange,
      BasicMethodId.ConsumeOk,
      channelId
    );
  }

  protected getPayload(): Buffer {
    const payload = new AmqpFrameWriter();

    payload.writeShortStr(this.consumerTag);
    return payload.toBuffer();
  }
}

export { ConsumeOk };

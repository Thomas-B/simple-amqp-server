import { AmqpFrameWriter } from "../amqp-frame-writer";
import { ClassId, ConnectionMethodId, EOB, FrameType } from "../../constants";
import { Frame } from "../frame";

class OpenOk extends Frame {
  constructor(private reserved1: string, channelId: number) {
    super(
      FrameType.Method,
      ClassId.Connnection,
      ConnectionMethodId.OpenOk,
      channelId
    );
  }

  protected getPayload(): Buffer {
    const payload = new AmqpFrameWriter();

    payload.writeShort(this.classId);
    payload.writeShort(this.methodId);
    payload.writeShortStr(this.reserved1);

    return payload.toBuffer();
  }
}

export { OpenOk };

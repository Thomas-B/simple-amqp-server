import { AmqpFrameWriter } from "../amqp-frame-writer";
import { ClassId, ConnectionMethodId, EOB, FrameType } from "../../constants";
import { Frame } from "../frame";

class Tune extends Frame {
  constructor(
    private maxChannels: number,
    private maxFrameSize: number,
    private hearBeartInterval: number,
    channelId: number
  ) {
    super(
      FrameType.Method,
      ClassId.Connnection,
      ConnectionMethodId.Tune,
      channelId
    );
  }

  protected getPayload(): Buffer {
    const payload = new AmqpFrameWriter();

    payload.writeShort(this.classId);
    payload.writeShort(this.methodId);
    payload.writeShort(this.maxChannels);
    payload.writeLong(this.maxFrameSize);
    payload.writeShort(this.hearBeartInterval);

    return payload.toBuffer();
  }
}

export { Tune };

import { EOB } from "../constants";
import { AmqpFrameWriter } from "./amqp-frame-writer";

abstract class Frame {
  constructor(
    protected readonly frameType: number,
    protected readonly classId: number,
    protected readonly methodId: number,
    protected channelId?: number
  ) {}

  protected abstract getPayload(): Buffer;

  public setChannelId(channelId?: number) {
    this.channelId = channelId;
  }

  protected getCMBuffer(): Buffer {
    const payload = new AmqpFrameWriter();
    payload.writeShort(this.classId);
    payload.writeShort(this.methodId);
    return payload.toBuffer();
  }

  public toBuffer(): Buffer {
    const payload = Buffer.concat([this.getCMBuffer(), this.getPayload()]);
    const header = this.getHeader(payload.length);

    return Buffer.concat([header, payload, EOB]);
  }

  protected getHeader(size: number): Buffer {
    const header = new AmqpFrameWriter();

    if (this.channelId === undefined) {
      throw new Error("Missing channel Id");
    }

    header.writeByte(this.frameType);
    header.writeShort(this.channelId);
    header.writeLong(size);

    return header.toBuffer();
  }
}

export { Frame };

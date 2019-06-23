import { EOB } from "../constants";
import { AmqpFrameWriter } from "./amqp-frame-writer";

abstract class Frame {
  constructor(
    protected readonly frameType: number,
    protected readonly classId: number,
    protected readonly methodId: number,
    protected readonly channelId: number
  ) {}

  protected abstract getPayload(): Buffer;

  public toBuffer(): Buffer {
    const payload = this.getPayload();
    const header = this.getHeader(payload.length);

    return Buffer.concat([header, payload, EOB]);
  }

  protected getHeader(size: number): Buffer {
    const header = new AmqpFrameWriter();

    header.writeByte(this.frameType);
    header.writeShort(this.channelId);
    header.writeLong(size);

    return header.toBuffer();
  }
}

export { Frame };

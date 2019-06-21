import { AmqpFrameWriter } from "./amqp-frame-writer";

class HeartBeat {
  private frameType: number = 8;

  constructor(private channelId: number) {}

  private getPayload(): Buffer {
    return Buffer.from([]);
  }

  private getHeader(size: number): Buffer {
    const header = new AmqpFrameWriter();

    header.writeByte(this.frameType);
    header.writeShort(this.channelId);
    header.writeLong(size);

    return header.toBuffer();
  }

  public toBuffer(): Buffer {
    const payload = this.getPayload();
    const header = this.getHeader(payload.length);
    return Buffer.concat([header, payload, Buffer.from([206])]);
  }
}

export { HeartBeat };

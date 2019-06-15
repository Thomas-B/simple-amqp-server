import { AmqpFrameWriter } from "./amqp-frame-writer";

class ConnectionStart {
  private frameType: number = 1;
  private channelId: number = 0;
  private classId: number = 10;
  private methodId: number = 10;

  constructor(
    private major: number,
    private minor: number,
    private serverProperty: object,
    private mechanism: string,
    private locales: string
  ) {}

  private getHeader(size: number): Buffer {
    const header = new AmqpFrameWriter();

    header.writeByte(this.frameType);
    header.writeShort(this.channelId);
    header.writeLong(size);

    return header.toBuffer();
  }

  private getPayload(): Buffer {
    const payload = new AmqpFrameWriter();

    payload.writeShort(this.classId);
    payload.writeShort(this.methodId);
    payload.writeByte(this.major);
    payload.writeByte(this.minor);
    payload.writeTable(this.serverProperty);
    payload.writeLongStr(this.mechanism);
    payload.writeLongStr(this.locales);

    return payload.toBuffer();
  }

  public toBuffer(): Buffer {
    const payload = this.getPayload();
    const header = this.getHeader(payload.length);

    return Buffer.concat([header, payload, Buffer.from([206])]);
  }
}

export { ConnectionStart };

import { AmqpFrameWriter } from "./amqp-frame-writer";
import { ClassId, ConnectionMethodId } from "../constants";

class OpenOk {
  private frameType: number = 1;
  private classId: number = ClassId.Connnection;
  private methodId: number = ConnectionMethodId.OpenOk;

  constructor(private reserved1: string, private channelId: number) {}

  private getPayload(): Buffer {
    const payload = new AmqpFrameWriter();

    payload.writeShort(this.classId);
    payload.writeShort(this.methodId);
    payload.writeShortStr(this.reserved1);

    return payload.toBuffer();
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

export { OpenOk };

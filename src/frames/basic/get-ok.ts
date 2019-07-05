import { ClassId, FrameType, BasicMethodId } from "../../constants";
import { Frame } from "../frame";
import { AmqpFrameWriter } from "../amqp-frame-writer";

class GetOk extends Frame {
  constructor(
    private readonly deliveryTag: bigint,
    private readonly redelivered: boolean,
    private readonly exchangeName: string,
    private readonly routingKey: string,
    private readonly messageCount: number,
    channelId: number
  ) {
    super(FrameType.Method, ClassId.Exchange, BasicMethodId.GetOk, channelId);
  }

  protected getPayload(): Buffer {
    const payload = new AmqpFrameWriter();
    let bits = 0;

    if (this.redelivered) {
      bits |= 1;
    }

    payload.writeLongLong(this.deliveryTag);
    payload.writeByte(bits);
    payload.writeShortStr(this.exchangeName);
    payload.writeShortStr(this.routingKey);
    payload.writeLong(this.messageCount);

    return payload.toBuffer();
  }
}

export { GetOk };

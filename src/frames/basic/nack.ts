import { AmqpFrameReader } from "../amqp-frame-reader";
import { Frame } from "../frame";
import { FrameType, ClassId, BasicMethodId } from "../../constants";
import { AmqpFrameWriter } from "../amqp-frame-writer";

class NackReader {
  public readonly deliveryTag: bigint;
  public readonly multiple: boolean;
  public readonly requeue: boolean;

  constructor(data: Buffer) {
    const amqpReader = new AmqpFrameReader(data);

    // re-read class and method ids
    amqpReader.readShort();
    amqpReader.readShort();

    this.deliveryTag = amqpReader.readLongLong();
    const bits = amqpReader.readByte();

    this.multiple = (bits & 1) === 1;
    this.requeue = ((bits >> 1) & 1) === 1;
  }
}

class NackWriter extends Frame {
  constructor(
    private readonly deliveryTag: bigint,
    private readonly multiple: boolean,
    private readonly requeue: boolean,
    channelId: number
  ) {
    super(FrameType.Method, ClassId.Basic, BasicMethodId.Nack, channelId);
  }

  protected getPayload(): Buffer {
    const payload = new AmqpFrameWriter();

    payload.writeLongLong(this.deliveryTag);
    let bits = 0;

    if (this.multiple) {
      bits |= 1;
    }

    if (this.requeue) {
      bits |= 1 << 1;
    }

    payload.writeByte(bits);

    return payload.toBuffer();
  }
}

export { NackReader, NackWriter };

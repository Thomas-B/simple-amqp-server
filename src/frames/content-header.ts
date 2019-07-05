import { AmqpFrameReader } from "./amqp-frame-reader";

interface IProperties {
  contentType?: string;
  contentEncoding?: string;
  headers?: object;
  deliveryMode?: number;
  priority?: number;
  correlationId?: string;
  replyTo?: string;
  expiration?: string;
  messageId?: string;
  timestamp?: bigint;
  type?: string;
  userId?: string;
  appId?: string;
  reserved?: string;
}

class ContentHeader {
  public readonly contentClass: number;
  public readonly contentWeight: number;
  public readonly contentBodySize: bigint;
  private readonly propertyFlags: number;
  public readonly properties: IProperties;

  private readonly maskContentType = 1 << 15;
  private readonly maskContentEncoding = 1 << 14;
  private readonly maskHeaders = 1 << 13;
  private readonly maskDeliveryMode = 1 << 12;
  private readonly maskPriority = 1 << 11;
  private readonly maskCorrelationId = 1 << 10;
  private readonly maskReplyTo = 1 << 9;
  private readonly maskExpiration = 1 << 8;
  private readonly maskMessageId = 1 << 7;
  private readonly maskTimestamp = 1 << 6;
  private readonly maskType = 1 << 5;
  private readonly maskUserId = 1 << 4;
  private readonly maskAppId = 1 << 3;
  private readonly maskReserved = 1 << 2;

  constructor(data: Buffer) {
    const amqpReader = new AmqpFrameReader(data);

    this.contentClass = amqpReader.readShort();
    this.contentWeight = amqpReader.readShort();
    this.contentBodySize = amqpReader.readLongLong();
    this.propertyFlags = amqpReader.readShort();
    this.properties = this.readProperties(amqpReader);
  }

  private readProperties(amqpReader: AmqpFrameReader): IProperties {
    const properties: IProperties = {};

    if ((this.maskContentType & this.propertyFlags) !== 0) {
      properties.contentType = amqpReader.readShortstr();
    }

    if ((this.maskContentEncoding & this.propertyFlags) !== 0) {
      properties.contentEncoding = amqpReader.readShortstr();
    }

    if ((this.maskHeaders & this.propertyFlags) !== 0) {
      properties.headers = amqpReader.readTable();
    }

    if ((this.maskDeliveryMode & this.propertyFlags) !== 0) {
      properties.deliveryMode = amqpReader.readByte();
    }

    if ((this.maskPriority & this.propertyFlags) !== 0) {
      properties.priority = amqpReader.readByte();
    }

    if ((this.maskCorrelationId & this.propertyFlags) !== 0) {
      properties.correlationId = amqpReader.readShortstr();
    }

    if ((this.maskReplyTo & this.propertyFlags) !== 0) {
      properties.replyTo = amqpReader.readShortstr();
    }

    if ((this.maskExpiration & this.propertyFlags) !== 0) {
      properties.expiration = amqpReader.readShortstr();
    }

    if ((this.maskMessageId & this.propertyFlags) !== 0) {
      properties.messageId = amqpReader.readShortstr();
    }

    if ((this.maskTimestamp & this.propertyFlags) !== 0) {
      properties.timestamp = amqpReader.readLongLong();
    }

    if ((this.maskType & this.propertyFlags) !== 0) {
      properties.type = amqpReader.readShortstr();
    }

    if ((this.maskUserId & this.propertyFlags) !== 0) {
      properties.userId = amqpReader.readShortstr();
    }

    if ((this.maskAppId & this.propertyFlags) !== 0) {
      properties.appId = amqpReader.readShortstr();
    }

    if ((this.maskReserved & this.propertyFlags) !== 0) {
      properties.reserved = amqpReader.readShortstr();
    }

    return properties;
  }
}

export { ContentHeader };

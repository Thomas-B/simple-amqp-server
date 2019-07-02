import { WireFrame } from "./frames/wire-frame";
import {
  FrameType,
  ClassId,
  ConnectionMethodId,
  ChannelMethodId,
  ExchangeMethodId,
  QueueMethodId
} from "./constants";
import { Connection } from "./connection";
import { AmqpFrameReader } from "./frames/amqp-frame-reader";
import { ConnectionMethods } from "./connection-methods";
import { ChannelMethods } from "./channel-methods";
import { ExchangeMethods } from "./exchange-method";
import { QueueMethods } from "./queue-methods";

class Channel {
  constructor(
    private readonly id: number,
    private readonly connection: Connection
  ) {}

  public handleWireFrame(wireFrame: WireFrame): void {
    switch (wireFrame.frameType) {
      case FrameType.Method:
        this.handleMethod(wireFrame.payload);
        break;
      default:
        throw new Error(`Can't handle frame type = ${wireFrame.frameType}`);
    }
  }

  private handleMethod(payload: Buffer): void {
    const [classId, methodId] = AmqpFrameReader.readMethodIdentifiers(payload);
    console.log("handleMethod", classId, methodId, this.id);
    switch (classId) {
      case ClassId.Connnection:
        this.handleConnection(methodId, payload);
        break;
      case ClassId.Channel:
        this.handleChannel(methodId, payload);
        break;
      case ClassId.Exchange:
        this.handleExchange(methodId, payload);
        break;
      case ClassId.Queue:
        this.handleQueue(methodId, payload);
        break;
      case ClassId.Basic:
        break;
      case ClassId.TX:
        break;
      default:
        throw new Error(`Can't handle the Class id = ${classId}`);
    }
  }

  private handleQueue(methodId: number, payload: Buffer): void {
    switch (methodId) {
      case QueueMethodId.Declare:
        QueueMethods.Declare(payload, this.connection, this.id);
        break;
      case QueueMethodId.Delete:
        QueueMethods.Delete(payload, this.connection, this.id);
        break;
      case QueueMethodId.Bind:
        QueueMethods.Bind(payload, this.connection, this.id);
        break;
      case QueueMethodId.UnBind:
        QueueMethods.UnBind(payload, this.connection, this.id);
        break;
      case QueueMethodId.Purge:
        QueueMethods.Purge(payload, this.connection, this.id);
        break;
      default:
        throw new Error(`Can't handle Channel method id = ${methodId}`);
    }
  }

  private handleExchange(methodId: number, payload: Buffer): void {
    switch (methodId) {
      case ExchangeMethodId.Declare:
        ExchangeMethods.Declare(payload, this.connection, this.id);
        break;
      case ExchangeMethodId.Delete:
        ExchangeMethods.Delete(payload, this.connection, this.id);
        break;
      case ExchangeMethodId.Bind:
        ExchangeMethods.Bind(payload, this.connection, this.id);
        break;
      case ExchangeMethodId.UnBind:
        ExchangeMethods.UnBind(payload, this.connection, this.id);
        break;
      default:
        throw new Error(`Can't handle Channel method id = ${methodId}`);
    }
  }

  private handleChannel(methodId: number, payload: Buffer): void {
    switch (methodId) {
      case ChannelMethodId.Open:
        ChannelMethods.Open(payload, this.connection, this.id);
        break;
      case ChannelMethodId.Flow:
        ChannelMethods.Flow(payload, this.connection, this.id);
        break;
      case ChannelMethodId.FlowOk:
        ChannelMethods.FlowOk(payload, this.connection, this.id);
        break;
      case ChannelMethodId.Close:
        ChannelMethods.Close(payload, this.connection, this.id);
        break;
      case ChannelMethodId.CloseOk:
        ChannelMethods.CloseOk(payload, this.connection, this.id);
        break;
      default:
        throw new Error(`Can't handle Channel method id = ${methodId}`);
    }
  }

  private handleConnection(methodId: number, payload: Buffer): void {
    switch (methodId) {
      case ConnectionMethodId.StartOk:
        ConnectionMethods.startOk(payload, this.connection, this.id);
        break;

      case ConnectionMethodId.SecureOk:
        ConnectionMethods.secureOk(payload, this.connection, this.id);
        break;
      case ConnectionMethodId.TuneOk:
        ConnectionMethods.tuneOk(payload, this.connection, this.id);
        break;
      case ConnectionMethodId.Open:
        ConnectionMethods.open(payload, this.connection, this.id);
        break;
      case ConnectionMethodId.Close:
        ConnectionMethods.close(payload, this.connection, this.id);
        break;
      case ConnectionMethodId.CloseOk:
        ConnectionMethods.closeOk(payload, this.connection, this.id);
        break;
      default:
        throw new Error(`Can't handle connection method id = ${methodId}`);
    }
  }
}

export { Channel };

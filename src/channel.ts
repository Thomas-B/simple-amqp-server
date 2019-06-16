import { WireFrame } from "./frames/wire-frame";
import { FrameType, ClassId, ConnectionMethodId } from "./constants";
import { Connection } from "./connection";
import { AmqpFrameReader } from "./frames/amqp-frame-reader";
import { ConnectionMethods } from "./connection-methods";

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
    console.log(classId, methodId);
    switch (classId) {
      case ClassId.Connnection:
        this.handleConnection(methodId, payload);
        break;
      case ClassId.Channel:
        break;
      case ClassId.Exchange:
        break;
      case ClassId.Queue:
        break;
      case ClassId.Basic:
        break;
      case ClassId.TX:
        break;
      default:
        throw new Error(`Can't handle the Class id = ${classId}`);
    }
  }

  private handleConnection(methodId: number, payload: Buffer): void {
    switch (methodId) {
      case ConnectionMethodId.StartOk:
        ConnectionMethods.startOk(payload, this.connection);
        break;

      case ConnectionMethodId.SecureOk:
        ConnectionMethods.secureOk(payload, this.connection);
        break;
      case ConnectionMethodId.TuneOk:
        ConnectionMethods.tuneOk(payload, this.connection);
        break;
      case ConnectionMethodId.Open:
        ConnectionMethods.open(payload, this.connection);
        break;
      case ConnectionMethodId.Close:
        ConnectionMethods.close(payload, this.connection);
        break;
      case ConnectionMethodId.CloseOk:
        ConnectionMethods.closeOk(payload, this.connection);
        break;
      default:
        throw new Error(`Can't handle connection method id = ${methodId}`);
    }
  }
}

export { Channel };

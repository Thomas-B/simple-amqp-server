import { Connection } from "./connection";
import { Open } from "./frames/channel/open";
import { OpenOk } from "./frames/channel/open-ok";

abstract class ChannelMethods {
  public static Open(payload: Buffer, connection: Connection, channelId: number): void {
    const openFrame = new Open(payload);
    const reserved1 = "";
    const openOkFrame = new OpenOk(reserved1, channelId);

    // TODO maybe check if the new channel tops the maximum channel count
    // in this case may be we should send a Close frame
    console.log(openFrame);
    console.log(openOkFrame, openOkFrame.toBuffer());
    connection.send(openOkFrame.toBuffer());
  }

  public static Flow(payload: Buffer, connection: Connection, channelId: number): void {}
  public static FlowOk(payload: Buffer, connection: Connection, channelId: number): void {}
  public static Close(payload: Buffer, connection: Connection, channelId: number): void {}
  public static CloseOk(payload: Buffer, connection: Connection, channelId: number): void {}
}

export { ChannelMethods };

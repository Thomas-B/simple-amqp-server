import { Connection } from "./connection";
import { StartOk } from "./frames/start-ok";
import { Tune } from "./frames/tune";
import { TuneOk } from "./frames/tune-ok";
import { Open } from "./frames/open";
import { OpenOk } from "./frames/open-ok";

class ConnectionMethods {
  constructor() {}

  public static startOk(payload: Buffer, connection: Connection): void {
    const startOkFrame = new StartOk(payload);
    console.log("startOkFrame", startOkFrame);
    // TODO: update connection status'
    // TODO: authenticate
    const maxChannels = 4096;
    const maxFrameSize = 65536;
    const hearBeatInterval = 10;
    // this hard coded zero should come from the channel's id
    const tuneFrame = new Tune(maxChannels, maxFrameSize, hearBeatInterval, 0);
    connection.send(tuneFrame.toBuffer());
  }

  public static tuneOk(payload: Buffer, connection: Connection): void {
    const tuneOkFrame = new TuneOk(payload);
    console.log("tuneOkFrame", tuneOkFrame);
    // TODO: we are expected to send based the received frame duration
    // TODO: we should monitor client's heartbeat to remove dead ones
    console.log("start sending heartbeat");
    connection.startSendHeartBeat(tuneOkFrame.heartBeatDelay);
  }

  public static open(payload: Buffer, connection: Connection): void {
    const openFrame = new Open(payload);
    const openOkFrame = new OpenOk("", 0);

    // TODO: add support for virtual hosts
    console.log("openFrame", openFrame);
    connection.send(openOkFrame.toBuffer());
  }

  public static secureOk(payload: Buffer, connection: Connection): void {
    throw new Error("SecureOk not implemented.");
  }
  public static close(payload: Buffer, connection: Connection): void {
    throw new Error("Close not implemented.");
  }
  public static closeOk(payload: Buffer, connection: Connection): void {
    throw new Error("CloseOk not implemented.");
  }
}

export { ConnectionMethods };

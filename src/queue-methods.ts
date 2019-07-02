import { Connection } from "./connection";
import { Declare } from "./frames/queue/declare";
import { DeclareOk } from "./frames/queue/declare-ok";
import { Delete } from "./frames/queue/delete";
import { DeleteOk } from "./frames/queue/delete-ok";
import { Bind } from "./frames/queue/bind";
import { BindOk } from "./frames/queue/bind-ok";
import { UnBind } from "./frames/queue/unbind";
import { UnBindOk } from "./frames/queue/unbind-ok";
import { Purge } from "./frames/queue/purge";
import { PurgeOk } from "./frames/queue/purge-ok";

class QueueMethods {
  public static Declare(
    payload: Buffer,
    connection: Connection,
    channelId: number
  ): void {
    const declareFrame = new Declare(payload);
    const declareOkFrame = new DeclareOk(channelId);

    console.log("declareFrame", declareFrame);
    console.log("declareOkFrame", declareOkFrame, declareOkFrame.toBuffer());
    connection.send(declareOkFrame.toBuffer());
  }
  public static Delete(
    payload: Buffer,
    connection: Connection,
    channelId: number
  ): void {
    const deleteFrame = new Delete(payload);
    const deleteOkFrame = new DeleteOk(channelId);

    console.log("deleteFrame", deleteFrame);
    console.log("deleteOkFrame", deleteOkFrame, deleteOkFrame.toBuffer());
    connection.send(deleteOkFrame.toBuffer());
  }
  public static Bind(
    payload: Buffer,
    connection: Connection,
    channelId: number
  ): void {
    const bindFrame = new Bind(payload);
    const bindOkFrame = new BindOk(channelId);

    console.log("bindFrame", bindFrame);
    console.log("bindOkFrame", bindOkFrame, bindOkFrame.toBuffer());
    connection.send(bindOkFrame.toBuffer());
  }

  public static UnBind(
    payload: Buffer,
    connection: Connection,
    channelId: number
  ): void {
    const unBindFrame = new UnBind(payload);
    const unBindOkFrame = new UnBindOk(channelId);

    console.log("unBindFrame", unBindFrame);
    console.log("unBindOkFrame", unBindOkFrame, unBindOkFrame.toBuffer());
    connection.send(unBindOkFrame.toBuffer());
  }

  public static Purge(
    payload: Buffer,
    connection: Connection,
    channelId: number
  ): void {
    const purgeFrame = new Purge(payload);
    const purgeOkFrame = new PurgeOk(channelId);

    console.log("purgeFrame", purgeFrame);
    console.log("purgeOkFrame", purgeOkFrame, purgeOkFrame.toBuffer());
    connection.send(purgeOkFrame.toBuffer());
  }
}

export { QueueMethods };

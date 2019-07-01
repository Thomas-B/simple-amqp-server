import { Connection } from "./connection";
import { Declare } from "./frames/exchange/declare";
import { DeclareOk } from "./frames/exchange/declare-ok";
import { Delete } from "./frames/exchange/delete";
import { DeleteOk } from "./frames/exchange/delete-ok";
import { Bind } from "./frames/exchange/bind";
import { BindOk } from "./frames/exchange/bind-ok";
import { UnBind } from "./frames/exchange/unbind";
import { UnBindOk } from "./frames/exchange/unbind-ok";

class ExchangeMethods {
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
}

export { ExchangeMethods };

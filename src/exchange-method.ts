import { Connection } from './connection'
import { Declare } from './frames/exchange/declare'
import { DeclareOk } from './frames/exchange/declare-ok'
import { Delete } from './frames/exchange/delete'
import { DeleteOk } from './frames/exchange/delete-ok'
import { Bind } from './frames/exchange/bind'
import { BindOk } from './frames/exchange/bind-ok'
import { UnBind } from './frames/exchange/unbind'
import { UnBindOk } from './frames/exchange/unbind-ok'
import { debug as d } from 'debug'
import { Server } from './server'

const debug = d('sas:exchange-method')

class ExchangeMethods {
  public static Declare(
    payload: Buffer,
    connection: Connection,
    channelId: number,
    server: Server
  ): void {
    const declareFrame = new Declare(payload)
    const declareOkFrame = new DeclareOk(channelId)

    debug('declareFrame', declareFrame)
    debug('declareOkFrame', declareOkFrame, declareOkFrame.toBuffer())
    server.addExchange(declareFrame)
    connection.send(declareOkFrame.toBuffer())
  }

  public static Delete(
    payload: Buffer,
    connection: Connection,
    channelId: number,
    server: Server
  ): void {
    const deleteFrame = new Delete(payload)
    const deleteOkFrame = new DeleteOk(channelId)

    debug('deleteFrame', deleteFrame)
    debug('deleteOkFrame', deleteOkFrame, deleteOkFrame.toBuffer())
    connection.send(deleteOkFrame.toBuffer())
  }

  public static Bind(
    payload: Buffer,
    connection: Connection,
    channelId: number,
    server: Server
  ): void {
    const bindFrame = new Bind(payload)
    const bindOkFrame = new BindOk(channelId)

    debug('bindFrame', bindFrame)
    debug('bindOkFrame', bindOkFrame, bindOkFrame.toBuffer())
    connection.send(bindOkFrame.toBuffer())
  }

  public static UnBind(
    payload: Buffer,
    connection: Connection,
    channelId: number,
    server: Server
  ): void {
    const unBindFrame = new UnBind(payload)
    const unBindOkFrame = new UnBindOk(channelId)

    debug('unBindFrame', unBindFrame)
    debug('unBindOkFrame', unBindOkFrame, unBindOkFrame.toBuffer())
    connection.send(unBindOkFrame.toBuffer())
  }
}

export { ExchangeMethods }

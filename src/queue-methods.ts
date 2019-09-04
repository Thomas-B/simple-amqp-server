import { Connection } from './connection'
import { Declare } from './frames/queue/declare'
import { DeclareOk } from './frames/queue/declare-ok'
import { Delete } from './frames/queue/delete'
import { DeleteOk } from './frames/queue/delete-ok'
import { Bind } from './frames/queue/bind'
import { BindOk } from './frames/queue/bind-ok'
import { UnBind } from './frames/queue/unbind'
import { UnBindOk } from './frames/queue/unbind-ok'
import { Purge } from './frames/queue/purge'
import { PurgeOk } from './frames/queue/purge-ok'
import { debug as d } from 'debug'
import { Server } from './server'

const debug = d('sas:queue-method')

class QueueMethods {
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
    server.addQueue(declareFrame)
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

    // code to transform topic syntax to regex
    // var parts = strings.Split(key, ".")
    // for i, part := range parts {
    // 	if part == "*" {
    // 		parts[i] = `[^\.]+`
    // 	} else if part == "#" {
    // 		parts[i] = ".*"
    // 	} else {
    // 		parts[i] = regexp.QuoteMeta(parts[i])
    // 	}
    // }
    // expression := "^" + strings.Join(parts, `\.`) + "$"
    // var err error = nil
    // re, err = regexp.Compile(expression)
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

  public static Purge(
    payload: Buffer,
    connection: Connection,
    channelId: number,
    server: Server
  ): void {
    const purgeFrame = new Purge(payload)
    const purgeOkFrame = new PurgeOk(channelId)

    debug('purgeFrame', purgeFrame)
    debug('purgeOkFrame', purgeOkFrame, purgeOkFrame.toBuffer())
    connection.send(purgeOkFrame.toBuffer())
  }
}

export { QueueMethods }

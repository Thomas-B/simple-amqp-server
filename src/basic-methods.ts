import { Connection } from './connection'
import { Publish } from './frames/basic/publish'
import { Channel } from './channel'
import { debug as d } from 'debug'

const debug = d('sas:basic-method')

abstract class BasicMethods {
  static Recover(payload: Buffer, connection: Connection, channelId: number) {
    throw new Error("Basic.Recover's method not implemented.")
  }
  static RecoverAsync(payload: Buffer, connection: Connection, channelId: number) {
    throw new Error("Basic.RecoverAsync's method not implemented.")
  }
  static Reject(payload: Buffer, connection: Connection, channelId: number) {
    throw new Error("Basic.Reject's method not implemented.")
  }
  static Ack(payload: Buffer, connection: Connection, channelId: number) {
    throw new Error("Basic.Ack's method not implemented.")
  }
  static Get(payload: Buffer, connection: Connection, channelId: number) {
    throw new Error("Basic.Get's method not implemented.")
  }
  static Publish(payload: Buffer, connection: Connection, channel: Channel) {
    const publishFrame = new Publish(payload)

    debug(publishFrame)
    channel.newMessage(publishFrame)
  }
  static Cancel(payload: Buffer, connection: Connection, channelId: number) {
    throw new Error("Basic.Cancel's method not implemented.")
  }
  static Consume(payload: Buffer, connection: Connection, channelId: number) {
    throw new Error("Basic.Consume's method not implemented.")
  }
  static QOS(payload: Buffer, connection: Connection, channelId: number) {
    throw new Error("Basic.QOS's method not implemented.")
  }
}

export { BasicMethods }

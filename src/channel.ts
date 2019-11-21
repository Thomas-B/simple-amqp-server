import { WireFrame } from './frames/wire-frame'
import {
  FrameType,
  ClassId,
  ConnectionMethodId,
  ChannelMethodId,
  ExchangeMethodId,
  QueueMethodId,
  BasicMethodId,
  ConfirmMethodId
} from './constants'
import { Connection } from './connection'
import { AmqpFrameReader } from './frames/amqp-frame-reader'
import { ConnectionMethods } from './connection-methods'
import { ChannelMethods } from './channel-methods'
import { ExchangeMethods } from './exchange-method'
import { QueueMethods } from './queue-methods'
import { BasicMethods } from './basic-methods'
import { Publish } from './frames/basic/publish'
import { Message } from './message'
import { ContentHeader } from './frames/content-header'
import { debug as d } from 'debug'
import { onPublishCallback } from './onPublish'
import { ConfirmMethods } from './confirm-method'
import { Server } from './server'

const debug = d('sas:channel')

class Channel {
  private currentMessage?: Message
  constructor(
    private readonly id: number,
    private readonly connection: Connection,
    private readonly server: Server,
    private readonly onPublish?: onPublishCallback
  ) {}

  public handleWireFrame(wireFrame: WireFrame): void {
    debug(wireFrame)
    switch (wireFrame.frameType) {
      case FrameType.Method:
        this.handleMethod(wireFrame.payload)
        break
      case FrameType.Header:
        this.handleHeader(wireFrame.payload)
        break
      case FrameType.Body:
        this.handleBody(wireFrame.payload)
        break
      default:
        throw new Error(`Can't handle frame type = ${wireFrame.frameType}`)
    }
  }

  public newMessage(publishFrame: Publish): void {
    this.currentMessage = new Message(publishFrame)
  }

  private handleHeader(payload: Buffer): void {
    if (!this.currentMessage) {
      debug('Received header without receiving a Basic.Publish method')
      return
    }

    this.currentMessage.header = new ContentHeader(payload)
  }

  private handleBody(payload: Buffer): void {
    if (!this.currentMessage) {
      debug('Received body without receiving a Basic.Publish method')
      return
    }

    if (!this.currentMessage.header) {
      debug('Received body without receiving a Header frame')
      return
    }

    this.currentMessage.currentSize += BigInt(payload.length)
    this.currentMessage.payload = Buffer.concat([this.currentMessage.payload, payload])

    const isPayloadComplete =
      this.currentMessage.currentSize === this.currentMessage.header.contentBodySize

    if (!isPayloadComplete) {
      return
    }

    debug('Done receiving body')
    debug(this.currentMessage.payload.toString())

    if (this.onPublish) {
      this.onPublish(this.currentMessage)
    }
    this.currentMessage = undefined
  }

  private handleMethod(payload: Buffer): void {
    const [classId, methodId] = AmqpFrameReader.readMethodIdentifiers(payload)
    debug('handleMethod', classId, methodId, this.id)
    switch (classId) {
      case ClassId.Connnection:
        this.handleConnection(methodId, payload)
        break
      case ClassId.Channel:
        this.handleChannel(methodId, payload)
        break
      case ClassId.Exchange:
        this.handleExchange(methodId, payload)
        break
      case ClassId.Queue:
        this.handleQueue(methodId, payload)
        break
      case ClassId.Basic:
        this.handleBasic(methodId, payload)
        break
      case ClassId.Confirm:
        this.handleConfirm(methodId, payload)
        break
      case ClassId.TX:
        throw new Error('Tx methods not implemented')
      default:
        throw new Error(`Can't handle the Class id = ${classId}`)
    }
  }

  private handleConfirm(methodId: number, payload: Buffer) {
    switch (methodId) {
      case ConfirmMethodId.Select:
        ConfirmMethods.Select(payload, this.connection, this.id)
        break
      default:
        throw new Error(`Can't handle Confirm method id = ${methodId}`)
    }
  }

  private handleBasic(methodId: number, payload: Buffer): void {
    switch (methodId) {
      case BasicMethodId.QOS:
        BasicMethods.QOS(payload, this.connection, this.id)
        break
      case BasicMethodId.Consume:
        BasicMethods.Consume(payload, this.connection, this.id)
        break
      case BasicMethodId.Cancel:
        BasicMethods.Cancel(payload, this.connection, this.id)
        break
      case BasicMethodId.Publish:
        BasicMethods.Publish(payload, this.connection, this)
        break
      case BasicMethodId.Get:
        BasicMethods.Get(payload, this.connection, this.id)
        break
      case BasicMethodId.Ack:
        BasicMethods.Ack(payload, this.connection, this.id)
        break
      case BasicMethodId.Reject:
        BasicMethods.Reject(payload, this.connection, this.id)
        break
      case BasicMethodId.RecoverAsync:
        BasicMethods.RecoverAsync(payload, this.connection, this.id)
        break
      case BasicMethodId.Recover:
        BasicMethods.Recover(payload, this.connection, this.id)
        break
      default:
        throw new Error(`Can't handle Basic method id = ${methodId}`)
    }
  }

  private handleQueue(methodId: number, payload: Buffer): void {
    switch (methodId) {
      case QueueMethodId.Declare:
        QueueMethods.Declare(payload, this.connection, this.id, this.server)
        break
      case QueueMethodId.Delete:
        QueueMethods.Delete(payload, this.connection, this.id, this.server)
        break
      case QueueMethodId.Bind:
        QueueMethods.Bind(payload, this.connection, this.id, this.server)
        break
      case QueueMethodId.UnBind:
        QueueMethods.UnBind(payload, this.connection, this.id, this.server)
        break
      case QueueMethodId.Purge:
        QueueMethods.Purge(payload, this.connection, this.id, this.server)
        break
      default:
        throw new Error(`Can't handle Channel method id = ${methodId}`)
    }
  }

  private handleExchange(methodId: number, payload: Buffer): void {
    switch (methodId) {
      case ExchangeMethodId.Declare:
        ExchangeMethods.Declare(payload, this.connection, this.id, this.server)
        break
      case ExchangeMethodId.Delete:
        ExchangeMethods.Delete(payload, this.connection, this.id, this.server)
        break
      case ExchangeMethodId.Bind:
        ExchangeMethods.Bind(payload, this.connection, this.id, this.server)
        break
      case ExchangeMethodId.UnBind:
        ExchangeMethods.UnBind(payload, this.connection, this.id, this.server)
        break
      default:
        throw new Error(`Can't handle Channel method id = ${methodId}`)
    }
  }

  private handleChannel(methodId: number, payload: Buffer): void {
    switch (methodId) {
      case ChannelMethodId.Open:
        ChannelMethods.Open(payload, this.connection, this.id)
        break
      case ChannelMethodId.Flow:
        ChannelMethods.Flow(payload, this.connection, this.id)
        break
      case ChannelMethodId.FlowOk:
        ChannelMethods.FlowOk(payload, this.connection, this.id)
        break
      case ChannelMethodId.Close:
        ChannelMethods.Close(payload, this.connection, this.id)
        break
      case ChannelMethodId.CloseOk:
        ChannelMethods.CloseOk(payload, this.connection, this.id)
        break
      default:
        throw new Error(`Can't handle Channel method id = ${methodId}`)
    }
  }

  private handleConnection(methodId: number, payload: Buffer): void {
    switch (methodId) {
      case ConnectionMethodId.StartOk:
        ConnectionMethods.startOk(payload, this.connection, this.id)
        break

      case ConnectionMethodId.SecureOk:
        ConnectionMethods.secureOk(payload, this.connection, this.id)
        break
      case ConnectionMethodId.TuneOk:
        ConnectionMethods.tuneOk(payload, this.connection, this.id)
        break
      case ConnectionMethodId.Open:
        ConnectionMethods.open(payload, this.connection, this.id)
        break
      case ConnectionMethodId.Close:
        ConnectionMethods.close(payload, this.connection, this.id)
        break
      case ConnectionMethodId.CloseOk:
        ConnectionMethods.closeOk(payload, this.connection, this.id)
        break
      default:
        throw new Error(`Can't handle connection method id = ${methodId}`)
    }
  }
}

export { Channel }

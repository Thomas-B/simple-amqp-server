import { Channel } from './channel'
import { Socket } from 'net'
import { ConnectionStart } from './frames/connection/connection-start'
import { WireFrame } from './frames/wire-frame'
import { FrameType } from './constants'
import { HeartBeat } from './frames/heart-beat'
import { EventEmitter } from 'events'
import { debug as d } from 'debug'
import { onPublishCallback } from './onPublish'
import { Server } from './server'

const debug = d('sas:connection')

class Connection extends EventEmitter {
  private channels: Array<Channel | undefined>
  private currentChannelId: number
  private heartBeatTimeout?: NodeJS.Timeout

  constructor(
    private socket: Socket,
    private readonly server: Server,
    private readonly onPublish?: onPublishCallback
  ) {
    super()
    debug('new connection')
    this.channels = []
    this.currentChannelId = 0
  }

  private getNewChannelId(): number {
    return this.currentChannelId++
  }

  private handleConnection(data: Buffer): void {
    const firstFrame = Buffer.from([
      'A'.charCodeAt(0),
      'M'.charCodeAt(0),
      'Q'.charCodeAt(0),
      'P'.charCodeAt(0),
      0,
      0,
      9,
      1
    ])

    if (firstFrame.compare(data)) {
      return this.socket.destroy()
    }

    const connectionStartFrame = new ConnectionStart(
      0,
      9,
      {
        toto: 'test'
      },
      'PLAIN',
      'en_US'
    ).toBuffer()

    this.socket.removeAllListeners('data')
    this.socket.on('data', this.handleData.bind(this))
    this.socket.write(connectionStartFrame)
  }

  private handleData(data: Buffer): void {
    let dataOffset = 0
    // one packet can contain multiple frames
    while (dataOffset !== data.length) {
      debug(JSON.stringify(Array.from(data)))
      const frame = data.slice(dataOffset)
      const wireFrame = new WireFrame(frame)
      dataOffset += wireFrame.length

      // heartbeat frame we might have to do something with it
      if (wireFrame.frameType === FrameType.HeartBeat) {
        return
      }

      let channel = this.channels[wireFrame.channel]

      if (!channel) {
        debug('new Channel')
        channel = new Channel(this.getNewChannelId(), this, this.server, this.onPublish)
        this.channels.push(channel)
      }
      // debug("length wireframe vs data", wireFrame.payload.length + 1 + 3, data.length);
      channel.handleWireFrame(wireFrame)
    }
  }

  private handleClose(data: Buffer): void {
    if (this.heartBeatTimeout) {
      clearTimeout(this.heartBeatTimeout)
    }

    this.emit('close', this.socket)
    debug('connection closed')
  }

  private handleError(err: Error): void {
    debug(`Got a Connection error ${err.message}`)
  }
  public send(data: Buffer): void {
    this.socket.write(data)
  }

  public start(): void {
    // first channel should not be used for anything other than connection
    const connectionChannel = new Channel(this.getNewChannelId(), this, this.server)

    this.channels.push(connectionChannel)
    this.socket.on('data', this.handleConnection.bind(this))
    this.socket.on('close', this.handleClose.bind(this))
    this.socket.on('error', this.handleError.bind(this))
    this.socket.on('timeout', this.handleClose.bind(this))
  }

  private sendHeartBeat(heartBeatDelay: number, payload: Buffer): void {
    this.heartBeatTimeout = setTimeout(() => {
      this.socket.write(payload)
      this.sendHeartBeat(heartBeatDelay, payload)
    }, (heartBeatDelay / 2) * 1000)
  }

  public startSendHeartBeat(heartBeatDelay: number): void {
    // It should always be zero because heartbeat are only sent on the connection channel
    const hb = new HeartBeat(0).toBuffer()
    this.sendHeartBeat(heartBeatDelay, hb)
  }
}

export { Connection }

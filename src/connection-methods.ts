import { Connection } from './connection'
import { StartOk } from './frames/connection/start-ok'
import { Tune } from './frames/connection/tune'
import { TuneOk } from './frames/connection/tune-ok'
import { Open } from './frames/connection/open'
import { OpenOk } from './frames/connection/open-ok'
import { debug as d } from 'debug'

const debug = d('sas:connection-method')

abstract class ConnectionMethods {
  public static startOk(payload: Buffer, connection: Connection, channelId: number): void {
    const startOkFrame = new StartOk(payload)

    debug('startOkFrame', startOkFrame)
    // TODO: update connection status'
    // TODO: authenticate
    const maxChannels = 4096
    const maxFrameSize = 65536
    const hearBeatInterval = 10
    // this hard coded zero should come from the channel's id
    const tuneFrame = new Tune(maxChannels, maxFrameSize, hearBeatInterval, channelId)
    connection.send(tuneFrame.toBuffer())
  }

  public static tuneOk(payload: Buffer, connection: Connection, _: number): void {
    const tuneOkFrame = new TuneOk(payload)

    debug('tuneOkFrame', tuneOkFrame)
    // TODO: we are expected to send based the received frame duration
    // TODO: we should monitor client's heartbeat to remove dead ones
    debug('start sending heartbeat')
    connection.startSendHeartBeat(tuneOkFrame.heartBeatDelay)
  }

  public static open(payload: Buffer, connection: Connection, channelId: number): void {
    const openFrame = new Open(payload)
    const reserved1 = ''
    const openOkFrame = new OpenOk(reserved1, channelId)

    // TODO: add support for virtual hosts
    debug('openFrame', openFrame)
    debug('openOk', openOkFrame, openOkFrame.toBuffer())
    connection.send(openOkFrame.toBuffer())
  }

  public static secureOk(payload: Buffer, connection: Connection, _: number): void {
    throw new Error('SecureOk not implemented.')
  }
  public static close(payload: Buffer, connection: Connection, _: number): void {
    throw new Error('Close not implemented.')
  }
  public static closeOk(payload: Buffer, connection: Connection, _: number): void {
    throw new Error('CloseOk not implemented.')
  }
}

export { ConnectionMethods }

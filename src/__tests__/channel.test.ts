import { Channel } from '../channel'
import { Connection } from '../connection'
import { Socket } from 'net'
import { Message } from '../message'
import { WireFrame } from '../frames/wire-frame'
import { Server } from '../server'

describe('channel', () => {
  it('should call the onPublish callback', done => {
    const socket = ({} as any) as Socket
    const server = new Server()
    const co = new Connection(socket, server)
    const channel = new Channel(1, co, server, (message: Message) => {
      done()
    })

    const publishFrame = Buffer.from([
      1,
      0,
      1,
      0,
      0,
      0,
      35,
      0,
      60,
      0,
      40,
      0,
      0,
      13,
      101,
      114,
      105,
      100,
      97,
      110,
      105,
      115,
      45,
      99,
      101,
      116,
      105,
      13,
      100,
      105,
      114,
      101,
      99,
      116,
      111,
      114,
      121,
      46,
      110,
      101,
      119,
      0,
      206
    ])
    const headerFrame = Buffer.from([
      2,
      0,
      1,
      0,
      0,
      0,
      35,
      0,
      60,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      2,
      160,
      0,
      16,
      97,
      112,
      112,
      108,
      105,
      99,
      97,
      116,
      105,
      111,
      110,
      47,
      106,
      115,
      111,
      110,
      0,
      0,
      0,
      0,
      206
    ])
    const bodyFrame = Buffer.from([3, 0, 1, 0, 0, 0, 2, 123, 125, 206])
    const wireFrames = [
      new WireFrame(publishFrame),
      new WireFrame(headerFrame),
      new WireFrame(bodyFrame)
    ]

    wireFrames.forEach(wireFrame => {
      channel.handleWireFrame(wireFrame)
    })
  })
})

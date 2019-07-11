import { AmqpFrameWriter } from '../amqp-frame-writer'
import { ClassId, ConnectionMethodId, EOB, FrameType } from '../../constants'
import { Frame } from '../frame'

class ConnectionStart extends Frame {
  constructor(
    private major: number,
    private minor: number,
    private serverProperty: object,
    private mechanism: string,
    private locales: string
  ) {
    // connection start is only on channel 0
    super(FrameType.Method, ClassId.Connnection, ConnectionMethodId.Start, 0)
  }

  protected getPayload(): Buffer {
    const payload = new AmqpFrameWriter()

    payload.writeByte(this.major)
    payload.writeByte(this.minor)
    payload.writeTable(this.serverProperty)
    payload.writeLongStr(this.mechanism)
    payload.writeLongStr(this.locales)

    return payload.toBuffer()
  }
}

export { ConnectionStart }

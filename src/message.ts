import { Publish } from './frames/basic/publish'
import { ContentHeader } from './frames/content-header'

class Message {
  private static currentId: number = 0

  private readonly publish: Publish

  public readonly id: number = Message.getNextId()
  public readonly exchangeName: string
  public readonly routingKey: string
  public payload: Buffer
  public header?: ContentHeader
  public currentSize: bigint

  constructor(publish: Publish) {
    this.currentSize = BigInt(0)
    this.publish = publish
    this.payload = Buffer.from([])
    this.exchangeName = publish.exchangeName
    this.routingKey = publish.routingKey
  }

  private static getNextId(): number {
    return ++Message.currentId
  }
}

export { Message }

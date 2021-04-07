import { Bind } from './frames/queue/bind'
import { ExchangeType } from './exchange'

class Binding {
  private readonly exchange: string
  private readonly queue: string
  private readonly topicRegex: RegExp

  constructor(bindFrame: Bind, exchangeType: ExchangeType) {
    this.exchange = bindFrame.exchange
    this.queue = bindFrame.queue

    this.topicRegex =
      exchangeType === ExchangeType.Topic
        ? this.generateTopicRegex(bindFrame.routingKey)
        : (this.topicRegex = new RegExp('.*'))
  }

  private generateTopicRegex(routingKey: string): RegExp {
    const topicRegex: string[] = []
    routingKey.split('.').forEach(part => {
      if (part === '*') {
        topicRegex.push('[^.]+')
      } else if (part === '#') {
        topicRegex.push('.*')
      } else {
        topicRegex.push(part)
      }
    })

    const exp = `^${topicRegex.join('.')}$`
    return new RegExp(exp)
  }
  public match(): boolean {
    return false
  }
}

export { Binding }

import { Declare } from './frames/exchange/declare'

enum ExchangeType {
  Direct,
  Fanout,
  Topic
}

class Exchange {
  private readonly stringToExchangeType = {
    direct: ExchangeType.Direct,
    fanout: ExchangeType.Fanout,
    topic: ExchangeType.Topic
  }

  private readonly exchangeTypeToString = {
    [ExchangeType.Direct]: 'direct',
    [ExchangeType.Fanout]: 'fanout',
    [ExchangeType.Topic]: 'topic'
  }
  public readonly name: string
  public readonly type: ExchangeType

  constructor(declaration: Declare) {
    this.name = declaration.exchange
    this.type = this.getExchangeTypeFromString(declaration.type)
  }

  private getExchangeTypeFromString(type: 'direct' | 'fanout' | 'topic'): ExchangeType {
    return this.stringToExchangeType[type]
  }
}

export { Exchange, ExchangeType }

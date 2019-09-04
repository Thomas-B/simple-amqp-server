import { Declare } from './frames/queue/declare'

class Queue {
  public readonly name: string

  constructor(declaration: Declare) {
    this.name = declaration.queue
  }
}

export { Queue }

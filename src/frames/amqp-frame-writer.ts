import { SmartBuffer } from 'smart-buffer'
import * as ints from 'buffer-more-ints'
import { toBufferBE } from 'bigint-buffer'
const MAX_SHORT_STR_LENGTH = 255

class AmqpFrameWriter {
  private internalSmartBuffer: SmartBuffer

  constructor() {
    this.internalSmartBuffer = new SmartBuffer()
  }

  public writeByte(value: number): void {
    this.internalSmartBuffer.writeInt8(value)
  }

  public writeShort(value: number): void {
    this.internalSmartBuffer.writeInt16BE(value)
  }

  public writeLong(value: number): void {
    this.internalSmartBuffer.writeUInt32BE(value)
  }

  public writeLongStr(value: string | Buffer): void {
    const buffer = this.stringOrBufferToBuffer(value)

    this.writeLong(value.length)
    this.internalSmartBuffer.writeBuffer(buffer)
  }

  toBuffer(): Buffer {
    return this.internalSmartBuffer.toBuffer()
  }

  public writeShortStr(value: string | Buffer): void {
    const buffer = this.stringOrBufferToBuffer(value)
    if (buffer.length > MAX_SHORT_STR_LENGTH) {
      throw new Error('short str too long')
    }

    this.writeByte(buffer.length)
    this.internalSmartBuffer.writeBuffer(buffer)
  }

  public writeLongLong(value: bigint): void {
    this.internalSmartBuffer.writeBuffer(toBufferBE(value, 8))
  }

  public writeTable(value: object): void {
    const tableBuffer = new AmqpFrameWriter()

    Object.entries(value).forEach(([key, property]) => {
      tableBuffer.writeShortStr(key)
      tableBuffer.writeValue(property)
    })
    this.writeLongStr(tableBuffer.toBuffer())
  }

  private writeValue(value: any): void {
    const valueType = typeof value

    // some types are missing from the amqp client: timestamp decimal and float
    switch (valueType) {
      case 'object':
        this.writeObject(value)
        break
      case 'bigint':
        this.writeBigInt(value)
        break
      case 'number':
        this.writeNumber(value)
        break
      case 'string':
        this.writeByte('S'.charCodeAt(0))
        this.writeLongStr(value)
        break
      case 'boolean':
        this.writeByte('t'.charCodeAt(0))
        this.writeByte(Number(value === true))
        break
      default:
        throw new TypeError('Unknown type to encode: ' + valueType)
    }
  }

  private writeObject(value: object): void {
    if (value === null) {
      this.writeByte('V'.charCodeAt(0))
    } else if (Array.isArray(value)) {
      this.writeByte('A'.charCodeAt(0))
      this.writeArray(value)
    } else if (Buffer.isBuffer(value)) {
      this.writeByte('x'.charCodeAt(0))
      this.writeLong(value.length)
      this.internalSmartBuffer.writeBuffer(value)
    } else {
      this.writeByte('F'.charCodeAt(0))
      this.writeTable(value)
    }
  }

  private writeArray(arr: any[]): void {
    const tableBuffer = new AmqpFrameWriter()
    arr.forEach(value => {
      tableBuffer.writeValue(value)
    })
    this.writeLongStr(tableBuffer.toBuffer())
  }

  private writeBigInt(value: number): void {
    if (this.isFloatingPoint(value)) {
      this.writeByte('d'.charCodeAt(0))
      this.internalSmartBuffer.writeDoubleBE(value)
    } else {
      const buffer = Buffer.alloc(8)

      this.writeByte('l'.charCodeAt(0))
      ints.writeInt64BE(buffer, value, 0)
      this.internalSmartBuffer.writeBuffer(buffer)
    }
  }

  private writeNumber(value: number): void {
    if (this.isFloatingPoint(value)) {
      this.writeByte('d'.charCodeAt(0))
      this.internalSmartBuffer.writeDoubleBE(value)
    } else if (value < 128 && value >= -128) {
      this.writeByte('b'.charCodeAt(0))
      this.writeByte(value)
    } else if (value >= -0x8000 && value < 0x8000) {
      this.writeByte('s'.charCodeAt(0))
      this.writeShort(value)
    } else if (value >= -0x80000000 && value < 0x80000000) {
      this.writeByte('I'.charCodeAt(0))
      this.writeLong(value)
    }
  }

  private isFloatingPoint(n: number): boolean {
    return n >= 0x8000000000000000 || (Math.abs(n) < 0x4000000000000 && Math.floor(n) !== n)
  }

  private stringOrBufferToBuffer(value: string | Buffer): Buffer {
    return typeof value === 'string' ? Buffer.from(value) : value
  }
}

export { AmqpFrameWriter }

import { SmartBuffer } from "smart-buffer";
import { toBigIntBE } from "bigint-buffer";

class AmqpFrameReader {
  private internalSmartBuffer: SmartBuffer;

  constructor(data: Buffer) {
    this.internalSmartBuffer = SmartBuffer.fromBuffer(data);
  }

  public readRest(): Buffer {
    const length = this.readLong();
    return this.internalSmartBuffer.readBuffer(length);
  }

  public static readMethodIdentifiers(data: Buffer): [number, number] {
    const classId = data.readInt16BE(0);
    const methodId = data.readInt16BE(2);

    return [classId, methodId];
  }

  public readByte(): number {
    return this.internalSmartBuffer.readInt8();
  }

  public readShort(): number {
    return this.internalSmartBuffer.readInt16BE();
  }

  public readLong(): number {
    return this.internalSmartBuffer.readInt32BE();
  }

  public readLongLong(): BigInt {
    const currentOffset = this.internalSmartBuffer.readOffset;
    const newOffset = currentOffset + 8;
    const bigIntBuffer = this.internalSmartBuffer.internalBuffer.slice(
      currentOffset,
      newOffset
    );

    this.internalSmartBuffer.readOffset = newOffset;

    return toBigIntBE(bigIntBuffer);
  }

  public readShortstr(): string {
    const strLength = this.internalSmartBuffer.readInt8();

    return this.internalSmartBuffer.readBuffer(strLength).toString("utf-8");
  }

  public readLongstr(): string {
    const strLength = this.internalSmartBuffer.readInt32BE();

    return this.internalSmartBuffer.readBuffer(strLength).toString("utf-8");
  }
  // public readTimestamp() {}
  public readTable(): object /* change this to a more apropriate type */ {
    const table: any = {};
    const dataLength = this.readLong();
    const startOffset = this.internalSmartBuffer.readOffset;

    while (this.internalSmartBuffer.readOffset < startOffset + dataLength) {
      const key = this.readShortstr();
      const value = this.readValue();
      table[key] = value;
    }

    return table;
  }

  private readValue(): any {
    const valueType = String.fromCharCode(this.readByte());

    switch (valueType) {
      case "t":
        return this.readByte() === 1;
      case "b":
      // Didn't see a difference between the 2, I don't know what strict mode is
      case "B":
        return this.readByte();
      case "U":
      case "u":
      case "s":
        return this.readShort();
      case "I":
      case "i":
        return this.readLong();
      case "L":
      case "l":
        return this.readLongLong();
      case "f":
        return this.internalSmartBuffer.readFloatBE();
      case "d":
        return this.internalSmartBuffer.readDoubleBE();
      case "D":
        throw new Error("Fuck decimals");
      case "S":
        return this.readLongstr();
      case "A":
        return this.readArray();
      case "T":
        return this.readLongLong();
      case "F":
        return this.readTable();
      case "V":
        return null;
      case "x":
        return Buffer.from(this.readLongstr());

      default:
        throw new Error(`Couldn't decode value type ${valueType}`);
    }
  }

  private readArray(): any[] {
    const arr: any[] = [];
    const dataLength = this.readLong();
    const startOffset = this.internalSmartBuffer.readOffset;

    while (this.internalSmartBuffer.readOffset < startOffset + dataLength) {
      arr.push(this.readValue());
    }

    return arr;
  }
}

export { AmqpFrameReader };

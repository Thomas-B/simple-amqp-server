import { createServer } from "net";
import * as ints from "buffer-more-ints";
import { ConnectionStart } from "./frames/connection-start";

function main() {
  const server = createServer(socket => {
    socket.on("data", (data: Buffer) => {
      console.log(data, data.toString());

      const c = new ConnectionStart(
        0,
        9,
        {
          toto: "test"
        },
        "PLAIN",
        "en_US"
      );
      socket.write(c.toBuffer());
    });
  });

  server.listen(5672, "0.0.0.0");
}

function encodeTable(buffer: Buffer, val: any, offset: number) {
  var start = offset;
  offset += 4; // leave room for the table length
  for (var key in val) {
    if (val[key] !== undefined) {
      var len = Buffer.byteLength(key);
      buffer.writeUInt8(len, offset);
      offset++;
      buffer.write(key, offset, "utf8");
      offset += len;
      offset += encodeFieldValue(buffer, val[key], offset);
    }
  }
  var size = offset - start;
  buffer.writeUInt32BE(size - 4, start);
  return size;
}

function encodeArray(buffer: Buffer, val: any[], offset: number) {
  var start = offset;
  offset += 4;
  for (var i = 0, num = val.length; i < num; i++) {
    offset += encodeFieldValue(buffer, val[i], offset);
  }
  var size = offset - start;
  buffer.writeUInt32BE(size - 4, start);
  return size;
}

function isFloatingPoint(n: number) {
  return (
    n >= 0x8000000000000000 ||
    (Math.abs(n) < 0x4000000000000 && Math.floor(n) !== n)
  );
}

type ValueTypes =
  | "string"
  | "number"
  | "bigint"
  | "boolean"
  | "symbol"
  | "undefined"
  | "object"
  | "function"
  | "double"
  | "byte"
  | "short"
  | "int"
  | "float64"
  | "int8"
  | "int16"
  | "int32"
  | "int64"
  | "timestamp"
  | "float"
  | "decimal"
  | "long";

function encodeFieldValue(buffer: Buffer, value: any, offset: number) {
  var start = offset;
  let type: ValueTypes = typeof value,
    val = value;
  // A trapdoor for specifying a type, e.g., timestamp
  if (value && type === "object" && value.hasOwnProperty("!")) {
    val = value.value;
    type = value["!"];
  }

  // If it's a JS number, we'll have to guess what type to encode it
  // as.
  if (type == "number") {
    // Making assumptions about the kind of number (floating point
    // v integer, signed, unsigned, size) desired is dangerous in
    // general; however, in practice RabbitMQ uses only
    // longstrings and unsigned integers in its arguments, and
    // other clients generally conflate number types anyway. So
    // the only distinction we care about is floating point vs
    // integers, preferring integers since those can be promoted
    // if necessary. If floating point is required, we may as well
    // use double precision.
    if (isFloatingPoint(val)) {
      type = "double";
    } else {
      // only signed values are used in tables by
      // RabbitMQ. It *used* to (< v3.3.0) treat the byte 'b'
      // type as unsigned, but most clients (and the spec)
      // think it's signed, and now RabbitMQ does too.
      if (val < 128 && val >= -128) {
        type = "byte";
      } else if (val >= -0x8000 && val < 0x8000) {
        type = "short";
      } else if (val >= -0x80000000 && val < 0x80000000) {
        type = "int";
      } else {
        type = "long";
      }
    }
  }

  function tag(t: string) {
    buffer.write(t, offset);
    offset++;
  }

  switch (type) {
    case "string": // no shortstr in field tables
      var len = Buffer.byteLength(val, "utf8");
      tag("S");
      buffer.writeUInt32BE(len, offset);
      offset += 4;
      buffer.write(val, offset, "utf8");
      offset += len;
      break;
    case "object":
      if (val === null) {
        tag("V");
      } else if (Array.isArray(val)) {
        tag("A");
        offset += encodeArray(buffer, val, offset);
      } else if (Buffer.isBuffer(val)) {
        tag("x");
        buffer.writeUInt32BE(val.length, offset);
        offset += 4;
        val.copy(buffer, offset);
        offset += val.length;
      } else {
        tag("F");
        offset += encodeTable(buffer, val, offset);
      }
      break;
    case "boolean":
      tag("t");
      buffer.writeUInt8(val ? 1 : 0, offset);
      offset++;
      break;
    // These are the types that are either guessed above, or
    // explicitly given using the {'!': type} notation.
    case "double":
    case "float64":
      tag("d");
      buffer.writeDoubleBE(val, offset);
      offset += 8;
      break;
    case "byte":
    case "int8":
      tag("b");
      buffer.writeInt8(val, offset);
      offset++;
      break;
    case "short":
    case "int16":
      tag("s");
      buffer.writeInt16BE(val, offset);
      offset += 2;
      break;
    case "int":
    case "int32":
      tag("I");
      buffer.writeInt32BE(val, offset);
      offset += 4;
      break;
    case "long":
    case "int64":
      tag("l");
      ints.writeInt64BE(buffer, val, offset);
      offset += 8;
      break;

    // Now for exotic types, those can _only_ be denoted by using
    // `{'!': type, value: val}
    case "timestamp":
      tag("T");
      ints.writeUInt64BE(buffer, val, offset);
      offset += 8;
      break;
    case "float":
      tag("f");
      buffer.writeFloatBE(val, offset);
      offset += 4;
      break;
    case "decimal":
      tag("D");
      if (
        val.hasOwnProperty("places") &&
        val.hasOwnProperty("digits") &&
        val.places >= 0 &&
        val.places < 256
      ) {
        buffer[offset] = val.places;
        offset++;
        buffer.writeUInt32BE(val.digits, offset);
        offset += 4;
      } else
        throw new TypeError(
          "Decimal value must be {'places': 0..255, 'digits': uint32}, " +
            "got " +
            JSON.stringify(val)
        );
      break;
    default:
      throw new TypeError("Unknown type to encode: " + type);
  }
  return offset - start;
}

main();

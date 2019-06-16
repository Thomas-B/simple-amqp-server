enum FrameType {
  Method = 1,
  Header = 2,
  Body = 3,
  HeartBeat = 8
}

enum ClassId {
  Connnection = 10,
  Channel = 20,
  Exchange = 40,
  Queue = 50,
  Basic = 60,
  TX = 90
}

// There are other method but they are not received by the server
enum ConnectionMethodId {
  Start = 10,
  StartOk = 11,
  SecureOk = 21,
  Tune = 30,
  TuneOk = 31,
  Open = 40,
  OpenOk = 41,
  Close = 50,
  CloseOk = 51
}

export { FrameType, ClassId, ConnectionMethodId };

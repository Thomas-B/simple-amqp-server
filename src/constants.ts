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

enum ChannelMethodId {
  Open = 10,
  OpenOk = 11,
  Flow = 20,
  FlowOk = 21,
  Close = 40,
  CloseOk = 41
}

enum ExchangeMethodId {
  Declare = 10,
  DeclareOk = 11,
  Delete = 20,
  DeleteOk = 21,
  // rmq specific method
  Bind = 30,
  // rmq specific method
  BindOk = 31,
  // rmq specific method
  UnBind = 40,
  // This looks like a type in dispatchd and
  //I can't find any documentation to this rmq specific method
  UnBindOk = 51
}

// End Of Buffer
const EOB = Buffer.from([206]);

export {
  FrameType,
  ClassId,
  ConnectionMethodId,
  EOB,
  ChannelMethodId,
  ExchangeMethodId
};

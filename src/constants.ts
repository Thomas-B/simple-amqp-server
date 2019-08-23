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
  Confirm = 85,
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
  // I can't find any documentation to this rmq specific method
  UnBindOk = 51
}

enum QueueMethodId {
  Declare = 10,
  DeclareOk = 11,
  Bind = 20,
  BindOk = 21,
  Purge = 30,
  PurgeOk = 31,
  Delete = 40,
  DeleteOk = 41,
  UnBind = 50,
  UnBindOk = 51
}

enum BasicMethodId {
  QOS = 10,
  QOSOk = 11,
  Consume = 20,
  ConsumeOk = 21,
  Cancel = 30,
  CancelOk = 31,
  Publish = 40,
  Return = 50,
  Deliver = 60,
  Get = 70,
  GetOk = 71,
  GetEmpty = 72,
  Ack = 80,
  Reject = 90,
  RecoverAsync = 100,
  Recover = 110,
  RecoverOk = 111,
  Nack = 120
}

enum ConfirmMethodId {
  Select = 10,
  SelectOk = 11
}
// End Of Buffer
const EOB = Buffer.from([206])

export {
  FrameType,
  ClassId,
  ConnectionMethodId,
  EOB,
  ChannelMethodId,
  ExchangeMethodId,
  QueueMethodId,
  BasicMethodId,
  ConfirmMethodId
}

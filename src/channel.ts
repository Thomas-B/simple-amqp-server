import { WireFrame } from "./frames/wire-frame";
import { MethodFrame } from "./frames/method-frame";

class Channel {
  constructor(private readonly id: number) {}

  public handleWireFrame(wireFrame: WireFrame) {
    const methodFrame = new MethodFrame(wireFrame.payload);
    console.log(methodFrame);
  }
}

export { Channel };

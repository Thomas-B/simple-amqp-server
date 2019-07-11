import { OpenOk } from '../open-ok'

describe('open-ok frame', () => {
  it('should write the correct buffer', () => {
    const buffer = new OpenOk('', 1).toBuffer()
    expect(buffer).toEqual(Buffer.from([1, 0, 1, 0, 0, 0, 5, 0, 10, 0, 41, 0, 206]))
  })
})

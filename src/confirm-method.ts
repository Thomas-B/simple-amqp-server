import { Connection } from './connection'
import { Select } from './frames/select/select'
import { SelectOk } from './frames/select/select-ok'
import { debug as d } from 'debug'

const debug = d('sas:select-method')

class ConfirmMethods {
  public static Select(payload: Buffer, connection: Connection, channelId: number): void {
    const selectFrame = new Select(payload)
    const selectOkFrame = new SelectOk(channelId)

    debug('selectFrame', selectFrame)
    debug('selectOkFrame', selectOkFrame, selectOkFrame.toBuffer())
    connection.send(selectOkFrame.toBuffer())
  }
}

export { ConfirmMethods }

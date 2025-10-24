import { config } from 'dotenv'
import { vietQR } from '../config/vietQr.config'
import account_bank from 'src/models/accountBank.models'
import { useAutoCodeGen } from 'src/utils/auto-code-gent'

config()

interface AcountBankCreateReqBody {
  BankCode: string
  AccountNumber: string
  NameAccount?: string
  FlagDefault?: string
  LinkSheet?: string // link google sheet for auto fill data
}

class AccountBankService {
  async getListBank() {
    return new Promise<void>((resolve, reject) => {
      return vietQR
        .getBanks()
        .then((banks: any) => resolve(banks))
        .catch((err: any) => reject(err))
    })
  }
  async getLinkSheetBank(user_id: string) {
    const data = await account_bank.findOne({
      where: {
        user_id: user_id?.toUpperCase()
      }
    })
    return data?.account_bank_sheet || ''
  }
  async create_account(payload: AcountBankCreateReqBody, user_id: string | undefined) {
    return new Promise<void>((resolve, reject) => {
      return vietQR
        .getBanks()
        .then((banks: any) => resolve(banks))
        .catch((err: any) => reject(err))
    })
  }
  async addAccBank(payload: AcountBankCreateReqBody, user_id: string | undefined) {
    const { BankCode, AccountNumber, FlagDefault, LinkSheet } = payload
    const { autoCodeGen } = useAutoCodeGen()
    const dataCreateAccBank = {
      account_bank_id: autoCodeGen('ACCBANK'),
      account_number: AccountNumber,
      flag_active: FlagDefault,
      account_bank_code: BankCode,
      user_id: user_id?.toUpperCase(),
      account_bank_sheet: LinkSheet
    }
    return new Promise<void>((resolve, reject) => {
      return account_bank
        .create(dataCreateAccBank)
        .then((banks: any) => resolve(banks))
        .catch((err: any) => reject(err))
    })
  }
}
const accountBankServices = new AccountBankService()
export default accountBankServices

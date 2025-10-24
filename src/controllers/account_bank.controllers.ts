import express, { Request, Response, NextFunction } from 'express'
import accountBankServices from '../services/account_bank.services'
import { ResultsReturned } from '../utils/results-api'

class AccountBankController {
  //Thêm blog mới
  async getListBank(req: Request, res: Response) {
    const result = await accountBankServices.getListBank()
    return res.json(
      new ResultsReturned({
        isSuccess: true,
        message: 'Get success',
        data: result
      })
    )
  }
  async createBank(req: Request, res: Response) {
    const user_id = req.decoded_authorization?.user_id
    await accountBankServices.create_account(req.body, user_id)
    return res.json(
      new ResultsReturned({
        isSuccess: true,
        message: 'Tạo thành công',
        data: []
      })
    )
  }
  async addAccountBank(req: Request, res: Response) {
    const user_id = req.decoded_authorization?.user_id
    await accountBankServices.addAccBank(req.body, user_id)
    return res.json(
      new ResultsReturned({
        isSuccess: true,
        message: 'Thêm tài khoản ngân hàng thành công!',
        data: null
      })
    )
  }
  async getSheetBank(req: Request, res: Response) {
    const user_id = req.decoded_authorization?.user_id
    const result = await accountBankServices.getLinkSheetBank(user_id as string)
    return res.json(
      new ResultsReturned({
        isSuccess: true,
        message: 'Lấy link sheet giao dịch thành công',
        data: result
      })
    )
  }
}

const accountBankController = new AccountBankController()
export default accountBankController

import { Router } from 'express'
import accountBankController from '../controllers/account_bank.controllers'
import { accessTokenValidator } from '../middlewares/users.middlewares'

const account_bankRouters = Router()

account_bankRouters.post('/GetListBank', accessTokenValidator, accountBankController.getListBank)
account_bankRouters.post('/Create', accessTokenValidator, accountBankController.createBank)
account_bankRouters.post('/AddAccBank', accessTokenValidator, accountBankController.addAccountBank)
account_bankRouters.post('/GetSheetBank', accessTokenValidator, accountBankController.getSheetBank)

export default account_bankRouters

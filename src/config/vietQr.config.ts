import { VietQR } from 'vietqr'
export const vietQR = new VietQR({
  clientID: process.env.CLIENT_ID_VIETQR,
  apiKey: process.env.API_KEY_VIETQR
})

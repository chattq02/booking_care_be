import { TokenPayload } from "./controllers/users.controllers"


declare module 'express' {
  interface Request {
    decoded_authorization?: TokenPayload
    decoded_refresh_token?: TokenPayload
  }
}

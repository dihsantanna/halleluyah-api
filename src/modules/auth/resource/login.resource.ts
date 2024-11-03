export interface Tokens {
  sessionId: string
  accessToken: string
  refreshToken: string
}

export class LoginResource {
  readonly accessToken: string
  readonly refreshToken: string
  readonly sessionId: string
  constructor(tokens: Tokens) {
    this.sessionId = tokens.sessionId
    this.accessToken = tokens.accessToken
    this.refreshToken = tokens.refreshToken
  }
}

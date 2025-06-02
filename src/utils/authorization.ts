import * as jose from 'jose'

const secretKey = process.env.API_SECRET_KEY!

export const encryptJWTwithJose = async (payload: any): Promise<string> => {
  if (!secretKey) {
    throw new Error('API_SECRET_KEY is not defined')
  }
  const secret = jose.base64url.decode(secretKey)

  const encPayload = await new jose.EncryptJWT(payload)
    .setProtectedHeader({ alg: 'dir', enc: 'A128CBC-HS256' })
    .setIssuedAt()
    .setIssuer('urn:example:issuer')
    .setAudience('urn:example:audience')
    .setExpirationTime('2h')
    .encrypt(secret)

  return encPayload
}

export const decryptJWTwithJose = async (jwt: string): Promise<any> => {
  if (!secretKey) {
    throw new Error('API_SECRET_KEY is not defined')
  }
  const secret = jose.base64url.decode(secretKey)

  const dec = await jose.jwtDecrypt(jwt, secret, {
    issuer: 'urn:example:issuer',
    audience: 'urn:example:audience'
  })

  return dec
}

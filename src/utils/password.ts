import * as bcrypt from 'bcrypt-ts'

export const saltAndHashPassword = async (pwd: string) => {
  if (!pwd) return pwd

  const hashPwd = await bcrypt.hash(pwd, 10)

  return hashPwd
}

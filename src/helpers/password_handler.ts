import bcrypt from 'bcrypt'

export class PasswordHandler {
  async authenticateContractor (givenPassword: string, actualPassword: string) {
    if (!await bcrypt.compare(givenPassword, actualPassword)) {
      return false
    } else {
      return true
    }
  }

  async updatePassword (currentPassword: string, newPassword: string) {
    if (await bcrypt.compare(newPassword, currentPassword)) {
      return currentPassword
    } else {
      const hashedPassword = await bcrypt.hash(newPassword, Number(process.env.BCRYPT_SALT_ROUNDS))
      return hashedPassword
    }
  }

  async hashNewPassword (password: string) {
    const hashedPassword = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT_ROUNDS))
    return hashedPassword
  }
}

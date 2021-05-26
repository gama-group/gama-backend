import bcrypt from 'bcrypt'

export class PasswordHandler {
  async authenticateContractor (givenPassword: string, actualPassword: string) {
    if (!await bcrypt.compare(givenPassword, actualPassword)) {
      console.log('Authentication has failed.')
      return false
    } else {
      return true
    }
  }

  async updatePassword (currentPassword: string, newPassword: string) {
    if (await bcrypt.compare(newPassword, currentPassword)) {
      console.log('Nova senha é igual a senha anterior, e portanto, a senha não foi alterada.')
      return currentPassword
    } else {
      console.log('Senha alterada com sucesso.')
      const hashedPassword = await bcrypt.hash(newPassword, 10)
      return hashedPassword
    }
  }

  async hashNewPassword (password: string) {
    const hashedPassword = await bcrypt.hash(password, 10)
    return hashedPassword
  }
}

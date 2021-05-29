import bcrypt from 'bcrypt';

export class PasswordHandler {
    async authenticate_contractor(given_password: string, actual_password: string) {
        if(!await bcrypt.compare(given_password, actual_password)) {
            //console.log("Authentication has failed.");
            return false;
        } else {
            return true;
        }
    }

    async update_password(current_password: string, new_password: string) {
        if(await bcrypt.compare(new_password, current_password)) {
            //console.log('Nova senha é igual a senha anterior, e portanto, a senha não foi alterada.');
            return current_password;
        } else {
            //console.log('Senha alterada com sucesso.');
            let hashed_password = await bcrypt.hash(new_password, Number(process.env.BCRYPT_SALT_ROUNDS));
            return hashed_password;
        }
    }

    async hash_new_password(password: string) {
        let hashed_password = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT_ROUNDS));
        return hashed_password;
    }
}

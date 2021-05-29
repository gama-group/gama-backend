import bcrypt from 'bcrypt';

export class PasswordHandler {
    async authenticate_contractor(given_password: string, actual_password: string) {
        if(!await bcrypt.compare(given_password, actual_password)) {
            return false;
        } else {
            return true;
        }
    }

    async update_password(current_password: string, new_password: string) {
        if(await bcrypt.compare(new_password, current_password)) {
            return current_password;
        } else {
            let hashed_password = await bcrypt.hash(new_password, 10);
            return hashed_password;
        }
    }

    async hash_new_password(password: string) {
        let hashed_password = await bcrypt.hash(password, 10);
        return hashed_password;
    }
}

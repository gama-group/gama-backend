import * as jwt from "jsonwebtoken";

const ACCESS_TOKEN = "12345467890";

interface ITokenUserData {
    id: Number
};

export const genUserToken = (data: ITokenUserData): string => {
    return jwt.sign(data, ACCESS_TOKEN);
}

export const retrieveDataFromToken = (authorization: string): ITokenUserData | null => {
    const token = authorization;
    try {
        const data = jwt.verify(token, ACCESS_TOKEN);
        console.log("Parsed...", data);
        return data as ITokenUserData;
    } catch(e) {
        return null;
    }
}

const checkUserCredentials = (email: string, password: string) => {
    
}
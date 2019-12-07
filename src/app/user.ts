 
export class IUser {
    id: number;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
}

export class User implements IUser {
    id: number;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    access_token: any;
    public constructor(init?: Partial<User>) {
        Object.assign(this, init);
    }

 
}
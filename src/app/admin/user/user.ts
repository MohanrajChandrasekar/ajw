export class User {
    id: number;
    userName: string;
    loginId: string;
    password: string;
    userEmail: string;
    salt: string;
    createdBy: string;
    updatedBy: string;
    access_token: string;
    isLocked: boolean;
    lastLoginTime: Date;
    selectedRoles: number[];
    roles: string;
    latestLoginTime: Date;
    branchId: number;
    roleId: any;
    token: any;
}
export class Dashboard {
    FirstClass: number;
    SecondClass: number;
    ThirdClass: number;
    DoorToDoor: number;
    Express: number;
    total: number;
}


export class Datewise extends Dashboard {
    entryDate: Date;
    public constructor(init?: Partial<Datewise>) {
        super();
        Object.assign(this, init);
    }
}


export class Branchwise extends Dashboard {
    entryDate: string;
    count: number;
    name:string;
    public constructor(init?: Partial<Branchwise>) {
        super();
        Object.assign(this, init);
    }
}

export class Chart3 extends Dashboard {
    entryDate: string;
    name: string;
    count: number;
    public constructor(init?: Partial<Chart3>) {
        super();
        Object.assign(this, init);
    }
}

export class DashboardDate extends Dashboard{
    fromDate: any;
    toDate: any;
    branchId:any;
    roleId:any;
}

export class SpecialCustomers{
    constructor(){ }
    id: number;
    branchId: number;
    custType: number;
    customerId: number;
    consigneeCode: number;
    bookingMF: string;
    refMF: string;
    mfDate: Date;
    mfTime: string;
    bookingType: string;
    cartonWT: number;
    secRunno: number;
    secMawbno: number;
    secHAWB: number;
    secDeliveryCat: number;
    secLandedWtKGs: number;
    postalCode: number;
    isSpecialCustomer: boolean = true;
    cnNO: number;
}
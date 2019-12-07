export class incomeLoad {
    id: Number;
    secRunno: Number;
    secMawbno: Number;
    secDepartureDate: Date;
    secDeliveryCat: String;
    secManifestDate: Date;
    secManifestArrDt: Date;
    secBranch: String;
    secDelivaryDesc: String;
    secBranchDesc: String;
    isActive: Boolean;
    detailLoad:{
        id: Number;
        incomeID: Number;
        secHAWB: String;
        secFrank: String;
        secPickup: Date;
        secPieces: Number;
        secShipper: Number;
        secWeight: Number;
        secWeightKG: Number;
        secDeliveryCat: Number;
    }
    shipperList:{
        id: Number;
        shipperCode: String;
        shipperName: String;
    }
    categoryList:{
        code: String;
        description: String;
        id: Number;
    }
    
}
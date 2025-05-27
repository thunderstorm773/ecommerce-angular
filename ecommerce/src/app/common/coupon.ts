export class Coupon {

    constructor(public id: number,
                public discountCode: string,
                public discountPercent: number,
                public validFrom: Date,
                public validTo: Date,
                public lastUpdated: Date,
                public status: boolean) { }
}

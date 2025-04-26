export class Coupon {

    constructor(public discountCode: string,
                public discountPercent: number,
                public validFrom: Date,
                public validTo: Date,
                public status: boolean) { }
}

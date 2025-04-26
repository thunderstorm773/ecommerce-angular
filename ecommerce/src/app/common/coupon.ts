export class Coupon {

    constructor(public discountCode: string,
                public validFrom: Date,
                public validTo: Date,
                public status: boolean) { }
}

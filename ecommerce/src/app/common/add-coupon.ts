export class AddCoupon {

    constructor(public discountCode: string,
                public discountPercent: number,
                public validFrom: string,
                public validTo: string,
                public isActive: boolean) {}
}

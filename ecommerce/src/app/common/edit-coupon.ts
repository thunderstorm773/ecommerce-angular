export class EditCoupon {

    constructor(public discountCode: string,
                public discountPercent: number,
                public validFrom: string,
                public validTo: string,
                public status: boolean) {}
}

export class OrderHistory {

    constructor(public id: number,
                public orderTrackingNumber: string,
                public totalPrice: number,
                public totalPriceEur: number,
                public totalQuantity: number,
                public status: string,
                public dateCreated: Date) {}
}

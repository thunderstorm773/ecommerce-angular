export class OrderHistory {

    constructor(public id: string,
                public orderTrackingNumber: string,
                public totalPrice: number,
                public totalPriceEur: number,
                public totalQuantity: number,
                public status: string,
                public dateCreated: Date) {}
}

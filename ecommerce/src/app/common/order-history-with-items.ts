import { OrderHistoryItem } from "./order-history-item";

export class OrderHistoryWithItems {

    constructor(public orderTrackingNumber: string,
                public totalPrice: number,
                public totalPriceEur: number,
                public totalQuantity: number,
                public dateCreated: Date,
                public orderItems: OrderHistoryItem[]) {}
}

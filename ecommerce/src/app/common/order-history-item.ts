import { Product } from "./product";

export class OrderHistoryItem {

    constructor(public imageURL: string,
                public unitPrice: number,
                public unitPriceEur: number,
                public quantity: number,
                public product: Product) {}
}

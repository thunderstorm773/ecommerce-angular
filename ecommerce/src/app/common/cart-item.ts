import { Product } from "./product";

export class CartItem {

    id: number;
    name: string;
    imageUrl: string;
    unitPrice: number;
    unitPriceEur: number;
    quantity: number;
    unitsInStock: number;

    constructor(product: Product) {
        this.id = product.id;
        this.name = product.name;
        this.imageUrl = product.imageUrl;
        this.unitPrice = product.unitPrice;
        this.unitPriceEur = product.unitPriceEur;
        this.quantity = 1;
        this.unitsInStock = product.unitsInStock;
    }
}

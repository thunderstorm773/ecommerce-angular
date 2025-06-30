import { CartItem } from "./cart-item";

export class OrderItem {

    imageURL: string;
    unitPrice: number;
    unitPriceEur: number;
    quantity: number;
    productId: number;

    constructor(cartItem: CartItem) { 
        this.imageURL = cartItem.imageUrl;
        this.unitPrice = cartItem.unitPrice;
        this.unitPriceEur = cartItem.unitPriceEur;
        this.quantity = cartItem.quantity;
        this.productId = cartItem.id;
    }     
}

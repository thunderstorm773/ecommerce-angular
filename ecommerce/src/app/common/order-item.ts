import { CartItem } from "./cart-item";

export class OrderItem {

    imageURL: string;
    unitPrice: number;
    quantity: number;
    productId: number;

    constructor(cartItem: CartItem) { 
        this.imageURL = cartItem.imageUrl;
        this.unitPrice = cartItem.unitPrice;
        this.quantity = cartItem.quantity;
        this.productId = cartItem.id;
    }     
}

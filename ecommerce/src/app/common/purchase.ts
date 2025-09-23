import { Address } from "./address";
import { Customer } from "./customer";
import { OrderItem } from "./order-item";

export class Purchase {

    constructor(public customer: Customer,
                public shippingAddress: Address,
                public billingAddress: Address,
                public orderItems: OrderItem[]) { }
}

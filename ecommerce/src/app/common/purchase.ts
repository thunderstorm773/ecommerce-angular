import { Address } from "./address";
import { Customer } from "./customer";
import { Order } from "./order";
import { OrderItem } from "./order-item";

export class Purchase {

    constructor(private customer: Customer,
                private shippingAddress: Address,
                private billingAddress: Address,
                private order: Order,
                private orderItems: OrderItem[]) { }
}

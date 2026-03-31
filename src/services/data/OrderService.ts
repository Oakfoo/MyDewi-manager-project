import { Order } from "../../types";
import { BasicService } from "./BasicService";

export class OrderService extends BasicService<Order> {
    constructor() {
        super('Orders', 'createdAt', 'desc');
    }
}

export const orderService = new OrderService();
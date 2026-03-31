import { Customer } from "../../types";
import { BasicService } from "./BasicService";

export class CustomerService extends BasicService<Customer> {
    constructor() {
        super('Customers', 'createdAt', 'desc');
    }
}

export const customerService = new CustomerService();
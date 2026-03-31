import { Product } from "../../types";
import { BasicService } from "./BasicService";

export class ProductService extends BasicService<Product> {
    constructor() {
        super('Products', 'createdAt', 'desc');
    }
}

export const productService = new ProductService();
import { CategoryProduct } from "../../types";
import { BasicService } from "./BasicService";

export class ProductCategoryService extends BasicService<CategoryProduct> {
    constructor() {
        super('ProductCategory', 'createdAt', 'desc');
    }
}

export const productCategoryService = new ProductCategoryService();
// productCategoryService.sort("displayOrder");
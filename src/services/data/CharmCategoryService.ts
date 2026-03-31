import { CharmCategory } from "../../types";
import { BasicService } from "./BasicService";

export class CharmCategoryService extends BasicService<CharmCategory> {
    constructor() {
        super('CharmCategory', 'createdAt', 'desc');
    }
}

export const charmCategoryService = new CharmCategoryService();
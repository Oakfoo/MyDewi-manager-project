import { Composition } from "../../types";
import { BasicService } from "./BasicService";

class CompositionService extends BasicService<Composition> {
    constructor() {
        super('Compositions', 'createdAt', 'desc');
    }
}

export const compositionService = new CompositionService();
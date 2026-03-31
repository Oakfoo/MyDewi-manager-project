import { Clasp } from "../../types";
import { BasicService } from "./BasicService";

export class ClaspService extends BasicService<Clasp> {
    constructor() {
        super('Clasps', 'createdAt', 'desc');
    }
}

export const claspService = new ClaspService();
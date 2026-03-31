import { Charm } from "../../types";
import { BasicService } from "./BasicService";

export class CharmService extends BasicService<Charm> {
    constructor() {
        super('Charms', 'createdAt', 'desc');
    }
}

export const charmService = new CharmService();
import { Matter } from "../../types";
import { BasicService } from "./BasicService";

class MatterService extends BasicService<Matter> {

    constructor() {
        super("Matters", "createdAt", "desc");
    }

}

export const matterService = new MatterService();
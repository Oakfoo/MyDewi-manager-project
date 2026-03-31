import { PromoCode } from "../../types";
import { BasicService } from "./BasicService";

export class PromoCodeService extends BasicService<PromoCode> {
    constructor() {
        super('PromoCodes', 'createdAt', 'desc');
    }
}

export const promocodeService = new PromoCodeService()
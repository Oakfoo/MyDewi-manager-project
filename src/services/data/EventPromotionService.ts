import { EventPromotion } from "../../types";
import { BasicService } from "./BasicService";

export class EventPromotionService extends BasicService<EventPromotion> {
    constructor() {
        super('EventPromotions', 'createdAt', 'desc');
    }
}

export const eventPromotionService = new EventPromotionService();
import { Schedule } from "../../types";
import { BasicService } from "./BasicService";


export class ScheduleService extends BasicService<Schedule> {
    constructor() {
        super('Schedules', 'createdAt', 'desc');
    }
}

export const scheduleService = new ScheduleService();
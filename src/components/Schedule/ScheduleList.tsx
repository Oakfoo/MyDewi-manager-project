import { useState } from "react";
import { Button } from "../UI/Button";
import { Card, CardHeader, CardContent } from "../UI/Card";
import { Search, Plus } from "lucide-react";
import { scheduleService } from "../../services/data/ScheduleService";

export function ScheduleList() {

    const schedules = scheduleService.getAll();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredSchedules = schedules.filter(schedule => {
        const matchesSearch = schedule.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1>Liste des rendez-vous</h1>
                </div>
                <Button onClick={() => setIsModalOpen(true)} icon={Plus}>
                    Nouveau Rendez-vous
                </Button>
            </div>
            {/* Barre d'outils */}
            <Card className="sticky top-5 left-5 right-5">
                <CardHeader>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="text"
                                placeholder="Rechercher une date, un client..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </CardHeader>
            </Card>
            {filteredSchedules.map((schedule, idSchedule) => (
                <Card>
                    <CardHeader>
                        <p>#{idSchedule} - {new Date(schedule.date).toString()}</p>
                        <p>de {schedule.startHour} à {schedule.endHour}</p>
                    </CardHeader>
                    <CardContent>
                        <label>{schedule.name}</label>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
import { useState } from "react";
import { EventPromotion } from "../../types";
import { Modal } from "../UI/Modal";
import { Card, CardContent, CardHeader } from "../UI/Card";
import { Button } from "../UI/Button";
import { Edit, Plus, Search, Trash2, } from "lucide-react";
import { EventPromotionForm } from "./EventPromotionForm";
import { eventPromotionService } from "../../services/data/EventPromotionService";

export function EventPromotionList() {
    const events = eventPromotionService.getAll();
    const [loading, setLoading] = useState<boolean>(eventPromotionService.getLoading())
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<EventPromotion | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredEvents = events.filter(event => {
        const matches = event.label.fr.toLowerCase().includes(searchTerm.toLowerCase()) || event.label.en.toLowerCase().includes(searchTerm.toLowerCase());
        return matches;
    });

    const handleSubmit = async (data: Omit<EventPromotion, 'id'>) => {
        setLoading(true);
        if (editingEvent) {
            await eventPromotionService.update(editingEvent.id!, data);
        } else {
            await eventPromotionService.create(data);
        }
        setIsModalOpen(false);
        setEditingEvent(null);
        setLoading(false);
    };

    const handleEdit = (event: EventPromotion) => {
        setEditingEvent(event);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette promotion ?')) {
            setLoading(true);
            await eventPromotionService.delete(id);
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1>Promotions</h1>
                </div>
                <Button onClick={() => setIsModalOpen(true)} icon={Plus}>
                    Nouveau Code
                </Button>
            </div>

            <Card className="sticky top-5 left-5 bg-white">
                <CardHeader>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Rechercher un évènement..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </CardHeader>
                <CardContent className="hidden md:block p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr className="divide-x divide-gray-200 text-center text-xs font-medium text-gray-500 uppercase">
                                    <th className="px-6 py-3 tracking-wider">Libellé</th>
                                    <th className="px-2 py-3 tracking-wider">Valeur</th>
                                    <th className="px-2 py-3 tracking-wider">Applications</th>
                                    <th className="px-2 py-3 tracking-wider">Créé le</th>
                                    <th className="px-2 py-3 tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredEvents.map((event) => (
                                    <tr key={event.id} className="text-center hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {event.label.fr}
                                        </td>
                                        <td className="px-2 py-4 whitespace-nowrap text-center">
                                            -{ event.value } {event.pourcentage ? "%" : "XPF"}
                                        </td>
                                        <td className="px-2 py-4 whitespace-nowrap">
                                            {event.promotedCategories ? `Catégories concernées : ${event.promotedCategories.length}` : ""}
                                        </td>
                                        <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(event.createdAt).toLocaleString("fr-FR")}
                                        </td>
                                        <td className="px-2 py-4 whitespace-nowrap space-even text-sm font-medium space-x-2">
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => handleEdit(event)}
                                                icon={Edit}
                                            >
                                                Modifier
                                            </Button>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleDelete(event.id!)}
                                                icon={Trash2}
                                            >
                                                Supprimer
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {filteredEvents.map((event) => (
                <Card key={event.id} className="md:hidden bg-white">
                    <CardHeader className="flex justify-between items-center">
                        <h4>{event.label.fr}</h4>
                        <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(event.id!)}
                            title="Supprimer"
                        >
                            <Trash2 />
                        </Button>
                    </CardHeader>
                    <CardContent className="border-t border-gray-100">
                        <div className="grid grid-cols-2 gap-2">
                            <p>Réduction : <span>- {event.value} {event.pourcentage ? "%" : "XPF"}</span></p>
                            <p>Catégories concernées : {event.promotedCategories ? event.promotedCategories.length : 0}</p>
                            
                        </div>
                        <div className="flex justify-end gap-5 mt-5">
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handleEdit(event)}
                                icon={Edit}
                            >
                                Modifier
                            </Button>
                            
                        </div>
                    </CardContent>
                </Card>
            ))}

            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingEvent(null);
                }}
                title={editingEvent ? "Modifier l'évènement" : "Nouvel évènement"}
                size="lg"
            >
                <EventPromotionForm
                    initialData={editingEvent}
                    onSubmit={handleSubmit}
                    onCancel={() => {
                        setIsModalOpen(false);
                        setEditingEvent(null);
                    }}
                />
            </Modal>
        </div>
    );
}
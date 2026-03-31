import { useState } from "react";
import { Clasp } from "../../types/index";
import { Plus, Search, Package, Edit, Trash2 } from "lucide-react";
import { Button } from "../UI/Button";
import { Card, CardHeader, CardContent } from "../UI/Card";
import { Modal } from "../UI/Modal";
import { ClaspForm } from "./ClaspForm";
import { claspService } from "../../services/data/ClaspService";
import { matterService } from "../../services/data/MatterService";

export function ClaspList() {
    const clasps = claspService.getAll("createdAt");
    const matters = matterService.getAll();
    const [loading, setLoading] = useState<boolean>(claspService.getLoading())
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClasp, setEditingClasp] = useState<Clasp | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredClasps = clasps.filter(clasp => {
        const matchesSearch = clasp.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const getMatterName = (matterId: string) => {
        const matter = matters.find(mat => mat.id === matterId);
        return matter?.name.fr || "Matière inconnue"
      }

    const handleSubmit = async (data: Omit<Clasp, 'id'>) => {
        setLoading(true);
        if (editingClasp) {
          await claspService.update(editingClasp.id!, data);
        } else {
          await claspService.create(data);
        }
        setIsModalOpen(false);
        setEditingClasp(null);
        setLoading(false);
    };
    
    const handleEdit = (clasp: Clasp) => {
        setEditingClasp(clasp);
        setIsModalOpen(true);
    };
    
    const handleDelete = async (id: string) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
            setLoading(true);
            await claspService.delete(id);
            await setLoading(false);
        }
    };
    
    if (loading) {
        return <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>;
    }

    return (
        <div className="overflow-hidden space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1>Catalogue de Fermoirs</h1>
                </div>
                <Button onClick={() => setIsModalOpen(true)} icon={Plus}>
                    Nouveau Fermoir
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
                                placeholder="Rechercher un fermoir..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Liste des fermoirs */}
            <CardContent className="p-0">
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3 md:gap-6">
                    {filteredClasps.map((clasp) => (
                        <Card key={clasp.id} className="bg-white">
                            <CardHeader className="relative aspect-w-9 aspect-h-9">
                                {clasp.image ? (
                                    <img
                                        src={clasp.image}
                                        alt={clasp.name}
                                        className="w-full h-48 object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                                        <Package className="h-12 w-12 text-gray-400" />
                                    </div>
                                )}
                                <div className="absolute w-full bottom-0 left-0 space-y-3 p-2 bg-gradient-to-b from-transparent via-white to-white">
                                    <div className="space-y-3">
                                        <div className="flex items-start justify-between">
                                            <h3 className="font-semibold text-gray-900 text-lg">{clasp.name}</h3>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${clasp.isActive
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                }`}>
                                                {clasp.isActive ? 'Actif' : 'Inactif'}
                                            </span>
                                        </div>
                                        <div className="flex items-start justify-between">
                                            <h3 className="font-semibold text-gray-900 text-sm">Collection:</h3>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium`}>
                                                {getMatterName(clasp.matterId)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent>
                                

                                <div className="flex space-x-2 pt-3 border-t border-gray-100">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => handleEdit(clasp)}
                                        icon={Edit}
                                        className="flex-1"
                                    >
                                        Modifier
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleDelete(clasp.id!)}
                                        icon={Trash2}
                                        className="flex-1"
                                    >
                                        Supprimer
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </CardContent>
                
            {/* Modal Création/Modification */ }
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingClasp(null);
                }}
                title={editingClasp ? 'Modifier le fermoir' : 'Nouveau fermoir'}
                size="xl"
            >
                <ClaspForm
                    initialData={editingClasp}
                    onSubmit={handleSubmit}
                    onCancel={() => {
                        setIsModalOpen(false);
                        setEditingClasp(null);
                    }}
                />
            </Modal>
        </div >
    );
}
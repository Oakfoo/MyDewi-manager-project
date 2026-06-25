import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "../UI/Button";
import { Modal } from "../UI/Modal";
import { Composition } from "../../types";
import { CompositionForm } from "./CompositionForm";
import { compositionService } from "../../services/data/CompositionService";
import { productCategoryService } from "../../services/data/ProductCategoryService";
import { matterService } from "../../services/data/MatterService";

export function CompositionList() {
    const [editingComposition, setEditingComposition] = useState<Composition | null>(null);
    const [modalOpened, isModalOpened] = useState<boolean>(false);
    const compositions = compositionService.getAll();

    const [isLoading, setLoading] = useState<boolean>(false);

    const categories = productCategoryService.getAll();
    const matters = matterService.getAll();

    const getCategoryName = (categoryId: string) => {
        const category = categories.find((cat) => cat.id === categoryId);
        return category?.name.fr || "Catégorie inconnue";
    };

    const getMatterName = (matterId: string) => {
        const matter = matters.find((mat) => mat.id === matterId);
        return matter?.name.fr || "Matière inconnue";
    };

    const handleSubmit = async (data: Omit<Composition, "id">) => {
        setLoading(true);
        if (editingComposition) {
            await compositionService.update(editingComposition.id!, data);
        } else {
            await compositionService.create(data);
        }
        isModalOpened(false);
        setEditingComposition(null);
        setLoading(false);
    };

    const handleEdit = (composition: Composition) => {
        setEditingComposition(composition);
        isModalOpened(true);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1>Catalogue des Compositions</h1>
                <Button
                    onClick={() => {
                        setEditingComposition(null);
                        isModalOpened(true);
                    }}
                    icon={Plus}
                >
                    Nouvelle composition
                </Button>
            </div>

            {/* Tableau récapitulatif */}
            {compositions.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Aucune composition pour le moment.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b-2 border-gray-300 bg-gray-50">
                                <th className="text-left px-4 py-3 font-semibold text-gray-700">Nom</th>
                                <th className="text-left px-4 py-3 font-semibold text-gray-700">Catégorie / Matière</th>
                                <th className="text-left px-4 py-3 font-semibold text-gray-700">Nombre de charms</th>
                                <th className="text-center px-4 py-3 font-semibold text-gray-700">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {compositions.map((comp) => (
                                <tr
                                    key={comp.id}
                                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-4 py-3 font-medium text-gray-900">{comp.name}</td>
                                    <td className="px-4 py-3 text-gray-600">
                                        {getCategoryName(comp.categoryId)} / {getMatterName(comp.matterId)}
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">{comp.selectedCharms.length}</td>
                                    <td className="px-4 py-3 text-center">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => handleEdit(comp)}
                                            icon={Search}
                                        >
                                            Modifier
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal
                isOpen={modalOpened}
                onClose={() => {
                    isModalOpened(false);
                    setEditingComposition(null);
                }}
                title={editingComposition ? "Modifier une composition" : "Nouvelle composition"}
                size="xl"
            >
                <CompositionForm
                    initialData={editingComposition ? editingComposition : null}
                    onSubmit={handleSubmit}
                    onCancel={() => {
                        isModalOpened(false);
                        setEditingComposition(null);
                    }}
                />
            </Modal>
        </div>
    );
}

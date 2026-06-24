import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "../UI/Button";
import { Modal } from "../UI/Modal";
import { Composition, Product } from "../../types";
import { CompositionForm } from "./CompositionForm";
import { compositionService } from "../../services/data/CompositionService";

export function CompositionList() {
    const [editingComposition, setEditingComposition] = useState<Composition | null>(null);
    const [modalOpened, isModalOpened] = useState<boolean>(false);
    const compositions = compositionService.getAll();

    const [isLoading, setLoading] = useState<boolean>(false);

    const handleSubmit = async (data: Omit<Composition, 'id'>) => {
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

    if (isLoading) {
        return <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1>Catalogue des Compositions</h1>
                <Button onClick={() => {isModalOpened(true)}} icon={Plus}>
                    Nouvelle composition
                </Button>
            </div>
            <Modal 
                isOpen={modalOpened}
                onClose={() => {
                    isModalOpened(false);
                    setEditingComposition(null);
                }}
                title={editingComposition ? 'Modifier une composition' : 'Nouvelle composition'}
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
    )
}
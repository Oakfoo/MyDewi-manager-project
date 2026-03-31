import React, { useState } from "react";
import { matterService } from "../../services/data/MatterService";
import { Matter } from "../../types";
import { Button } from "../UI/Button";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "../UI/Card";
import { Modal } from "../UI/Modal";
import { MatterForm } from "./MatterForm";


export const MatterList: React.FC = () => {

  const matters = matterService.getAll();
  const [loading, setLoading] = useState<boolean>(matterService.getLoading());
  const [editingMatter, setEditingMatter] = useState<Matter | null>(null)
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredMatters = matters.filter(m => {
    const matches = m.name.fr.toLowerCase().includes(searchTerm.toLowerCase())
      || m.name.en.toLowerCase().includes(searchTerm.toLowerCase());
    return matches;
  })

  const handleSubmit = async (data: Omit<Matter, 'id'>) => {
    setLoading(true);
    if (editingMatter) {
      await matterService.update(editingMatter.id!, data);
    } else {
      await matterService.create(data);
    }
    setIsOpen(false);
    setEditingMatter(null);
    setLoading(false);
  }

  const handleEdit = (matter: Matter) => {
    setEditingMatter(matter);
    setIsOpen(true);
  }

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cetet matière ?")) {
      setLoading(true);
      await matterService.delete(id);
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1>Matières des produits</h1>
        </div>
        <Button onClick={() => setIsOpen(true)} icon={Plus}>
          Nouvelle matière
        </Button>
      </div>
      {/* Barre d'outils */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Rechercher une matière..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Liste des matières */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 p-2 md:p-5">
        {filteredMatters.map((matter) => (
          <Card key={matter.id} className="bg-white overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader>
              <h3 className="font-semibold text-gray-900 text-lg">{matter.name.fr}</h3>
            </CardHeader>
            <CardContent className="flex space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleEdit(matter)}
                icon={Edit}
                className="flex-1"
              >
                Modifier
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDelete(matter.id!)}
                icon={Trash2}
                className="flex-1"
              >
                Supprimer
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setEditingMatter(null);
        }}
        title={editingMatter ? 'Modifier la matière' : 'Nouvelle matière'}
        size="xl"
      >
        <MatterForm
          initialData={editingMatter}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsOpen(false);
            setEditingMatter(null);
          }}
        />
      </Modal>

    </div>
  );
}


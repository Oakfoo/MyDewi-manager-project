import { useState } from "react";
import { useFirebaseCollection } from "../../hooks/useFirebaseCollection";
import { PromoCode } from "../../types";
import { Modal } from "../UI/Modal";
import { Card, CardContent, CardHeader } from "../UI/Card";
import { Button } from "../UI/Button";
import { Edit, Plus, Search, Trash2, Check, X } from "lucide-react";
import { PromoCodeForm } from "./PromoCodeForm";

export function PromoCodesList() {
    const { data: codes, loading, create, update, remove } = useFirebaseCollection<PromoCode>('PromoCodes', 'label', 'asc');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCode, setEditingCode] = useState<PromoCode | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    const filteredCodes = codes.filter(code => {
        const matches = code.label.toLowerCase().includes(searchTerm.toLowerCase());
        return matches;
    });

    const handleSubmit = async (data: Omit<PromoCode, 'id'>) => {
        if (editingCode) {
          await update(editingCode.id!, data);
        } else {
          await create(data);
        }
        setIsModalOpen(false);
        setEditingCode(null);
    };

    const handleEdit = (code: PromoCode) => {
        setEditingCode(code);
        setIsModalOpen(true);
    };
    
    const handleDelete = async (id: string) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce code ?')) {
            await remove(id);
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
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Codes Promos</h1>
            </div>
            <Button onClick={() => setIsModalOpen(true)} icon={Plus}>
              Nouveau Code
            </Button>
          </div>
    
          <Card>
              <CardHeader>
                  <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                          type="text"
                          placeholder="Rechercher un code..."
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
                                <th className="px-2 py-3 tracking-wider">Livraison</th>
                                <th className="px-2 py-3 tracking-wider">Réduction</th>
                                <th className="px-2 py-3 tracking-wider">Créé le</th>
                                <th className="px-2 py-3 tracking-wider">Actions</th>
                              </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                              {filteredCodes.map((code) => (
                              <tr key={code.id} className="text-center hover:bg-gray-50 transition-colors">
                                  <td className="px-6 py-4 whitespace-nowrap">
                                      {code.label}
                                  </td>
                                  <td className="px-2 py-4 whitespace-nowrap text-center">
                                      {
                                        code.deliveryFree ? 
                                        <Check className="mx-auto" /> : <X className="mx-auto" />
                                      }
                                  </td>
                                  <td className="px-2 py-4 whitespace-nowrap">
                                      {code.reduction > 0 ? (
                                          <span>{code.reduction} %</span>
                                      ) : (
                                          <span className="text-gray-400"></span>
                                      )}
                                  </td>
                                  <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {/* {code.createdAt instanceof Date 
                                          ? code.createdAt.toLocaleDateString('fr-FR')
                                          : new Date(code.createdAt).toLocaleDateString('fr-FR')
                                      } */}
                                      {code.createdAt.toDate().toLocaleDateString('fr-FR')}
                                  </td>
                                  <td className="px-2 py-4 whitespace-nowrap space-even text-sm font-medium space-x-2">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => handleEdit(code)}
                                        icon={Edit}
                                    >
                                        Modifier
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleDelete(code.id!)}
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

          {filteredCodes.map((code) => (
            <Card key={code.id} className="md:hidden bg-white">
                <CardHeader>
                    <h4>{code.label}</h4>
                </CardHeader>
                <CardContent className="border-t border-gray-100">
                    <div className="grid grid-cols-2 gap-2">
                        <p className="p-1 flex">
                            Livraison :{code.deliveryFree ? <Check /> : <X />}
                        </p>
                        <div>
                            Réduction : {code.reduction}%
                        </div>
                    </div>
                </CardContent>
            </Card>
          ))}
                              
          <Modal
              isOpen={isModalOpen}
              onClose={() => {
                  setIsModalOpen(false);
                  setEditingCode(null);
              }}
              title={editingCode ? 'Modifier le code' : 'Nouveau code'}
              size="lg"
          >
              <PromoCodeForm
                  initialData={editingCode}
                  onSubmit={handleSubmit}
                  onCancel={() => {
                      setIsModalOpen(false);
                      setEditingCode(null);
                  }}
              />
          </Modal>
        </div>
    );
}
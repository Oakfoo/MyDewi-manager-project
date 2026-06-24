import { useState } from 'react';
import { Customer } from '../../types';
import { Card, CardContent, CardHeader } from '../UI/Card';
import { Button } from '../UI/Button';
import { Modal } from '../UI/Modal';
import { CustomerForm } from './CustomerForm';
import { Plus, Edit, Trash2, Mail, Phone, Search } from 'lucide-react';
import { customerService } from '../../services/data/CustomerService';

export function CustomerList() {
  const customers = customerService.getAll();
  const [loading, setLoading] = useState<boolean>(customerService.getLoading());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customers.filter(customer =>
    customer.id!.includes(searchTerm.toLowerCase()) ||
    customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (data: Omit<Customer, 'id'>) => {
    setLoading(true);
    if (editingCustomer) {
      await customerService.update(editingCustomer.id!, data);
    } else {
      await customerService.create(data);
    }
    setIsModalOpen(false);
    setEditingCustomer(null);
    setLoading(false);
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      setLoading(true);
      await customerService.delete(id);
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1>Gestion des Clients</h1>
        </div>
        <Button onClick={() => setIsModalOpen(true)} icon={Plus}>
          Nouveau Client
        </Button>
      </div>

      {/* Content */}
      <Card className='p-2'>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Rechercher un client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </CardHeader>
      </Card>

      {filteredCustomers.map((customer) => (
        <Card key={customer.id} className="bg-white p-1">
          <CardContent>
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-lg">
                  {customer.firstName[0]}{customer.lastName[0]}
                </span>
              </div>
              <div className="ml-3">
                <div className="text-lg font-medium text-gray-900">
                  {customer.firstName} {customer.lastName}
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(customer.createdAt).toLocaleDateString('fr-FR')}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-900">
              <Mail className="h-4 w-4 mr-2 text-gray-400" />
              <span className="break-all">{customer.email}</span>
            </div>
            {customer.phone && (
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="h-4 w-4 mr-2 text-gray-400" />
                {customer.phone}
              </div>
            )}
            {/* {customer.address && (
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                  {customer.address.city}, {customer.address.country}
                </div>
              )} */}
          </div>

          <div className="flex space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleEdit(customer)}
              icon={Edit}
              className="flex-1"
            >
              Modifier
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleDelete(customer.id!)}
              icon={Trash2}
              className="flex-1"
            >
              Supprimer
            </Button>
          </div>
          </CardContent>
          
        </Card>
      ))}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCustomer(null);
        }}
        title={editingCustomer ? 'Modifier le client' : 'Nouveau client'}
        size="lg"
      >
        <CustomerForm
          initialData={editingCustomer}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingCustomer(null);
          }}
        />
      </Modal>
    </div>
  );
}
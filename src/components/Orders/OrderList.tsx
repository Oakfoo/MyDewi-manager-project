import { useMemo, useState } from 'react';
import { Plus, Edit, Trash2, Search, ZoomIn, Banknote } from 'lucide-react';
import { Button } from '../UI/Button';
import { Modal } from '../UI/Modal';
import { Card, CardContent, CardHeader } from '../UI/Card';
import { OrderForm } from './OrderForm';
import { Charm, Customer, MinimalOrderItem, Order, Product } from '../../types';
import { useFirebaseCollection } from '../../hooks/useFirebaseCollection';
import { SeeOrderDetails } from './SeeOrderDetails';

//Liste de l'avancée d'une production d'une commande
enum ProductionStatus {
  pending = "En attente",
  confirmed = "Confirmé",
  processing = "En cours",
  shipped = "Livraison",
  delivered = "Délivré",
  cancelled = "Annulé"
}

//Liste des status d'un paiement de EpayNC
enum PaymentStatus {
  pending = "En Attente",
  AUTHORISED = "Autorisé",
  AUTHORISED_TO_VALIDATE = "A Valider",
  ABANDONED = "Abandon",
  REFUSED = "Refus",
  CANCELLED = "Annulé"
}

enum PaymentStatusShort {
  pending = "--",
  AUTHORISED = "OK",
  AUTHORISED_TO_VALIDATE = "AV",
  ABANDONED = "A",
  REFUSED = "R",
  CANCELLED = "C"
}

export function OrderList() {
  const {data: orders, loading, create, update, remove} = useFirebaseCollection<Order>('Orders', "createdAt", "desc");
  const {data: customers, loading: customerLoading} = useFirebaseCollection<Customer>("Customers", "createdAt", "asc");
  const {data: products, loading: productLoading} = useFirebaseCollection<Product>("Products", "createdAt", "asc");
  const {data: charms, loading: charmLoading} = useFirebaseCollection<Charm>("Charms", "createdAt", "asc");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [minimalOrderItems, setMinimalOrderItems] = useState<MinimalOrderItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('');

  const customersNameMap = useMemo(() => {
    if(!customers) return new Map<string, string>();
    return new Map(customers.map(c => [c.id, `${c.firstName} ${c.lastName}`]));
  }, [customers])

  const filteredOrders = useMemo(() => {
    if(!orders || !customersNameMap.size) return [];
    return orders.filter(order => {
      const search = searchTerm.toLowerCase();
  
      // Récupère le nom du client à partir de la Map
      const customerName = customersNameMap.get(order.customerId)?.toLowerCase() || '';
  
      const matchesSearch =
        order.id?.toLowerCase().includes(search) ||
        order.customerId?.toLowerCase().includes(search) ||
        customerName.includes(search);
  
      const matchesStatus = !statusFilter || order.status === Object.keys(ProductionStatus).find(s => s === statusFilter);
      const matchesPaymentStatus = !paymentStatusFilter || order.paymentStatus === Object.keys(PaymentStatus).find(s => s === paymentStatusFilter);
  
      return matchesSearch && matchesStatus && matchesPaymentStatus;
    });
  }, [orders, customersNameMap, searchTerm, statusFilter, paymentStatusFilter])

  const handleOpenDetails = (order: Order) => {
    setEditingOrder(order);
    getMinimalOrderItems(order);
    setIsDetailsOpen(true);
  }

  const handleCloseDetails = () => {
    setEditingOrder(null);
    setIsDetailsOpen(false);
  }

  const getMinimalOrderItems = (order: Order) => {
    const productIds: string[] = [];
    const charmIds: string[][] = [];
    const minimalOrderItems: MinimalOrderItem[] = [];
    order.items.map(item => {
      productIds.push(item.productId);
      charmIds.push(item.selectedCharms.map(charm => charm.charmId));
    });
    productIds.forEach((productId, productIndex) => {
      const productData = products.find(product => product.id === productId);
      const charmsData = charms.filter(charm => charmIds[productIndex].includes(charm.id!));

      minimalOrderItems.push({
        productId: productId,
        productName: productData?.name ? productData.name : '',
        productImage: productData?.images[0] ? productData.images[0] : '',
        productQuantity: order.items[productIndex].productQuantity,
        selectedCharms: charmsData.map((charm, charmIndex) => ({
          productId: charm.id!,
          productName: charm.name,
          productImage: charm.image ? charm.image : '',
          productQuantity: order.items[productIndex].selectedCharms[charmIndex].charmQuantity,
        })),
      });
    });
    setMinimalOrderItems(minimalOrderItems);
  }

  const handleSubmit = async (data: Omit<Order, 'id'>) => {
    if (editingOrder) {
      await update(editingOrder.id!, data);
    } else {
      await create(data);
    }
    setIsFormOpen(false);
    setEditingOrder(null);
  };

  const handleEdit = (order: Order) => {
    setEditingOrder(order);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
      await remove(id);
    }
  };

  if (loading || customerLoading || productLoading || charmLoading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>;
  }

  function GetPaymentStatus(amount: number, status: string) {
    return (
      <div className="flex p-1 text-center gap-2">
        <p className={`text-right w-full rounded-full py-1 px-2 ${status === "AUTHORISED" ? (
        'bg-green-300'
        ) : status === "REFUSED" || status === "CANCELLED" || status === "ABANDONED" ? (
          'bg-red-300'
        ) : (
          'bg-gray-300'
        )}`}>
          {amount} <span className='text-xs'>XPF</span>
        </p>
        <div className={`p-1 text-center rounded-full w-10 text-white
          ${status === "AUTHORISED" ? (
          'bg-green-500'
          ) : status === "REFUSED" || status === "CANCELLED" || status === "ABANDONED" ? (
            'bg-red-500'
          ) : (
            'bg-gray-500'
          )}`}
        >
          <p className=''>{PaymentStatusShort[status as keyof typeof PaymentStatusShort]}</p>
        </div>
        {/* <p>{status}</p> */}
      </div>
    );
  }

  function GetStatusIcons(prod: string) {
    return (
      <div className=''>
        <div className={`p-1`}>
          {ProductionStatus[prod as keyof typeof ProductionStatus]}
        </div>
      </div>
    )
  }

  function GetCustomerName(id: string) {
    const cust = customers.find(c => c.id === id);
    return cust?.firstName + " " + cust?.lastName;
  }

  function openEpayNC() {
    window.open('https://epaync.nc/vads-merchant/', '_blank');
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Commandes</h1>
        </div>
        <div className='flex gap-2'>
          <Button color='success' size="sm" onClick={() => openEpayNC()} icon={Banknote}>
            EpayNC
          </Button>
          <Button size="sm" onClick={() => setIsFormOpen(true)} icon={Plus}>
            Nouvelle Commande
          </Button>
        </div>
        
      </div>
      <Card>
        <CardHeader className='flex flex-col md:flex-row gap-4'>
          <div className='flex flex-col gap-1 w-full'>
            <label htmlFor='search' className='text-sm'>Rechercher</label>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                id='search'
                type="text"
                placeholder="Référence de commande ou un client"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          {/* Barre de filtres des status */}
          <div className='flex space-x-2'>
            {/* Status production */}
            {/* <div className='flex flex-col gap-1'>
              <label htmlFor='status' className='text-sm'>Statut</label>
              <select
                id='status'
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tous les statuts</option>
                {Object.values(ProductionStatus).map(status => (
                  <option key={`production-${status}`} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div> */}
            {/* Status paiements */}
            <div className='flex flex-col gap-1'>
              <label htmlFor='paymentStatus' className='text-sm'>Statut de paiement</label>
              <select
                id='paymentStatus'
                value={paymentStatusFilter}
                onChange={(e) => setPaymentStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tous les statuts de paiement</option>
                <option key={`payment-waiting`} value="AUTHORISED_TO_VALIDATE">
                  En attente validation
                </option>
                <option key={`payment-ok`} value="AUTHORISED">
                  Payé
                </option>
                <option key={`payment-abandoned`} value="ABANDONED">
                  Abandonné
                </option>
                <option key={`payment-canceled`} value="CANCELED">
                  Annulé
                </option>
                <option key={`payment-refused`} value="REFUSED">
                  Refusé
                </option>
              </select>
            </div>
          </div>
          
          
          
        </CardHeader>
        <CardContent className='bg-gray-200'>
          {/* Vue Ordinateur */}
          <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                  <thead className="bg-gray-50">
                      <tr className='divide-x divide-gray-200'>
                          {/* <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th> */}
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Créé le</th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                      {filteredOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50 transition-colors text-center">
                              {/* <td className="px-4 py-4 whitespace-nowrap">
                                  {order.id}
                              </td> */}
                              <td className="px-4 py-4 whitespace-nowrap">
                                  {GetCustomerName(order.customerId)}
                              </td>
                              <td className="px-2 py-2 whitespace-nowrap">
                                  {GetPaymentStatus(order.totalAmount, order.paymentStatus)}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap">
                                  {GetStatusIcons(order.status)}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap">
                                {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                              </td>
                              {/* <td className="px-6 py-4 whitespace-nowrap">
                                  {order.updatedAt && new Date(order.updatedAt).toLocaleDateString('fr-FR')}
                              </td> */}
                              <td className="px-6 py-4 whitespace-nowrap space-x-5 space-evenly">
                                <Button variant="primary" size="sm" icon={ZoomIn} onClick={() => handleOpenDetails(order)}>Voir</Button>
                                {/* <Button variant="secondary" size="sm" icon={Edit} onClick={() => handleEdit(order)}>Modifier</Button> */}
                                <Button variant="danger" size="sm" icon={Trash2} onClick={() => handleDelete(order.id!)}>Supprimer</Button>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
          {/* Vue Mobile */}
          <div className="md:hidden">
            {filteredOrders.map((order: any) => (
              <Card key={order.id} className='mb-3'>
                <CardHeader className='flex'>
                  <div className='flex flex-col w-full gap-2'>
                    <label className='text-sm'>Client : {GetCustomerName(order.customerId)}</label>
                    <label className='text-sm'>Créé le: {new Date(order.createdAt).toLocaleDateString('fr-FR')}</label>
                  </div>
                  <div className='float-right'>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(order.id!)}>
                      <Trash2 />
                    </Button>
                  </div>
                  
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div className='flex flex-col gap-1'>
                    <label className='text-sm'>Montant: {GetPaymentStatus(order.totalAmount, order.paymentStatus)}</label>
                    <label className='text-sm'>Statut: {GetStatusIcons(order.status)}</label>
                  </div>
                  <div className='flex flex-col gap-1'>
                    <Button variant="primary" size="sm" icon={ZoomIn} onClick={() => handleOpenDetails(order)}>Voir</Button>
                    {/* <Button className='flex-1' variant="secondary" size="sm" onClick={() => handleEdit(order)}>
                        <Edit className='w-8 h-8' />
                      </Button> */}
                  </div>
                </CardContent>
                
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal Création/Modification */ }
      <Modal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingOrder(null);
        }}
        title={editingOrder ? 'Modifier la commande' : 'Nouvelle commande'}
        size="lg"
      >
        <OrderForm
          initialData={editingOrder}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsDetailsOpen(false);
          }}
        />
      </Modal>

      {/* Vision des détails de la commande */}
      <Modal
        isOpen={isDetailsOpen}
        onClose={() => {
          handleCloseDetails();
        }}
        title="Détails de la commande"
        size="lg"
      >
        <div>
          <SeeOrderDetails 
            data={minimalOrderItems}
            comment={editingOrder ? editingOrder.comment : ''}
          />
        </div>
      </Modal>
    </div>
  );
}
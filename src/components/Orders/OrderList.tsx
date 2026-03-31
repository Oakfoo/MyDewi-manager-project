import { useMemo, useState } from 'react';
import { Plus, Trash2, Search, ZoomIn, Banknote } from 'lucide-react';
import { Button } from '../UI/Button';
import { Modal } from '../UI/Modal';
import { Card, CardContent, CardHeader } from '../UI/Card';
import { OrderForm } from './OrderForm';
import { Order } from '../../types';
import { orderService } from '../../services/data/OrderService';
import { customerService } from '../../services/data/CustomerService';
import { OrderNavbar } from './order-components/order-navbar';

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
  pod = "à la Livraison",
  AUTHORISED = "Autorisé",
  AUTHORISED_TO_VALIDATE = "A Valider",
  ABANDONED = "Abandon",
  REFUSED = "Refus",
  CANCELLED = "Annulé"
}

enum PaymentStatusShort {
  pending = "--",
  pod = "Livr.",
  AUTHORISED = "OK",
  AUTHORISED_TO_VALIDATE = "AV",
  ABANDONED = "X",
  REFUSED = "X",
  CANCELLED = "X"
}

export function OrderList() {
  const orders = orderService.getAll();
  const customers = customerService.getAll();
  const [loading, setLoading] = useState<boolean>(orderService.getLoading());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
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
    setIsDetailsOpen(true);
  }

  const handleCloseDetails = () => {
    setEditingOrder(null);
    setIsDetailsOpen(false);
  }

  const handleSubmit = async (data: Omit<Order, 'id'>) => {
    setLoading(true);
    if (editingOrder) {
      await orderService.update(editingOrder.id!, data);
    } else {
      await orderService.create(data);
    }
    setIsFormOpen(false);
    setEditingOrder(null);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer la commande ?')) {
      setLoading(true);
      await orderService.delete(id);
      setLoading(false);
    }
  };

  if (loading) {
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
          <h1>Gestion des Commandes</h1>
        </div>
        <div className='flex gap-2 overflow-x-auto'>
          <Button color='success' size="sm" onClick={() => openEpayNC()} icon={Banknote}>
            EpayNC
          </Button>
          <Button size="sm" onClick={() => setIsFormOpen(true)} icon={Plus}>
            Nouvelle Commande
          </Button>
        </div>
        
      </div>
      {/* Recherche */}
      <Card className='p-2'>
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
          <div>
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
      </Card>

      {/* Liste des commandes */}
      {filteredOrders.map((order: any) => (
        <Card key={order.id} className='p-2 bg-white'>
          <CardHeader className='flex'>
            <div className='w-full'>
              <p className='text-sm'>Client : {GetCustomerName(order.customerId)}</p>
              <p className='text-sm'>Créé le: {new Date(order.createdAt).toLocaleDateString('fr-FR')}</p>
            </div>
            {/* Bouton supprimer commande */}
            {/* <div className='float-right'>
              <Button title="Supprimer la commande" variant="danger" size="sm" onClick={() => handleDelete(order.id!)}>
                <Trash2 className='w-5 h-5'/>
              </Button>
            </div> */}

          </CardHeader>
          <CardContent className="space-y-4 flex flex-col md:flex-row gap-4">
            <div className='flex gap-1 md:flex-row gap-4 w-full'>
              <label className='text-sm'>Montant: {GetPaymentStatus(order.totalAmount ? order.totalAmount : order?.finalPrice, order.paymentStatus)}</label>
              {/* <label className='text-sm'>Statut: {GetStatusIcons(order.status)}</label> */}
            </div>
            <Button disabled={order.totalAmount} variant="primary" size="sm" icon={ZoomIn} onClick={() => handleOpenDetails(order)}>Voir</Button>
          </CardContent>
        </Card>
      ))}

      {/* Modal Création/Modification */}
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
        <OrderNavbar 
          selectedOrder={editingOrder!}
        />
      </Modal>
    </div>
  );
}
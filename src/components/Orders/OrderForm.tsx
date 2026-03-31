import { useForm } from "react-hook-form";
import { Charm, Customer, Order, Product } from "../../types";
import { Button } from "../UI/Button";
import { useState } from "react";
import { Card } from "../UI/Card";
import { customerService } from "../../services/data/CustomerService";

interface OrderFormProps {
  initialData?: Order | null;
  onSubmit: (data: Omit<Order, 'id'>) => Promise<void>;
  onCancel: () => void;
}

export function OrderForm({ initialData, onSubmit, onCancel }: OrderFormProps) {
  const [customer, setCustomer] = useState<Customer >(customerService.getById(initialData?.customerId!)!)
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Order>({
    defaultValues: initialData ? {
      id: initialData?.id,
      customerId: initialData?.customerId,
      items: initialData?.items,
      totalAmount: initialData?.totalAmount,
      status: initialData?.status,
      shippingAddress: initialData?.shippingAddress,
      createdAt: initialData?.createdAt,
      updatedAt: initialData?.updatedAt
    } : undefined
  });

  const handleFormSubmit = async (data: Omit<Order, 'id'>) => {
    const formattedData = {
      ...data,
      createdAt: initialData?.createdAt || new Date().getTime(),
      updatedAt: new Date().getTime(),
    };
    await onSubmit(formattedData);
  };

  const DisplayCustomerDetails = () => (
    <Card>
      <div className="gap-3">
        <h3>Client</h3>
        <div className="flex gap-3 mx-5">
          <label>Identité: {customer?.firstName} {customer?.lastName}</label>
        </div>
        <div className="flex gap-3 mx-5">
          <label>Téléphone: {customer?.phone}</label>
        </div>
        <div className="flex gap-3 mx-5">
          <label>Email: {customer?.email}</label>
        </div>
        <div className="flex gap-3 mx-5">
          <label>Effectuée le: {new Date(Number(initialData?.createdAt)).toLocaleDateString("fr-FR")}</label>
        </div>
        <div className="flex gap-3 mx-5">
          <label>Montant total: {initialData?.totalAmount}</label>
        </div>
      </div>
    </Card>
  )

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-6 gap-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DisplayCustomerDetails />
        <div>
          <h3>Détails Commande</h3>
          {initialData?.id && (
            <p>Id Commande: {initialData?.id}</p>
          )}
          <div className="flex gap-3 m-5">
            <label>Nombre de lot: {initialData?.items.length}</label>
          </div>
          <table>
            {/* {initialData?.items.map((item, i) => (
                            <tr key={item.productId}>
                                <td>Lot n° {i+1}</td>
                                <td>{getProductName(item.productId)}</td>
                                <td>{item.productQuantity}</td>
                                {item.selectedCharms.map((charm, j) => (
                                    <td>
                                        <label>{j+1} - {getCharmName(charm.charmId)}</label>
                                        <label>Qté: {charm.quantity}</label>
                                    </td>
                                ))}
                            </tr>
                        ))} */}
          </table>
        </div>
      </div>

      <div>
        Données commande
        Mode livraison
        Montant
        Liste des produits
        Etat de la commande
        Date de création
        Date de modification
      </div>
      <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
        <Button variant="secondary" onClick={onCancel} type="button">
          Annuler
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {initialData ? 'Mettre à jour' : 'Créer'}
        </Button>
      </div>
    </form>
  );
}
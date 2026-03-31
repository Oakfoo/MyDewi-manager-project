import { Customer } from "../../../types";
import { customerService } from "../../../services/data/CustomerService";

interface CustomerInfosProps {
    customerId: string;
    shippingAddress: {
        address: string;
        city: string;
        postalCode: string;
        country: string;
    };
}

export const CustomerInfos: React.FC<CustomerInfosProps> = ({customerId, shippingAddress}) => {
    if(!customerId) return <div>Id Client absent</div>;
    const customer: Customer = customerService.getById(customerId)!;

    return (
        <div className="space-y-2 px-2">
            <div className="flex space-x-5">
                {/* Identité client */}
                <div className="flex-1 p-1 border-r border-black">
                    <h3 className="text-center uppercase">Identité</h3>
                    <div>
                        <div className="flex gap-2">
                            <p>Prénom : </p><p className="text-right flex-1" >{customer.firstName ?? "inconnu"}</p>
                        </div>
                        <div className="flex gap-2">
                            <p>Nom : </p><p className="text-right flex-1" >{customer.lastName ?? "inconnu"}</p>
                        </div>
                    </div>
                    
                    
                </div>
                {/* Coordonnées Clients */}
                <div className="flex-1 p-1">
                    <h3 className="text-center uppercase">Coordonnées</h3>
                    <div>
                        <div className="flex gap-2">
                            <p className="w-full">tel : </p><p className="text-right w-full" >{customer.phone ?? "inconnu"}</p>
                        </div>
                        <div className="flex gap-2">
                            <p className="w-full">@ : </p><p className="text-right w-full text-nowrap" >{customer.email ?? "inconnu"}</p>
                        </div>
                    </div>
                </div>
            </div>
            {/* Adresse de livraison */}
            <div className="border-t border-black">
                <h1 className="text-center uppercase">Adresse</h1>
                <p>{shippingAddress.address}</p>
                <p>{shippingAddress.postalCode} - {shippingAddress.city}</p>
                <p>{shippingAddress.country}</p>
            </div>
        </div>
        
    );
}
import { Button } from '../UI/Button';
import { Card, CardContent, CardHeader } from '../UI/Card';
import {
    Users,
    ShoppingBag, 
    Mail,
    Database,
  } from 'lucide-react';
import { Modal } from '../UI/Modal';
import { useState } from 'react';
import { EmailConfig } from './Emailing/EmailConfig';
import { BatchBDD } from './Batch-BDD/batch-bdd';

export function Configuration () {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigation = [
        { name: 'Utilisateurs', href: '/users', icon: Users },
        { name: 'Email', href: '/email', icon: Mail },
        { name: 'SMS', href: '/sms', icon: ShoppingBag },
        { name: 'Batch BDD', href: '/batch-bdd', icon: Database },
      ];
    const [selectedItem, setSelectedItem] = useState<string | null>(null);

    const handleModalOpen = (name: string, isOpen: boolean) => {
        setIsModalOpen(isOpen);
        setSelectedItem(name);
    }

    return (
        <div>
            
            <Card>
                <CardHeader>
                    <h1>Paramètres</h1>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {navigation.map((item) => (
                            <Button 
                                key={item.name} 
                                variant="secondary" 
                                size="sm" 
                                icon={item.icon}
                                onClick={() => handleModalOpen(item.name, true)}
                            >
                                {/* <item.icon className="h-5 w-5" /> */}
                                {item.name}
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedItem || ''}
                size="md"
            >
                {selectedItem === 'Email' && <EmailConfig />}
                {selectedItem === 'Batch BDD' && <BatchBDD />}
            </Modal>
        </div>
    );
}
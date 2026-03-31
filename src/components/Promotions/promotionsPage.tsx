import { useState } from "react";
import { Button } from "../UI/Button";
import { PromoCodesList } from "../PromoCodes/PromoCodesList";
import { EventPromotionList } from "../EventPromotions/EventPormotionList";


const promotionsData: any[] = [
    {
        id: "codes",
        label: "Codes Promo",
        component: <PromoCodesList />
    }, {
        id: "events",
        label: "Evènements",
        component: <EventPromotionList />
    }
]

export function PromotionPage() {
    const [selectedPromotion, setSelectedPromotion] = useState<number>(0);
    return (
        <div>
            {/* Header */ }
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1>Gestion des</h1>
                </div>
                <div className="flex space-x-5">
                    { promotionsData.map((prom, idProm) => (
                        <Button key={idProm} onClick={() => setSelectedPromotion(idProm)}>{prom.label}</Button>
                    ))}
                </div>
                
            </div>
            {promotionsData[selectedPromotion].component}
        </div>
    )
}
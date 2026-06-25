import { useState } from "react";
import { Charm, CharmSelection } from "../../../types";
import { Card, CardContent, CardHeader } from "../../UI/Card";
import { CheckCircle, Minus, Plus } from "lucide-react";

interface CharmSelectorProps {
    isOpen: boolean;
    list: Charm[];
    selectedCharms: CharmSelection[];
    minAmount: number;
    onSelect: (charms: CharmSelection[]) => void;
}

export function CharmSelector({ isOpen, list, selectedCharms, minAmount, onSelect }: CharmSelectorProps) {
    const [localSelection, setLocalSelection] = useState<CharmSelection[]>(selectedCharms);
    const activeCharms = list.filter((c) => c.isActive);

    function getQuantity(charmId: string): number {
        return localSelection.find((s) => s.charmId === charmId)?.charmQuantity ?? 0;
    }

    function updateQuantity(charmId: string, delta: number) {
        const current = getQuantity(charmId);
        const newQty = Math.max(0, current + delta);

        let updated: CharmSelection[];
        if (newQty === 0) {
            updated = localSelection.filter((s) => s.charmId !== charmId);
        } else {
            const existing = localSelection.find((s) => s.charmId === charmId);
            if (existing) {
                updated = localSelection.map((s) =>
                    s.charmId === charmId ? { ...s, charmQuantity: newQty } : s
                );
            } else {
                updated = [...localSelection, { charmId, charmQuantity: newQty }];
            }
        }

        setLocalSelection(updated);
        onSelect(updated);
    }

    function toggleSelection(charmId: string) {
        if (getQuantity(charmId) > 0) {
            updateQuantity(charmId, -getQuantity(charmId));
        } else {
            updateQuantity(charmId, 1);
        }
    }

    return (
        <div className={`space-y-5 transition-all duration-200 ${isOpen ? "h-full" : "h-0"}`}>
            {isOpen && (
                <div>
                    {minAmount > 0 && (
                        <p className="text-sm text-gray-500 mb-2">
                            Minimum {minAmount} charm(s) requis pour cette catégorie.
                        </p>
                    )}
                    {activeCharms.length === 0 && (
                        <p className="text-gray-500 text-sm">Aucun charm disponible pour cette matière.</p>
                    )}
                    <div className="flex items-center gap-3 overflow-x-auto py-2">
                        {activeCharms.map((charm) => {
                            const qty = getQuantity(charm.id!);
                            return (
                                <Card
                                    key={charm.id}
                                    className={`min-w-40 max-w-40 h-40 relative cursor-pointer ${
                                        qty > 0 ? "border-2 border-pink-300" : ""
                                    }`}
                                    onClick={() => toggleSelection(charm.id!)}
                                >
                                    <CardHeader className="relative">
                                        <CheckCircle
                                            className={`absolute right-5 top-5 text-purple-600 ${
                                                qty > 0 ? "" : "hidden"
                                            }`}
                                        />
                                        <img
                                            src={charm.image}
                                            title={charm.name}
                                            className="h-full w-full object-cover z-1"
                                        />
                                    </CardHeader>
                                    <CardContent className="absolute bg-white bottom-0 text-xs text-nowrap z-5 w-full">
                                        <div className="flex items-center justify-between">
                                            <span className="truncate">{charm.name}</span>
                                            {qty > 0 && (
                                                <div
                                                    className="flex items-center gap-1"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <button
                                                        type="button"
                                                        className="rounded-full bg-gray-200 hover:bg-gray-300 p-1"
                                                        onClick={() => updateQuantity(charm.id!, -1)}
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </button>
                                                    <span className="font-semibold w-5 text-center">{qty}</span>
                                                    <button
                                                        type="button"
                                                        className="rounded-full bg-gray-200 hover:bg-gray-300 p-1"
                                                        onClick={() => updateQuantity(charm.id!, 1)}
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

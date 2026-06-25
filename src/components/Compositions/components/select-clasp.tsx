import { Clasp } from "../../../types";
import { Card, CardContent, CardHeader } from "../../UI/Card";
import { CheckCircle } from "lucide-react";

interface ClaspSelectorProps {
    isOpen: boolean;
    list: Clasp[];
    selectedClasp?: string;
    onSelect: (claspId: string | undefined) => void;
}

export function ClaspSelector({ isOpen, list, selectedClasp, onSelect }: ClaspSelectorProps) {
    const activeClasps = list.filter((c) => c.isActive);

    function handleSelection(id: string) {
        if (selectedClasp === id) {
            onSelect(undefined);
        } else {
            onSelect(id);
        }
    }

    return (
        <div className={`space-y-5 transition-all duration-200 ${isOpen ? "h-full" : "h-0"}`}>
            {isOpen && (
                <div>
                    {activeClasps.length === 0 && (
                        <p className="text-gray-500 text-sm">Aucun fermoir disponible pour cette matière.</p>
                    )}
                    <div className="flex items-center gap-3 overflow-x-auto py-2">
                        {activeClasps.map((clasp) => (
                            <Card
                                key={clasp.id}
                                className={`min-w-40 max-w-40 h-40 relative cursor-pointer ${
                                    selectedClasp === clasp.id ? "border-2 border-pink-300" : ""
                                }`}
                                onClick={() => handleSelection(clasp.id!)}
                            >
                                <CardHeader className="relative">
                                    <CheckCircle
                                        className={`absolute right-5 top-5 text-purple-600 ${
                                            selectedClasp === clasp.id ? "" : "hidden"
                                        }`}
                                    />
                                    <img
                                        src={clasp.image}
                                        title={clasp.name}
                                        className="h-full w-full object-cover z-1"
                                    />
                                </CardHeader>
                                <CardContent className="absolute bg-white bottom-0 text-xs text-nowrap z-5">
                                    {clasp.name}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

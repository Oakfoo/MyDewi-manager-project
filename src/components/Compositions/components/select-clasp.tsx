import { useState } from "react";
import { Clasp } from "../../../types";
import { Card, CardContent, CardHeader } from "../../UI/Card";
import { CheckCircle } from "lucide-react";

interface ClaspSelectorProps {
    isOpen: boolean;
    list: Clasp[];
    validatedClasp?: string;
    onValidate: (claspId: string | undefined) => void;
}

export function ClaspSelector({ isOpen, list, validatedClasp, onValidate }: ClaspSelectorProps) {
    const [localSelected, setLocalSelected] = useState<string | undefined>(validatedClasp);
    const activeClasps = list.filter((c) => c.isActive);

    function handleSelection(id: string) {
        if (localSelected === id) {
            setLocalSelected(undefined);
        } else {
            setLocalSelected(id);
        }
    }

    function handleValidate() {
        onValidate(localSelected);
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
                                    localSelected === clasp.id ? "border-2 border-pink-300" : ""
                                }`}
                                onClick={() => handleSelection(clasp.id!)}
                            >
                                <CardHeader className="relative">
                                    <CheckCircle
                                        className={`absolute right-5 top-5 text-purple-600 ${
                                            localSelected === clasp.id ? "" : "hidden"
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
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={handleValidate}
                            disabled={!localSelected}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Valider la sélection
                        </button>
                    </div>
                </div>
            )}

            {/* Liste validée */}
            {!isOpen && validatedClasp && (
                <div className="flex items-center gap-3 overflow-x-auto py-2">
                    {(() => {
                        const clasp = list.find((c) => c.id === validatedClasp);
                        if (!clasp) return null;
                        return (
                            <Card key={clasp.id} className="min-w-32 max-w-32 h-32 relative">
                                <CardHeader className="relative">
                                    <img
                                        src={clasp.image}
                                        title={clasp.name}
                                        className="h-full w-full object-cover z-1"
                                    />
                                </CardHeader>
                                <CardContent className="absolute bg-white bottom-0 text-xs text-nowrap z-5 w-full">
                                    {clasp.name}
                                </CardContent>
                            </Card>
                        );
                    })()}
                </div>
            )}
            {!isOpen && !validatedClasp && (
                <p className="text-gray-500 text-sm py-2">Aucun fermoir choisi.</p>
            )}
        </div>
    );
}

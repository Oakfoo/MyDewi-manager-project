import { useState } from "react";
import { Button } from "../../UI/Button";
import { Card, CardContent, CardHeader } from "../../UI/Card";
import toast from 'react-hot-toast';

export const BatchBDD = () => {

    const [collectionName, setCollectionName] = useState<string>('');
    const [fieldName, setFieldName] = useState<string>('');
    const [fieldType, setFieldType] = useState<string>('string');
    const [fieldValue, setFieldValue] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleNewFieldSubmit = async () => {
        /** TODO
        *  - Préparer les données pour l'envoi de la requête http vers l'endpoint
        *       -Modifier la valeur selon le type choisi
        *  - Envoyer la requête
        *  - Gérer les réponses
        */
       setIsLoading(true);
        let value: any;
        switch(fieldType) {
            case "string" :
                value = String(fieldValue);
            break;
            case "number" :
                value = Number(fieldValue);
            break;
            case "boolean":
                value = Boolean(fieldValue);
            break;
            case "array" :
                value = new Array();
            break;
            case "object" :
                value = {}
            break;
        }
        
        const requestBody = {
            collectionName,
            action: "addField",
            fieldName,
            fieldValue: value,
        }

        try {
            const res = await fetch("https://addfieldtocollection-f7cnlilcwq-uc.a.run.app", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });
            const result = await res.json();
            console.log(result);
            toast.success(`Succès : ${result}`);
        } catch (e) {
            console.log(e);
            toast.error(`${e}`);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div>
            {/* TODO:
            - Créer un formulaire à remplir pour l'ajout de champ à une collection donnée
            - Ajouter un bouton pour lancer l'action
            - Afficher le résultat de l'action dans un toast
            - Ajouter un bouton pour lancer l'action
            - 
            */}
            <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 gap-4">
                {/* Formulaire ajout de champ à une collection */}
                <Card className="p-2">
                    <CardHeader>
                        <h3>Ajouter un champ à une collection</h3>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <form>
                            <div className="border-b border-black">
                                <label htmlFor="collectionName">Nom de la collection :</label>
                                <input id="collectionName" type="text" value={collectionName} onChange={(e) => setCollectionName(e.target.value)} />
                            </div>
                            <div className="border-b border-black">
                                <label htmlFor="fieldName">Nom du champ à ajouter :</label>
                                <input id="fieldName" type="text" value={fieldName} onChange={(e) => setFieldName(e.target.value)} />
                            </div>
                            
                            <div className="border-b border-black">
                                <label htmlFor="selectType">Type de valeur :</label>
                                <select id="selectType" value={fieldType} onChange={(e) => setFieldType(e.target.value)}>
                                    <option value="string">Texte</option>
                                    <option value="number">Nombre</option>
                                    <option value="boolean">Booléen</option>
                                    <option value="array">Tableau</option>
                                    <option value="object">Objet</option>
                                </select>
                            </div>
                            
                            {(fieldType !== "array" && fieldType !== "object") && (
                                <div className="border-b border-black">
                                    <label htmlFor="fieldValue">Valeur à ajouter</label>
                                    <input id="fieldValue" type="text" value={fieldValue} onChange={(e) => setFieldValue(e.target.value)} />
                                </div>
                            )}
                            <Button type="button" className="mt-1" disabled={isLoading} onClick={handleNewFieldSubmit}>Ajouter</Button>
                        </form>
                    </CardContent>
                </Card>
                <Card className="p-2">
                    <CardHeader>
                        <h3>Modifier un champ à une collection</h3>
                    </CardHeader>
                    <CardContent>
                        <form>
                            <div className="border-b border-black">
                                <label htmlFor="collectionName">Nom de la collection :</label>
                                <input id="collectionName" type="text" value={collectionName} onChange={(e) => setCollectionName(e.target.value)} />
                            </div>
                            <div className="border-b border-black">
                                <label htmlFor="fieldName">Nom du champ à ajouter :</label>
                                <input id="fieldName" type="text" value={fieldName} onChange={(e) => setFieldName(e.target.value)} />
                            </div>
                            
                            <div className="border-b border-black">
                                <label htmlFor="selectType">Type de valeur :</label>
                                <select id="selectType" value={fieldType} onChange={(e) => setFieldType(e.target.value)}>
                                    <option value="string">Texte</option>
                                    <option value="number">Nombre</option>
                                    <option value="boolean">Booléen</option>
                                    <option value="array">Tableau</option>
                                    <option value="object">Objet</option>
                                </select>
                            </div>
                            
                            {(fieldType !== "array" && fieldType !== "object") && (
                                <div className="border-b border-black">
                                    <label htmlFor="fieldValue">Valeur à ajouter</label>
                                    <input id="fieldValue" type="text" value={fieldValue} onChange={(e) => setFieldValue(e.target.value)} />
                                </div>
                            )}
                            <Button type="button" className="mt-1" disabled={isLoading} onClick={handleNewFieldSubmit}>Ajouter</Button>
                        </form>
                    </CardContent>
                </Card>
                <Card className="p-2">
                    <CardHeader>
                        <h3>Supprimer un champ à une collection</h3>
                    </CardHeader>
                    
                </Card>
                <Card className="p-2">
                    <CardHeader>
                        <h3>Modifier la valeur d'un champ à une collection</h3>
                    </CardHeader>
                    
                </Card>
            </div>

        </div>
    );
}
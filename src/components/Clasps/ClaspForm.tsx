import React, { useState } from "react";
import { Clasp } from "../../types";
import { useForm } from "react-hook-form";
import { ImageService } from "../../services/firebaseService";
import { Button } from "../UI/Button";
import { X, Upload } from "lucide-react";
import { Card } from "../UI/Card";
import { matterService } from "../../services/data/MatterService";

interface ClaspFormProps {
    initialData?: Clasp | null;
    onSubmit: (data: Omit<Clasp, 'id'>) => Promise<void>;
    onCancel: () => void;
  }

export function ClaspForm(
    {
        initialData,
        onSubmit,
        onCancel,
    }: ClaspFormProps
) {
    const { 
        control,
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch
    } = useForm<Omit<Clasp, 'id'>>({
        defaultValues: initialData ? {
          name: initialData.name,
          matterId: initialData.matterId,
          isActive: initialData.isActive,
          image: initialData.image || "",
        } : {
          image: "",
          isActive: true
        }
    });

    const matters = matterService.getAll();

    const [uploadedImage, setUploadedImage] = useState<string>(initialData?.image || '');
    const [uploading, setUploading] = useState(false);
    const imageService = new ImageService();

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        if (files.length === 0 || files.length > 1) return;
    
        setUploading(true);
        try {
            const path = `images/charms/${Date.now()}_${files[0].name}`;
            const promise = await imageService.uploadImage(files[0], path);
            setUploadedImage(promise);
        } catch (error) {
            console.error('Erreur lors de l\'upload:', error);
        } finally {
            setUploading(false);
        }
    };

    const removeImage = async () => {
        await imageService.deleteImage(uploadedImage);
        setUploadedImage('');
    };

    const handleFormSubmit = async (data: Omit<Clasp, 'id'>) => {
        const formattedData = {
          ...data,
          image: uploadedImage,
          createdAt: initialData?.createdAt ? new Date(initialData.createdAt).getTime() :  new Date().getTime(),
          updatedAt: new Date().getTime(),
        };
        await onSubmit(formattedData);
    };
      
    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Id Item */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    ID Charme : {initialData?.id}
                </label>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    {/* Nom */}
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom du Fermoir *
                    </label>
                    <input
                        type="text"
                        {...register('name', { required: 'Le nom est requis' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                    {/* Matière du fermoir */}
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Matière *
                    </label>
                    <select 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        {...register("matterId", {required: "La matière du fermoir est requise"})}
                    >
                        {matters.map((matter, idMatter) => (
                            <option key={"matter-" + idMatter} value={matter.id}>
                                {matter.name.fr}
                            </option>
                        ))}
                    </select>
                </div>
                {/* Fermoir actif */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        {...register('isActive')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                        Produit actif
                    </label>
                </div>
            </div>

            {/* Image + Upload*/}
            <Card className="p-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image du produit
                </label>
                <div className="space-y-4">

                    {uploadedImage && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className='relative group '>
                                <img
                                    src={uploadedImage}
                                    alt={`Image choisie`}
                                    className="w-full object-contain rounded-lg"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage()}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        </div>
                    )}

                    {!uploadedImage && (
                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    {uploading ? (
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    ) : (
                                        <>
                                            <Upload className="w-8 h-8 mb-2 text-gray-500" />
                                            <p className="mb-2 text-sm text-gray-500">
                                                <span className="font-semibold">Cliquer pour uploader</span>
                                            </p>
                                            <p className="text-xs text-gray-500">PNG, JPG, JPEG (MAX. 10MB)</p>
                                        </>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    disabled={uploading || uploadedImage != ''}
                                />
                            </label>
                        </div>
                    )}
                </div>
            </Card>

            
            

            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                <Button variant="secondary" onClick={onCancel} type="button">
                    Annuler
                </Button>
                <Button type="submit" loading={isSubmitting || uploading}>
                    {initialData ? 'Mettre à jour' : 'Créer'}
                </Button>
            </div>
        </form>
    )
}
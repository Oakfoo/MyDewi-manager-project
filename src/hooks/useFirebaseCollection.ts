/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { FirebaseService } from '../services/firebaseService';
import toast from 'react-hot-toast';

export function useFirebaseCollection<T>(collectionName: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const service = new FirebaseService<T>(collectionName);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await service.getAll();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      console.log("erreur firebase : ", error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const create = async (item: Omit<T, 'id'>) => {
    try {
      const id = await service.create(item);
      await fetchData();
      toast.success('Élément créé avec succès');
      return id;
    } catch (err) {
      toast.error('Erreur lors de la création');
      throw err;
    }
  };

  const update = async (id: string, item: Partial<T>) => {
    try {
      await service.update(id, item);
      await fetchData();
      toast.success('Élément mis à jour avec succès');
    } catch (err) {
      toast.error('Erreur lors de la mise à jour');
      throw err;
    }
  };

  const remove = async (id: string) => {
    try {
      await service.delete(id);
      await fetchData();
      toast.success('Élément supprimé avec succès');
    } catch (err) {
      toast.error('Erreur lors de la suppression');
      throw err;
    }
  };

  useEffect(() => {
    fetchData();
  }, [collectionName]);

  return {
    data,
    loading,
    error,
    create,
    update,
    remove,
    refresh: fetchData
  };
}
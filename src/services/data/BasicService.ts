import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  orderBy,
  where,
  OrderByDirection,
  Unsubscribe,
  onSnapshot,
  QueryConstraint
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import toast from 'react-hot-toast';

export class BasicService<T extends { id?: string }> {

  private unsubscribe: Unsubscribe | null = null;
  private listeners: Array<(data: T[]) => void> = [];
  private data: T[] = [];
  private loading: boolean = false;
  private error: string | null = null;

  constructor(private collectionName: string, orderField: keyof T, orderDirection: string) {
    this.initializeRealtimeListener(orderField, orderDirection);
  }

  private initializeRealtimeListener(orderField: keyof T, orderDirection: string): void {
    if (this.unsubscribe) return;

    const q = query(
      collection(db, this.collectionName),
      where('createdAt', "!=", null),
      // orderBy('createdAt', 'desc')
      orderBy(String(orderField), orderDirection as OrderByDirection)
    );

    this.unsubscribe = onSnapshot(q, (querySnapshot) => {
      this.setLoading(true);
      const data: T[] = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as T);
      });

      this.data = data;
      // console.log(this.collectionName, this.data.length);
      this.notifyListeners(data);
      this.setLoading(false);
    });

  }

  subscribe(callback: (data: T[]) => void): () => void {
    this.listeners.push(callback);
    if (this.data.length > 0) {
      callback(this.data);
    }

    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  private notifyListeners(data: T[]): void {
    this.listeners.forEach(listener => listener(data));
  }

  destroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    this.listeners = [];
  }

  getCollectionName(): string {
    return this.collectionName;
  }

  getAll(paramSort?: keyof T, direction?: "asc" | "desc" | null): T[] {
    if(paramSort) {
      this.sort(paramSort, direction ? direction : "asc")
    }

    return this.data ?
      this.data
      : []
  }

  getById(id: string): T | undefined {
    return this.data.find(((f: T) => f.id === id));
  }

  getLoading(): boolean {
    return this.loading;
  }

  getError(): string | null {
    return this.error;
  }

  setData(data: T[]): void {
    this.data = data;
  }

  setLoading(loading: boolean): void {
    this.loading = loading;
  }

  setError(error: string | null): void {
    this.error = error;
  }

  async create(document: Omit<T, 'id'>): Promise<{ data: T | null }> {
    try {
      const docRef = await addDoc(collection(db, this.collectionName), document);
      const docSnap = await getDoc(docRef);

      toast.success('Élément créé avec succès');
      return { data: { id: docSnap.id, ...docSnap.data() } as T };
    } catch (e) {
      toast.error('Erreur lors de la création');
      console.error(e);
      throw new Error(`${e} - Firebase - Erreur Création collection ${this.collectionName}`);
    }
  }

  async update(id: string, document: Partial<T>): Promise<{ data: T | null }> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, { id: id, ...document });

      const docSnap = await getDoc(docRef);
      const data = { ...docSnap.data() } as T;

      toast.success('Élément mis à jour avec succès');
      return { data };
    } catch (e) {
      toast.error('Erreur lors de la mise à jour');
      console.error(e);
      throw new Error(`${e} - Firebase - Erreur M-a-J collection ${this.collectionName}`);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      toast.success('Élément supprimé avec succès');
      return await deleteDoc(docRef);
    } catch (e) {
      console.error(e);
      toast.error('Erreur lors de la suppression');
      throw new Error(`${e} - Firebase - Erreur Suppression collection ${this.collectionName}`);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async query(filters: Record<string, any>): Promise<{ data: T[] | null }> {
    try {
      const constraints: QueryConstraint[] = [];

      Object.entries(filters).forEach(([key, value]) => {
        constraints.push(where(key, '==', value));
      });

      constraints.push(orderBy('createdAt', 'desc'));

      const q = query(collection(db, this.collectionName), ...constraints);
      const querySnapshot = await getDocs(q);

      const data: T[] = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as T);
      });

      return { data };
    } catch (e) {
      console.error(e);
      throw new Error(`${e} - Firebase - Erreur Requête collection ${this.collectionName}`);
    }
  }

  sort(prop: keyof T, direction: 'asc' | 'desc' = 'asc'): void {
    this.data.sort((a, b) => {
      const va = a?.[prop];
      const vb = b?.[prop];

      if (va == null && vb == null) return 0;
      if (va == null) return 1;
      if (vb == null) return -1;
      if (va < vb) return direction === 'asc' ? -1 : 1;
      if (va > vb) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    this.notifyListeners(this.data);
  }
}
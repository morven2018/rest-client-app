import 'server-only';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { RequestData } from '@/hooks/use-request';

export async function getRequests(userId: string): Promise<RequestData[]> {
  try {
    const requestsRef = collection(db, 'users', userId, 'requests');
    const q = query(requestsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    const requests = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as RequestData[];

    return requests;
  } catch {
    return [];
  }
}

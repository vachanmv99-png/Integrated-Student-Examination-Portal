import { collection, getDocs } from 'firebase/firestore';
import { firestore, firebaseEnabled } from './firebase/config';

export async function fetchStudents() {
  if (!firebaseEnabled || !firestore) {
    throw new Error('Firebase is not configured.');
  }

  const snapshot = await getDocs(
    collection(firestore, 'students')
  );

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  }));
}
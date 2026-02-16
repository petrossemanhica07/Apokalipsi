import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, where, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCe_GvsR3Qwvhh7ZY6H09zB3OpiWsEOK2w",
  authDomain: "nhlavutelo-comments.firebaseapp.com",
  projectId: "nhlavutelo-comments",
  storageBucket: "nhlavutelo-comments.firebasestorage.app",
  messagingSenderId: "141007051917",
  appId: "1:141007051917:web:0d800155ad7aaf34ea96c4",
  measurementId: "G-FE6M3NR95L"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export interface Comment {
  id: string;
  chapterId: number;
  author: string;
  text: string;
  createdAt: number;
}

export async function addComment(chapterId: number, author: string, text: string): Promise<void> {
  await addDoc(collection(db, 'comments'), {
    chapterId,
    author,
    text,
    createdAt: Date.now(),
  });
}

export async function getComments(chapterId: number): Promise<Comment[]> {
  try {
    const q = query(
      collection(db, 'comments'),
      where('chapterId', '==', chapterId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Comment[];
  } catch {
    const q = query(
      collection(db, 'comments'),
      where('chapterId', '==', chapterId),
    );
    const snapshot = await getDocs(q);
    const comments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Comment[];
    return comments.sort((a, b) => b.createdAt - a.createdAt);
  }
}

export { db };

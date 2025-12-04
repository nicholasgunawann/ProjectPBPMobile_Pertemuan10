import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Interface Student
export interface Student {
  id?: string;
  nim: string;
  name: string;
  major: string;
  angkatan: number;
  email: string;
  createdAt?: Timestamp;
}

const STUDENTS_COLLECTION = 'students';

// Tambah mahasiswa 
export const addStudent = async (student: Omit<Student, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, STUDENTS_COLLECTION), {
      ...student,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error: any) {
    throw new Error(`Error adding student: ${error.message}`);
  }
};

// Ambil semua data mahasiswa
export const getAllStudents = async (): Promise<Student[]> => {
  try {
    const q = query(collection(db, STUDENTS_COLLECTION), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const students: Student[] = [];
    querySnapshot.forEach((doc) => {
      students.push({
        id: doc.id,
        ...doc.data(),
      } as Student);
    });
    
    return students;
  } catch (error: any) {
    throw new Error(`Error fetching students: ${error.message}`);
  }
};

// Hapus mahasiswa
export const deleteStudent = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, STUDENTS_COLLECTION, id));
  } catch (error: any) {
    throw new Error(`Error deleting student: ${error.message}`);
  }
};

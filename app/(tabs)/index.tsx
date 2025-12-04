import { logoutUser } from '@/services/auth';
import { deleteStudent, getAllStudents, Student } from '@/services/firestore';
import { getUserLogin } from '@/services/storage';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const userInfo = getUserLogin();
    setUserEmail(userInfo.email || '');
  }, []);

  // Auto-refresh mahasiswa ketika screen difokuskan
  useFocusEffect(
    useCallback(() => {
      fetchStudents();
    }, [])
  );

  // Fetch semua data mahasiswa dari Firestore
  const fetchStudents = async () => {
    try {
      const data = await getAllStudents();
      setStudents(data);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchStudents();
  };

  // Hapus data mahasiswa dari Firestore
  const handleDeleteStudent = (id: string, name: string) => {
    Alert.alert(
      'Hapus Mahasiswa',
      `Apakah Anda yakin ingin menghapus ${name}?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteStudent(id);
              fetchStudents();
              Alert.alert('Sukses', 'Mahasiswa berhasil dihapus');
            } catch (error: any) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Keluar',
      'Apakah Anda yakin ingin keluar?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Keluar',
          style: 'destructive',
          onPress: async () => {
            try {
              await logoutUser();
              router.replace('/login');
            } catch (error: any) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  };

  const renderStudent = ({ item }: { item: Student }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.name}>{item.name}</Text>
        <TouchableOpacity
          onPress={() => item.id && handleDeleteStudent(item.id, item.name)}
        >
          <Text style={styles.deleteButton}>Hapus</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.nim}>{item.nim}</Text>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Jurusan</Text>
        <Text style={styles.infoColon}>:</Text>
        <Text style={styles.infoValue}>{item.major}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Angkatan</Text>
        <Text style={styles.infoColon}>:</Text>
        <Text style={styles.infoValue}>{item.angkatan}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Email</Text>
        <Text style={styles.infoColon}>:</Text>
        <Text style={styles.infoValue}>{item.email}</Text>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Database Mahasiswa</Text>
          <Text style={styles.headerSubtitle}>Login sebagai : {userEmail}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* CREATE: Tombol untuk navigasi ke form tambah mahasiswa */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/add-student')}
      >
        <Text style={styles.addButtonText}>+ Tambah Mahasiswa Baru</Text>
      </TouchableOpacity>

      {students.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Belum ada data mahasiswa</Text>
          <Text style={styles.emptySubtext}>Silakan tambahkan data mahasiswa</Text>
        </View>
      ) : (
        <FlatList
          data={students}
          keyExtractor={(item) => item.id || ''}
          renderItem={renderStudent}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: '#ff3b30',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#007AFF',
    margin: 15,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    padding: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  nim: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
    fontWeight: '500',
  },
  deleteButton: {
    color: '#ff3b30',
    fontWeight: '600',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    width: 70,
  },
  infoColon: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 4,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
});

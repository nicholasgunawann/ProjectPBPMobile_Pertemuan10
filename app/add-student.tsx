import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { addStudent } from '../services/firestore';

export default function AddStudentScreen() {
  const router = useRouter();
  const [nim, setNim] = useState('');
  const [name, setName] = useState('');
  const [major, setMajor] = useState('');
  const [angkatan, setAngkatan] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddStudent = async () => {
    // Validasi
    if (!nim || !name || !major || !angkatan || !email) {
      Alert.alert('Error', 'Mohon isi semua field');
      return;
    }

    const angkatanNum = parseInt(angkatan);
    const currentYear = new Date().getFullYear();
    if (isNaN(angkatanNum) || angkatanNum < 2000 || angkatanNum > currentYear) {
      Alert.alert('Error', `Mohon masukkan tahun yang valid (2000-${currentYear})`);
      return;
    }

    setIsLoading(true);
    try {
      // Tambah data mahasiswa baru ke Firestore
      await addStudent({
        nim,
        name,
        major,
        angkatan: angkatanNum,
        email,
      });
      Alert.alert('Berhasil', 'Mahasiswa berhasil ditambahkan!', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>Tambah Mahasiswa Baru</Text>

          <View style={styles.form}>
            <Text style={styles.label}>NIM</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan NIM mahasiswa"
              placeholderTextColor="#999"
              value={nim}
              onChangeText={setNim}
              autoCapitalize="characters"
            />

            <Text style={styles.label}>Nama Lengkap</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan nama mahasiswa"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.label}>Jurusan</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan jurusan"
              placeholderTextColor="#999"
              value={major}
              onChangeText={setMajor}
            />

            <Text style={styles.label}>Angkatan</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan tahun (contoh : 2025)"
              placeholderTextColor="#999"
              value={angkatan}
              onChangeText={setAngkatan}
              keyboardType="number-pad"
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="mahasiswa@example.com"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TouchableOpacity
              style={styles.button}
              onPress={handleAddStudent}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Tambah Mahasiswa</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => router.back()}
              disabled={isLoading}
            >
              <Text style={styles.cancelButtonText}>Batal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    color: '#363636ff',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 18,
    fontWeight: '600',
  },
});

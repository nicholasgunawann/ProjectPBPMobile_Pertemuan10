import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { loginUser, registerUser } from '../services/auth';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Mohon masukkan email dan password');
      return;
    }

    setIsLoading(true);
    try {
      await loginUser(email, password);
      Alert.alert('Sukses', 'Login berhasil!');
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Error Login', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Mohon masukkan email dan password');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password minimal 6 karakter');
      return;
    }

    setIsLoading(true);
    try {
      await registerUser(email, password);
      Alert.alert('Sukses', 'Registrasi berhasil! Anda sekarang sudah login.');
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Error Registrasi', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>
          {isRegisterMode ? 'Buat Akun' : 'Selamat Datang'}
        </Text>
        <Text style={styles.subtitle}>
          {isRegisterMode
            ? 'Daftar untuk memulai'
            : 'Login untuk melanjutkan'}
        </Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="default"
            textContentType="password"
          />

          <TouchableOpacity
            style={styles.button}
            onPress={isRegisterMode ? handleRegister : handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                {isRegisterMode ? 'Daftar' : 'Masuk'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setIsRegisterMode(!isRegisterMode)}
            disabled={isLoading}
          >
            <Text style={styles.switchText}>
              {isRegisterMode
                ? 'Sudah punya akun? Masuk'
                : 'Belum punya akun? Daftar'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
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
  switchText: {
    color: '#007AFF',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
  },
});

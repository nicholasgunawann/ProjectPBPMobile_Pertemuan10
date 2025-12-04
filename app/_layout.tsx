import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { isUserLoggedIn } from '@/services/storage';

export const unstable_settings = {
  initialRouteName: 'login',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const checkAuth = () => {
      try {
        const loggedIn = isUserLoggedIn();
        const inAuthGroup = segments[0] === 'login';

        // Redirect ke login jika belum login
        if (!loggedIn && !inAuthGroup) {
          router.replace('/login');
        } else if (loggedIn && inAuthGroup) {
          // Redirect ke tabs jika sudah login
          router.replace('/(tabs)');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        router.replace('/login');
      }
    };

    setTimeout(checkAuth, 100);
  }, [segments]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="students" options={{ headerShown: false }} />
        <Stack.Screen 
          name="add-student" 
          options={{ 
            title: 'Add Student',
            headerShown: true,
          }} 
        />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

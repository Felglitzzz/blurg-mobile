import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import {ApolloProvider} from '@apollo/client';
import { client } from './apollo-client';
import { AuthProvider } from './features/auth/auth.context';
import * as SplashScreen from 'expo-splash-screen';

export default function App() {
  const colorScheme = useColorScheme();
  SplashScreen.preventAutoHideAsync();
    return (
      <SafeAreaProvider>
        <ApolloProvider client={client}>
          <AuthProvider>
            <Navigation colorScheme={colorScheme} />
            <StatusBar />
          </AuthProvider>
        </ApolloProvider>
      </SafeAreaProvider>
    );

}

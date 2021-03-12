import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as React from 'react';
import jwtDecode from 'jwt-decode';

import { TOKEN_TAG } from '../shared/constants';
import { useAuthDispatch, useAuthState } from '../features/auth/auth.context';
import { useLazyQuery, useQuery } from '@apollo/client';
import { GET_USER } from '../shared/constants/graphql.constant';
import { setLoading, setUserData } from '../features/auth/auth.action';

const isTokenExpired = (token: string | null) => {
  let isExpired = true;
  if (token) {
    const decodedToken = jwtDecode(token) as any;
    isExpired = decodedToken.exp < Date.now() / 1000;
    return isExpired;
  }
  return isExpired;
};

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const [token, setToken] = React.useState<string | null>(null);

  const state = useAuthState();
  const dispatch = useAuthDispatch();

  const [getUser, {data, loading}] = useLazyQuery(GET_USER, {
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
  });

  React.useEffect(() => {
    console.log('trigger happy')
    const checkTokenExp = async () => {
      const token = await AsyncStorage.getItem(TOKEN_TAG);
      if (!token) {
        dispatch(setLoading(false))
        dispatch(setUserData(null))
      }
      const expired = isTokenExpired(token);
      if (expired) {
        await AsyncStorage.removeItem(TOKEN_TAG);
      } else {
          setToken(token);
      }
    };
    checkTokenExp();
  }, []);


  React.useEffect(() => {
    const getUserDetails = async () => {
      if (token) {
        getUser();
      }
    }
    getUserDetails();
  }, [token]);


  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        if (!loading && data) {
          dispatch(setUserData(data.user));
          dispatch(setLoading(false));
        }
  
        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          'space-mono': require('../assets/fonts/SpaceMono-Regular.ttf'),
        });
  
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
      }
    }

    loadResourcesAndDataAsync();
  }, [data, loading]);

  return isLoadingComplete;
}


import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  createHttpLink,
  from,
  Observable,
  ApolloError,
} from '@apollo/client';
import {setContext} from '@apollo/client/link/context';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {onError} from '@apollo/client/link/error';
import { toaster } from './shared/components/service/toaster.service';
import { TOKEN_TAG } from './shared/constants';

const httpLink = createHttpLink({
  uri: 'https://blurg-server.herokuapp.com/graphql',
});

const authLink = setContext(async (_, {headers}) => {
  const token = await AsyncStorage.getItem(TOKEN_TAG);
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const errorLink = onError(({operation, graphQLErrors, networkError}) => {
  if (graphQLErrors) {
    graphQLErrors.map(({extensions}: any) => {
      console.log('wrror message--->>', extensions?.exception?.message, operation.operationName)
      if (
        extensions?.exception?.status === 401 && operation.query 
      ) {
        console.log('unaauthorized')
        AsyncStorage.removeItem(TOKEN_TAG);
        toaster('error', extensions?.exception?.message);
      }

      if (
        extensions?.exception?.response?.statusCode === 403
      ) {

      }
    });
  }
  if (networkError) {
    console.log('NETWORK ERROR--->>', networkError);
    return new Observable((obs) => {
      obs.error(
        new ApolloError({
          errorMessage: networkError.message,
          graphQLErrors,
          networkError,
        }),
      );
    });
  }
});

export const client = new ApolloClient({
  link: from([authLink, errorLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
      notifyOnNetworkStatusChange: true,
    },
  },
});
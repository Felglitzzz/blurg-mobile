import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { View } from '../components/Themed';
import { Button, ColorSchemeName } from 'react-native';
import Toast from 'react-native-toast-message';
import { useAuthDispatch, useAuthState } from '../features/auth/auth.context';
import AuthScreen from '../features/auth/screens/auth.screen';
import LandingScreen from '../features/auth/screens/landing.screen';
import { logOut } from '../features/auth/auth.action';
import { RootStackParamList } from '../types';
import BottomTabNavigator from './BottomTabNavigator';
import LinkingConfiguration from './LinkingConfiguration';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TOKEN_TAG } from '../shared/constants';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>

      <RootNavigator />
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </NavigationContainer>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
  const state = useAuthState();
  const dispatch = useAuthDispatch();

  return (
    <Stack.Navigator
      initialRouteName="Landing"
      screenOptions={{ headerShown: false, headerStyle: { backgroundColor: '#fff' } }}>
        { 
        !state.isAuthenticated ? 
        (
          <><Stack.Screen name="Landing" component={LandingScreen} />
              <Stack.Screen name="Auth" component={AuthScreen} /></>
        ) :
        (
          <Stack.Screen
            name="Root"
            component={BottomTabNavigator}
            options={{
              headerRight: () => (
                <View style={{ paddingRight: wp(4)}}>
                  <Button
                    onPress={async () => {
                      await AsyncStorage.removeItem(TOKEN_TAG);
                      dispatch(logOut())
                    }}
                    title="Logout"
                    color="#000"
    
                  />
                </View>
              ),
            }}
            />
        )
      }
    </Stack.Navigator>
  );
}

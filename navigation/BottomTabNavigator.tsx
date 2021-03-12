import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

import Colors from '../shared/constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import TabOneScreen from '../screens/TabOneScreen';
import TabTwoScreen from '../screens/TabTwoScreen';
import { BottomTabParamList, TabTwoParamList, HomeTabParamList } from '../types';
import BlogScreen from '../features/blog/screens/blog.screen';
import CreateBlogScreen from '../features/blog/screens/create-blog.screen';
import { Button } from 'react-native';
import { useAuthDispatch } from '../features/auth/auth.context';
import { logOut } from '../features/auth/auth.action';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TOKEN_TAG } from '../shared/constants';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}>
      <BottomTab.Screen
        name="Home"
        component={HomeTabNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="ios-home" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="TabTwo"
        component={TabTwoNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="ios-code" color={color} />,
        }}
      />
      
    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: { name: React.ComponentProps<typeof Ionicons>['name']; color: string }) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const HomeStack = createStackNavigator<HomeTabParamList>();

function HomeTabNavigator() {
  const dispatch = useAuthDispatch();
  
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Blog"
        component={BlogScreen}
        options={{
          headerTitle: 'Blurg',
          headerRight: () => (
          <Button
            onPress={async () => {
              await AsyncStorage.removeItem(TOKEN_TAG);
              dispatch(logOut())
            }}
            title="Logout"
            color="#000"

          />
        ),
        animationTypeForReplace: 'pop',
        }}
      />
      <HomeStack.Screen
        name="CreateBlog"
        component={CreateBlogScreen}
        options={{ headerTitle: 'Create Blog' }}
      />

    </HomeStack.Navigator>
  );
}

const TabTwoStack = createStackNavigator<TabTwoParamList>();

function TabTwoNavigator() {
  return (
    <TabTwoStack.Navigator>
      <TabTwoStack.Screen
        name="TabTwoScreen"
        component={TabTwoScreen}
        options={{ headerTitle: 'Tab Two Title' }}
      />
    </TabTwoStack.Navigator>
  );
}

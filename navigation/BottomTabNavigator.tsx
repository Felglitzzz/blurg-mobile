import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

import Colors from '../shared/constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import { BottomTabParamList, HomeTabParamList, MyBlogTabParamList } from '../types';
import BlogScreen from '../features/blog/screens/blog.screen';
import CreateBlogScreen from '../features/blog/screens/create-blog.screen';
import { Button } from 'react-native';
import { useAuthDispatch } from '../features/auth/auth.context';
import { logOut } from '../features/auth/auth.action';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TOKEN_TAG } from '../shared/constants';
import { View } from '../components/Themed';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import ABlogScreen from '../features/blog/screens/a-blog-screen';
import MyBlogScreen from '../features/blog/screens/my-blog.screen';

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
        name="My Blog"
        component={MyBlogNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="bookmarks" color={color} />,
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
          headerTitle: 'Home',
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
          animationTypeForReplace: 'pop',
          headerTintColor: '#000',
        }}
      />
      <HomeStack.Screen
        name="CreateBlog"
        component={CreateBlogScreen}
        options={{
          headerTitle: 'Create Blog',
          headerTintColor: '#000',
        }}
      />

      <HomeStack.Screen
        name="ABlogScreen"
        component={ABlogScreen}
        options={{
          headerTitle: 'Blog Details',
          headerTintColor: '#000',
        }}
      />

    </HomeStack.Navigator>
  );
}

const MyBlogStack = createStackNavigator<MyBlogTabParamList>();

function MyBlogNavigator() {
  const dispatch = useAuthDispatch();

  return (
    <MyBlogStack.Navigator>
      <MyBlogStack.Screen
        name="MyBlogScreen"
        component={MyBlogScreen}
        options={{
          headerTitle: 'My Blogs',
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
          animationTypeForReplace: 'pop',
          headerTintColor: '#000'
        }}
      />
    </MyBlogStack.Navigator>
  );
}

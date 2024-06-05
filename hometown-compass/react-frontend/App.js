import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ProfileScreen from './ui/screens/profileScreen';
import PostScreen from './ui/screens/postScreen';
import AttractionsScreen from './ui/screens/attractionsScreen';
import NewsFeedScreen from './ui/screens/newsFeedScreen';
import TestScreen from './ui/screens/testScreen';
import theme from './ui/styles/theme';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: theme.colors.secondary,
          tabBarLabelPosition: 'below-icon',
          headerTintColor: theme.colors.onSecondaryContainer,
          headerStyle: {
            backgroundColor: theme.colors.secondary,
          }
        }}>
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title:"User Profile",
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => {
            return <Icon name="home-account" size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Post"
        component={PostScreen}
        options={{
          title:"New Post",
          tabBarLabel: 'Post',
          tabBarIcon: ({ color, size }) => {
            return <Icon name="pencil-box-outline" size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen name="Logo" component={TestScreen}
        listeners={{
          tabPress: e => { e.preventDefault(); },
        }}
        options={{title:"", tabBarIcon: ({ color, size }) => {
            return <Icon name="compass-rose" size={size*1.5} color={theme.colors.primary} />;
          },
        }}
      />
      <Tab.Screen
        name="Feed"
        component={NewsFeedScreen}
        options={{
          title:"Hometown News",
          tabBarLabel: 'Feed',
          tabBarIcon: ({ color, size }) => {
            return <Icon name="newspaper-variant-multiple-outline" size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Attractions"
        component={AttractionsScreen}
        options={{
          title:"Hometown Attractions",
          tabBarLabel: 'Attractions',
          tabBarIcon: ({ color, size }) => {
            return <Icon name="map-search" size={size} color={color} />;
          },
        }}
      />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
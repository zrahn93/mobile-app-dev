import React from 'react'
import { BottomNavigation } from 'react-native-paper';
import { CommonActions } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ProfileScreen from '../screens/profileScreen';
import ImageScreen from '../screens/imageScreen';
import GalleryScreen from '../screens/galleryScreen';
import imageData from '../../data/images'

const Tab = createBottomTabNavigator();

const NavBarContent = ( ({navigation}) => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={({ navigation, state, descriptors, insets }) => (
        <BottomNavigation.Bar
          navigationState={state}
          safeAreaInsets={insets}
          onTabPress={({ route, preventDefault }) => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (event.defaultPrevented) {
              preventDefault();
            } else {
            navigation.dispatch({
                ...CommonActions.navigate(route.name, route.params),
                target: state.key,
              });
            }
          }}
          renderIcon={({ route, focused, color }) => {
            const { options } = descriptors[route.key];
            if (options.tabBarIcon) {
              return options.tabBarIcon({ focused, color, size: 24 });
            }

            return null;
          }}
          getLabelText={({ route }) => {
            const { options } = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.title;

            return label;
          }}
        />
      )}
    >
      <Tab.Screen
        name="Gallery"
        component={GalleryScreen}
        options={{
          title:"Photo Gallery",
          tabBarLabel: 'Gallery',
          tabBarIcon: ({ color, size }) => {
            return <Icon name="view-grid" size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Image"
        component={ImageScreen}
        initialParams={{image: imageData[0]}}
        options={{
          title:"Image",
          tabBarLabel: 'Image',
          tabBarIcon: ({ color, size }) => {
            return <Icon name="panorama" size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title:"User Profile",
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => {
            return <Icon name="account-cog" size={size} color={color} />;
          },
        }}
      />
    </Tab.Navigator>
  );
})

export default NavBarContent;
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ReadScreen from './ui/screens/readScreen';
import TestScreen from './ui/screens/testScreen';
import PostScreen from './ui/screens/postScreen';
import theme from './ui/styles/theme';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: theme.colors.secondary,
          tabBarLabelPosition: 'below-icon',
        }}>
        <Tab.Screen name="ReadTab" component={ReadScreen}
          options={{title:"Journal - Read", tabBarLabel: 'Read', tabBarIcon: ({ color, size }) => {
            return <Icon name="book-open-variant" size={size} color={color} />;
          },
        }}
        />
        <Tab.Screen name="Logo" component={TestScreen}
        listeners={{
            tabPress: e => { e.preventDefault(); },
          }}
          options={{title:"", tabBarIcon: ({ color, size }) => {
              return <Icon name="message-star" size={size*2} color={theme.colors.primary} />;
            },
          }}
        />
        <Tab.Screen name="PostTab" component={PostScreen}
          options={{title:"Journal - Post", tabBarLabel: 'Post',  tabBarIcon: ({ color, size }) => {
              return <Icon name="send" size={size} color={color} />;
            },
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
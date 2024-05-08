import React from 'react'
import { AppRegistry } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {name as appName} from './app.json'
import NavBarContent from './ui/components/navbar'

export default function App() {
  return (
    <NavigationContainer>
      <NavBarContent />
    </NavigationContainer>
  );
}

AppRegistry.registerComponent


import React, { useState, useEffect } from 'react'
import { View, Alert, Image, ImageBackground } from 'react-native';
import { PaperProvider, Icon, TextInput, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import theme from '../styles/theme';
import styles from '../styles/style';

const ProfileScreen = ( ({navigation}) => {
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [location, setLocation] = useState('');

  _storeData = async () => {
    try {
      await AsyncStorage.setItem('userLocation', location);
    } catch (error) {
      console.error("Error saving data for Location")
      console.error(error)
    }
    try {
      await AsyncStorage.setItem('username', username);
    } catch (error) {
      console.error("Error saving data for Location")
      console.error(error)
    }
    try {
      await AsyncStorage.setItem('displayName', displayName);
    } catch (error) {
      console.error("Error saving data for Location")
      console.error(error)
    }
  }

  _retrieveData = async () => {
    try {
      const loc = await AsyncStorage.getItem('userLocation');
      if (loc !== null) {
        console.log("Received location: " + loc);
        setLocation(loc)
      }
    } catch (error) {
        console.log("Did not retrieve data for Location")
        console.log(error)
    }
    try {
      const username = await AsyncStorage.getItem('username');
      if (username !== null) {
        console.log("Received username: " + username);
        setUsername(username)
      }
    } catch (error) {
        console.log("Did not retrieve data for Username")
        console.log(error)
    }
    try {
      const displayName = await AsyncStorage.getItem('displayName');
      if (displayName !== null) {
        console.log("Received display name: " + displayName);
        setDisplayName(displayName)
      }
    } catch (error) {
        console.log("Did not retrieve data for Display Name")
        console.log(error)
    }
  }

  useEffect(() => {
    _retrieveData()
  }, []);

  const saveProfile = () => {
    console.log("Sending user info.")
    const url = 'http://node.cci.drexel.edu:9331/updateUserInfo';
    const postOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "username": username,
            "displayName": displayName,
            "hometown": location,
        })
    }
    fetch(url, postOptions)
    .then(response => response.json())
    .then(data => {
        if (data.status == 200) {
            console.log("Updated user information.")
            Alert.alert("Updated user information.")
            _storeData();
        } else {
            Alert.alert("Error: Failed to update user information")
        }
    })
    .catch(error => {
        console.error(error);
    });
}

  return (
    <PaperProvider theme={theme}>
      <View style={{backgroundColor: theme.backgroundColor}}>
          <Image style={{marginTop: 50, height:200, width: 200, alignSelf:'center'}} source={require('../../assets/hometown-compass-logo.png')}/>
          <View style={styles.container}>
            <TextInput
              mode="outlined"
              label="Username"
              placeholder="Username"
              style={{width: '100%'}}
              value={username}
              onChangeText = { newUser => setUsername(newUser) }
            />
            <TextInput
              mode="outlined"
              label="Display Name"
              placeholder="FirstName LastName"
              style={{width: '100%'}}
              value={displayName}
              onChangeText = { newName => setDisplayName(newName) }
            />
            <TextInput
              mode="outlined"
              label="Hometown"
              placeholder="Hometown, State"
              style={{width: '100%'}}
              value={location}
              onChangeText = { newLocation => setLocation(newLocation) }
            />
            <Button
              style={{marginTop: 20}}
              icon="account-check"
              mode="contained-tonal"
              onPress={() => saveProfile()}
            >Save</Button>
          </View>
      </View>
    </PaperProvider>
  );
})

export default ProfileScreen;

import React, { useState, useEffect } from 'react'
import { View, Alert } from 'react-native';
import { PaperProvider, Text, TextInput, Checkbox, RadioButton, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import theme from '../components/theme';
import styles from '../components/styles';

const ProfileScreen = ( ({navigation}) => {
  const [userData, setUserData] = useState({"name": "", "enjoying": "yes", "favorite": ""});
  const [isLoaded, setIsLoaded] = useState(false);

  _storeData = async () => {
    try {
      console.log(userData.name)
      await AsyncStorage.setItem('name', userData.name);
    } catch (error) {
      console.error("Error saving data for Name")
      console.error(error)
    }
    try {
      console.log(userData.enjoying)
      await AsyncStorage.setItem('enjoying', userData.enjoying);
    } catch (error) {
      console.error("Error saving data for Enjoying the App")
      console.error(error)
    }
    try {
      console.log(userData.favorite)
      await AsyncStorage.setItem('favorite', userData.favorite);
    } catch (error) {
      console.error("Error saving data for Favorite Screen")
      console.error(error)
    }
}

  _retrieveData = async () => {
    try {
      const name = await AsyncStorage.getItem('name');
      if (name !== null) {
          console.log("Received name: " + name);
          userData.name = name
      }
    } catch (error) {
      console.log("Did not retrieving data for Name")
      console.log(error)
    }
    try {
      const enjoying = await AsyncStorage.getItem('enjoying');
      if (enjoying !== null) {
        console.log("Received Enjoying the App: " + enjoying);
        userData.enjoying = enjoying
      }
    } catch (error) {
      console.log("Did not retrieving data for Enjoying the App")
      console.log(error)
    }
    try {
      const favorite = await AsyncStorage.getItem('favorite');
      if (favorite !== null) {
        console.log("Received Favorite Screen: " + favorite);
        userData.favorite = favorite
      }
    } catch (error) {
      console.log("Did not retrieving data for Favorite Screen")
      console.log(error)
    }
    setIsLoaded(true);
  }

  const _validateData = () => {
    let errorStr = ""
    if (userData.name === "") {
      errorStr += "Please enter a name before saving"
    }  
    return errorStr
  }

  const saveInfo = () => {
    const errorMessage = _validateData()
    if (errorMessage.length > 0) {
      // Show errors
      console.log("Error:\n" + errorMessage);
      Alert.alert("Error: " + errorMessage);
    }
    else {
      _storeData()
    }
  }

  useEffect(() => {
    if (!isLoaded) {
      _retrieveData();
    }
  });

  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <Text variant="headlineSmall">User Profile Settings</Text>
        <TextInput
          mode="outlined"
          label="Name"
          placeholder="Name"
          style={[styles.profileInput]}
          defaultValue={userData.name}
          value={userData.name}
          onChangeText = { newName => setUserData({...userData, name: newName}) }
        />
        <View style={styles.checkboxGroup}>
          <Text style={styles.checkboxText}>Enjoying the App?</Text>
          <Checkbox.Item
            style={styles.checkbox}
            status={userData.enjoying === "yes" ? 'checked' : 'unchecked'}
            onPress={checked => {
              setUserData({...userData, enjoying: userData.enjoying === "yes" ? "no" : "yes"});
            }}
          />
        </View>
        <View style={styles.radioGroup}>
          <Text variant="titleMedium" style={styles.radioTitle}>Favorite Screen</Text>
          <RadioButton.Group
            title="Favorite Screen"
            onValueChange={screen => { setUserData({...userData, favorite: screen}) }}
            value={userData.favorite}
          >
            <RadioButton.Item label="Gallery" value="gallery" />
            <RadioButton.Item label="Image" value="image" />
            <RadioButton.Item label="Profile" value="profile" />
          </RadioButton.Group>
        </View>
        <Button
          style={styles.profileSave}
          icon="account-check"
          mode="contained-tonal"
          onPress={() => saveInfo()}
        >Save</Button>
      </View>
    </PaperProvider>
  );
})

export default ProfileScreen;
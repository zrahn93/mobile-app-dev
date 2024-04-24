import React, {useState} from 'react'
import { StyleSheet, Text, View, TextInput, Pressable, ScrollView, Alert } from 'react-native';


export default function App() {
  return (
    <View style={styles.container}>
      <View style={{borderBottomColor: 'gray', borderBottomWidth: 1, marginBottom: 10}}>
        <Text style={[styles.text, styles.heading]}>Wedding Guest List</Text>
      </View>
      <GuestList style={{flex:1, flexDirection: 'column'}} />
    </View>
  );
}


const GuestList = () => {
  // State functions
  const [guest, setGuest] = useState({name: '', priority: '', side: '', age: ''});
  const [guests, setGuests] = useState([]);

  _addGuest = () => {
      // Error Handling
    let errorStr = ""
    if (guest.name === "") {
      errorStr += "Empty name. "
    }
    if (!['Bride', 'Groom'].includes(guest.side)) {
      errorStr += "Invalid Side. ";
    }
    if (!['A', 'B', 'C', 'D'].includes(guest.priority)) {
      errorStr += "Invalid Priority. ";
    }
    if (!['adult', 'child'].includes(guest.age)) {
      errorStr += "Invalid Age. ";
    }

    if (errorStr.length > 0) {
      // Show errors
      console.log("Errors:\n" + errorStr);
      Alert.alert("Errors: " + errorStr);
    }
    else {
      // Add Guest
      setGuests([...guests, guest]);
    }
  }

  // Delete from GuestList
  _deleteGuest = (guestName) => {
    console.log("Deleting " + guestName);
    setGuests(guests.filter((guest) => guest.name !== guestName));
  }

  return (
    <ScrollView>
      <View style={{paddingVertical: 10}}>
        <View style={[styles.inputTextContainer]}>
          <Text style={[styles.text, styles.inputPrompt]}>Name: </Text>
          <TextInput
            style={[styles.inputText]}
            placeholder="Guest"
            defaultValue={guest.name}
            onChangeText = { newName => setGuest({...guest, name: newName}) }
          />
        </View>
        <View style={[styles.inputTextContainer]}>
          <Text style={[styles.text, styles.inputPrompt]}>Side: </Text>
          <TextInput
            style={[styles.inputText]}
            placeholder="(Bride | Groom)"
            defaultValue={guest.side}
            onChangeText = { newSide => setGuest({...guest, side: newSide}) }
          />
        </View>
        <View style={[styles.inputTextContainer]}>
          <Text style={[styles.text, styles.inputPrompt]}>Priority: </Text>
          <TextInput
            style={[styles.inputText]}
            placeholder="(A | B | C | D)"
            defaultValue={guest.priority}
            onChangeText = { newPriority => setGuest({...guest, priority: newPriority}) }
          />
        </View>
        <View style={[styles.inputTextContainer]}>
          <Text style={[styles.text, styles.inputPrompt]}>Age: </Text>
          <TextInput
            style={[styles.inputText]}
            placeholder="(adult | child)"
            defaultValue={guest.age}
            onChangeText = { newAge => setGuest({...guest, age: newAge}) }
          />
        </View>
        <Pressable onPress = {this._addGuest}
        style={{
          backgroundColor: 'white',
          borderColor: '#888',
          borderWidth: 1,
          height: 50,
          width: 50,
          borderRadius: 25,
          alignSelf: 'center',
          marginTop: 15,
          borderBottomColor: 'gray',
        }}>
          <Text style={{fontSize: 32, color: '#888', alignSelf: 'center'}}>+</Text>
        </Pressable>
      </View>
      <View style={{flex:1, borderTopColor: 'gray', borderTopWidth: 1, paddingTop: 10, marginTop: 5}}>
      {guests.map( (guestData, index) => ( 
        <Guest
          key={index}
          name={guestData.name}
          priority={guestData.priority}
          side={guestData.side}
          age={guestData.age}
        />
      ))}
    </View>
    </ScrollView>
  );
}


const Guest = props => {
  // Format backgournd color (pink/blue)
  _sideStyle = () => {
    if (props.side === "Bride") {
      return styles.brideGuestContainer;
    }
    if (props.side === "Groom") {
      return styles.groomGuestContainer;
    }
  }

  const guestObj = <View style={[styles.guestContainer, _sideStyle()]}>
    <Text style={[styles.guestName]}>{props.name}    </Text>
    <Text style={[styles.guestData]}>    {props.priority}    </Text>
    <Text style={[styles.guestData]}>    {props.age}    </Text>
    <Pressable onPress = {() => this._deleteGuest(props.name)}
      style={{
        backgroundColor: 'white',
        borderColor: '#888',
        borderWidth: 1,
        minWidth: 30,
        alignSelf: 'center',
        paddingBottom: 5
    }}>
      <Text style={{fontWeight: 'bold', fontSize: 18, color: '#888', alignSelf: 'center'}}>-</Text>
    </Pressable>
  </View>

  return(guestObj);
}


// Style for better displays
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#494949',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    color: "#fff"
  },
  text: {
    // flex: 1,
    color: "#fff"
  },
  heading: {
    fontStyle: "italic",
    fontSize: 32,
  },
  guestContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#ccc',
    padding: 2,
    marginBottom: 2,
    maxHeight: 75,
    alignContent: 'center',
    justifyContent: 'flex-end'
  },
  inputTextContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    paddingBottom: 4,
    minHeight: 40,
  },
  inputPrompt: {
    alignContent: 'center',
    paddingRight: 5
  },
  inputText: {
    // flex: 1,
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
    backgroundColor: '#fbe3d6',
    borderColor: '#aaa',
    borderWidth: 2,
    minWidth: 150,
  },
  brideGuestContainer: {
    backgroundColor: '#f2cfee'
  },
  groomGuestContainer: {
    backgroundColor: '#c1e5f5',
  },
  guestName: {
    flex: 2,
    fontWeight: 'bold',
    justifyContent: 'flex-start'
  },
  guestData: {
    flex: 1,
    justifyContent: 'flex-end'
  }
});

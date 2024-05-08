import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      justifyContent: 'space-between',
      padding: 20,
      margin: 10,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    gallery: {
      width: '100%',
    },
    card: {
      flex: 1,
      margin: 5,
    },
    galleryImageContainer: {
      width: '33.3%'
    },
    galleryHeader: {
      textAlign: 'center',
      marginTop: 25
    },
    largeCard: {
      width: '100%',
      alignContent: 'center'
    },
    largeImage: {
      height: '95%'
    },
    backButton: {
      maxWidth: 100,
      justifyContent: "flex-start",
      marginTop: 25
    },
    photo: {
      alignItems: 'center',
    },
    profileInput: {
      width: '100%',
      margin: 10
    },
    checkboxGroup: {
      flexDirection: 'row',
      margin: 10,
      alignSelf: 'flex-start'
    },
    checkboxText: {
      color: 'black',
      fontWeight: 'bold',
      padding: 5
    },
    checkbox: {
      flex: 1,
      justifyContent: 'flex-start'
    },
    radioGroup: {
      margin: 5,
      alignSelf: 'flex-start',
      paddingLeft: 10
    },
    radioTitle: {
      fontWeight: 'bold'
    },
    profileSave: {
      margin: 30
    }
  });

export default styles;
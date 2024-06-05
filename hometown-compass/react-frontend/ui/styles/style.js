import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      justifyContent: 'space-between',
      padding: 20,
      margin: 10,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0)',
    },
    backgroundImage: {
      position: 'absolute',
      width:'100%',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: -1
     }
});

export default styles;
import theme from '../styles/theme';
import styles from '../styles/style';
import { View } from 'react-native';
import { Text, PaperProvider } from 'react-native-paper';


const TestScreen = ( ({navigation}) => {

    return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <Text>Test</Text>
      </View>
    </PaperProvider>
  );
})

export default TestScreen;

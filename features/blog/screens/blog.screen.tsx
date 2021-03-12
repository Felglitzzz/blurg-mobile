import * as React from 'react';
import { Platform, StyleProp, StyleSheet, TextInput, useColorScheme, ViewStyle } from 'react-native';
import { View, Text } from '../../../components/Themed';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import { TouchableOpacity } from 'react-native-gesture-handler';
import QuillEditor, { QuillToolbar } from 'react-native-cn-quill';
import { useNavigation } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { useAuthState } from '../../auth/auth.context';
const clockIcon = require('../../../assets/images/clock.png');

type Props = {
  style?: StyleProp<ViewStyle>;
};
export const CustomContainer: React.FC<Props> = ({ children, style }) => {
  return (
    <View style={[style]} onTouchStart={(e) => e.stopPropagation()}>
      {children}
    </View>
  );
};



export default function BlogScreen() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const state = useAuthState();


  const _editor = React.createRef<QuillEditor>();

  const navigateToCreateBlogScreen = () => {
    navigation.navigate('CreateBlog');
  }

  React.useEffect(() => {
    if (!state.loading) {
      SplashScreen.hideAsync()
    }
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Your List</Text>
        <TouchableOpacity
          onPress={navigateToCreateBlogScreen}
          style={styles.buttonHeader}><Text style={styles.buttonHeaderText}>Write a Story</Text></TouchableOpacity>
      </View>
      <View style={styles.cardContainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Header for Blog here</Text>
        </View>
      </View>
      <View style={styles.cardContainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Header for Blog here</Text>
        </View>
      </View>

      <View style={styles.cardContainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Header for Blog here</Text>
        </View>
      </View>

      <View style={styles.cardContainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Header for Blog here</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: hp(2)
  },
  titleContainer: {
    marginTop: hp(2),
    paddingBottom: hp(2),
    borderBottomWidth: 0.3,
    borderBottomColor: '#ebebeb',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  title: {
    fontSize: hp(2.5),
  },
  buttonHeader: {
    width: wp(25),
    height: hp(4),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black'
  },
  buttonHeaderText: {
    fontSize: hp(1.5),
    fontWeight: '500',
    paddingHorizontal: wp(2),
    color: 'white'
  },
  cardContainer: {
    marginTop: hp(2),
    width: '100%',
    height: hp(15),
    padding: 8,
    borderRadius: 5,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.4,
        shadowRadius: 1, 
      },
      android: {
        elevation: 5
      }
    })

  },
  header: {
    justifyContent: 'flex-start'
  },
  headerText: {
    fontWeight: '500',
    fontSize: hp(1.8)
  }
});

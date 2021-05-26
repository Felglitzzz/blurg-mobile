import * as React from 'react';
import { ActivityIndicator, Platform, StyleProp, StyleSheet, TouchableWithoutFeedback, useColorScheme, ViewStyle } from 'react-native';
import { View, Text } from '../../../components/Themed';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import {FlatList} from 'react-native';
import moment from 'moment';

import { useAuthState } from '../../auth/auth.context';
import { useQuery } from '@apollo/client';
import { GET_ALL_BLOGS } from '../../../shared/constants/graphql.constant';

const avgWordsPerMin = 300;

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

export default function BlogScreen({ route }) {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const [blogs, setBlogs] = React.useState({ totalCount: 0, list: []})
  const state = useAuthState();

  const {data, loading, networkStatus, refetch} = useQuery(GET_ALL_BLOGS, {
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
  });

  const navigateToCreateBlogScreen = () => {
    navigation.navigate('CreateBlog');
  }

  React.useEffect(() => {
    if (!state.loading) {
      SplashScreen.hideAsync()
    }
  }, [])

  React.useEffect(() => {
    if (!loading && data) {
      setBlogs(data?.fetchAllBlogs)
    }
  }, [loading, data, networkStatus])

  const renderLoader = () => {
    return (
      <View style={styles.loader}>
        <ActivityIndicator />
      </View>
    )
  }

  const navigate = (item: any) => {
    navigation.navigate('ABlogScreen', { id: item.id})
  }

  const renderItem = ({item}: {item: any}) => {
    return (
      <TouchableWithoutFeedback onPress={() => navigate(item)}>
        <View
        style={styles.cardContainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>{item?.title}</Text>
        </View>
        <View style={styles.authorContainer}>
          <Text style={styles.headerTime}>{item?.profile?.fullName}</Text>
          <Text style={styles.headerTime}>-</Text>
          <Text style={styles.headerTime}>{getEstimatedReadTime(item?.content?.length)} min read</Text>
          <Text style={styles.headerTime}>-</Text>
        <Text style={styles.headerTime}>updated {moment(item?.updatedDate).fromNow()}</Text>
        </View>
      </View></TouchableWithoutFeedback>
    )
  }

  const getEstimatedReadTime = (contentCount: number) => {
    return Math.ceil(contentCount / avgWordsPerMin);
  }

  const renderBlogs = () => {
    return (
      <FlatList
        data = {data.fetchAllBlogs?.list}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Featured Blogs</Text>
        <TouchableOpacity
          onPress={navigateToCreateBlogScreen}
          style={styles.buttonHeader}><Text style={styles.buttonHeaderText}>Write a Story</Text></TouchableOpacity>
      </View>
      { loading && renderLoader() }
      { !loading && renderBlogs() }
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
  cardContainer: {alignSelf: 'center',
    marginTop: hp(2),
    width: wp(90),
    padding: Platform.OS === 'android' ? 12 : 14,
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
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  headerText: {
    fontWeight: Platform.OS === 'ios' ? '500' : 'bold',
    fontSize: hp(1.8)
  },
  headerTime: {
    fontSize: hp(1.4),
    paddingRight: wp(2)
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authorContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: hp(1),
  }
});

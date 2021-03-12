import * as React from 'react';
import { ActivityIndicator, ScrollView, StyleProp, StyleSheet, useColorScheme, useWindowDimensions, ViewStyle } from 'react-native';
import { View } from '../../../components/Themed';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';

import { useAuthState } from '../../auth/auth.context';
import { useQuery } from '@apollo/client';
import { GET_ONE_BLOG } from '../../../shared/constants/graphql.constant';
import HTML from 'react-native-render-html';

const avgWordsPerMin = 250;

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

export default function ABlogScreen({ route, navigation}) {
  const colorScheme = useColorScheme();
  const [blogs, setBlogs] = React.useState({ totalCount: 0, list: []})
  const state = useAuthState();
  const contentWidth = useWindowDimensions().width;

  const id = route?.params?.id;
  
  const {data, loading} = useQuery(GET_ONE_BLOG, {
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
    variables: { id }
  });

  const renderLoader = () => {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    )
  }

  const renderBlog = () => {
    const blog = data?.fetchOneBlog;
    return (
      <ScrollView style={styles.container}>
        <HTML source={{ html: blog.content }} contentWidth={contentWidth} />
    </ScrollView>
    )
  }

  return (
    <>
    { loading && renderLoader() }
    { !loading && renderBlog() }
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: hp(2),
    backgroundColor: '#fff'
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

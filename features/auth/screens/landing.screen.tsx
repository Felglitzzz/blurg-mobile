import React, {useEffect} from 'react';
import {View} from 'react-native';
import {useAuthState} from '../auth.context';
import useCachedResources from '../../../hooks/useCachedResources';


const LandingScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const isLoadingComplete = useCachedResources();
  const state = useAuthState();

  useEffect(() => {
    const bootstrapAsync = async () => {
      if (!state.loading && state.isAuthenticated) {
        navigation.navigate('Root');
      }
      if (!state.loading && !state.isAuthenticated) {
        navigation.navigate('Auth');
      }
    }
    bootstrapAsync();
  });
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
    </View>
  );
};

export default LandingScreen;

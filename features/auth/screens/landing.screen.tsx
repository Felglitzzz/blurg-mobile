import React, {useEffect} from 'react';
import {View} from 'react-native';
import {useAuthState} from '../auth.context';
import useCachedResources from '../../../hooks/useCachedResources';


const LandingScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const isLoadingComplete = useCachedResources();
  const state = useAuthState();

  useEffect(() => {
    const bootstrapAsync = async () => {
      console.log('stater-->>', state);
      if (!state.loading && state.isAuthenticated) {
        navigation.navigate('Root');
      }
      if (!state.loading && !state.isAuthenticated) {
        console.log('stater- git here->>');
        navigation.navigate('Auth');
      }
    }
    bootstrapAsync();
  }, [state.loading, state.isAuthenticated, navigation]);
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
    </View>
  );
};

export default LandingScreen;

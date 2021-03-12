import * as React from 'react';
import { Platform, StyleSheet, TextInput, useColorScheme } from 'react-native';
import { View, Text } from '../../../components/Themed';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { useState } from 'react';
import { AuthFormValues } from '../types';
import { validateSigninForm, validateSignupForm } from '../validate';
import { useMutation } from '@apollo/client';
import { LOGIN_USER, REGISTER_USER } from '../../../shared/constants/graphql.constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { toaster } from '../../../shared/components/service/toaster.service';
import { TOKEN_TAG } from '../../../shared/constants';
import { useAuthDispatch, useAuthState } from '../auth.context';
import * as SplashScreen from 'expo-splash-screen';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview'
import { setAuthStatus, setLoading } from '../auth.action';

const defaultFormData: AuthFormValues = {
  email: '',
  password: '',
  cpassword: '',
  firstName: '',
  lastName: '',
};

export default function AuthScreen({ }) {
  const colorScheme = useColorScheme();
  const [isSignIn, setIsSignIn] = useState<boolean>(false);
  const [formValues, setFormValues] = useState(defaultFormData);
  const [formErrors, setErrors] = useState<Partial<AuthFormValues>>({});
  const state = useAuthState();
  const dispatch = useAuthDispatch();

  const [login] = useMutation(LOGIN_USER);
  const [signup] = useMutation(REGISTER_USER);

  React.useEffect(() => {
    if (!state.loading) {
      SplashScreen.hideAsync()
    }
  }, [])

  function handleAlreadyHaveAnAccount() {
    clearErrors();
    setIsSignIn(!isSignIn);
  }

  const onInputChange = (name: keyof AuthFormValues, value: string) => {
    clearErrors();
    setFormValues((prevState) => ({...prevState, [name]: value}));
  };

  const resetForm = () => {
    setFormValues(defaultFormData);
  };

  const clearErrors = () => {
    setErrors({});
  };

  const handleRegister = async () => {
    clearErrors();
    const errorClone = {...formErrors}
    if (isSignIn) {
      const { email, password } = formValues;
      if (!validateSigninForm({ email, password }, errorClone)) {
        setErrors(errorClone);
      } else {
        try {
          const {
            data
          } = await login({
            variables: { loginInput: {email, password} },
          });
          if (data?.login?.accessToken) {
            await AsyncStorage.setItem(TOKEN_TAG, data.login.accessToken);
            dispatch(setAuthStatus(true))
            dispatch(setLoading(false))
            toaster('success', 'Login Successful!');
          }
        } catch (error) {
          toaster('error', error?.message ?? 'An error occurred!');
          dispatch(setAuthStatus(false))
          dispatch(setLoading(false))
        }
      }
    } else {
      if (!validateSignupForm(formValues , errorClone)) {
        setErrors(errorClone);
      } else {
        const { email, password, firstName, lastName } = formValues;
        try {
          const {
            data
          } = await signup({
            variables: { userRegistrationInput: { firstName, lastName, email, password } },
          });
          if (data?.signup?.accessToken) {
            await AsyncStorage.setItem(TOKEN_TAG, data.signup.accessToken);
            dispatch(setAuthStatus(true))
            dispatch(setLoading(false))
            toaster('success', 'Signup Successful!');
          }
        } catch (error) {
          toaster('error', error?.message ?? 'An error occurred!');
          dispatch(setAuthStatus(false))
          dispatch(setLoading(false))        }
      }
    }
  }

  return (
    <KeyboardAwareScrollView style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{isSignIn ? 'Welcome Back': 'Join Blurg'}</Text>
      </View>
      {!isSignIn && <View style={styles.inputContainer}>
        <TextInput
          autoCapitalize="none"
          style={[styles.textInput, formErrors?.firstName ? { borderBottomColor: 'red' } : undefined ]}
          placeholder='First name'
          onChangeText={(value) => {
            onInputChange('firstName', value)
          }}
          keyboardType={'default'}
          value={formValues.firstName}
        />
        { formErrors.firstName && <Text style={styles.errorText}>{formErrors.firstName}</Text>}
      </View>}

      { !isSignIn && <View style={styles.inputContainer}>
        <TextInput
          autoCapitalize="none"
          style={[styles.textInput, formErrors?.lastName ? { borderBottomColor: 'red' } : undefined ]}
          placeholder='Last name'
          onChangeText={(value) => {
            onInputChange('lastName', value)
          }}
          keyboardType={'default'}
          value={formValues.lastName}
        />
        { formErrors.lastName && <Text style={styles.errorText}>{formErrors.lastName}</Text>}
      </View>}

      <View style={styles.inputContainer}>
        <TextInput
          autoCapitalize="none"
          style={[styles.textInput, formErrors?.email ? { borderBottomColor: 'red' } : undefined ]}
          placeholder='Email'
          onChangeText={(value) => {
            onInputChange('email', value)
          }}
          keyboardType={'default'}
          value={formValues.email}
        />
        { formErrors.email && <Text style={styles.errorText}>{formErrors.email}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          autoCapitalize="none"
          style={[styles.textInput, formErrors?.password ? { borderBottomColor: 'red' } : undefined ]}
          placeholder='Password'
          onChangeText={(value) => {
            onInputChange('password', value)
          }}
          keyboardType={'default'}
          value={formValues.password}
          secureTextEntry
        />
        { formErrors.password && <Text style={styles.errorText}>{formErrors.password}</Text>}
      </View>

      {!isSignIn && <View style={styles.inputContainer}>
        <TextInput
          autoCapitalize="none"
          style={[styles.textInput, formErrors?.cpassword ? { borderBottomColor: 'red' } : undefined ]}
          placeholder='Confirm Password'
          onChangeText={(value) => {
            onInputChange('cpassword', value)
          }}
          keyboardType={'default'}
          value={formValues.cpassword}
          secureTextEntry
        />
        { formErrors.cpassword && <Text style={styles.errorText}>{formErrors.cpassword}</Text>}
      </View>}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleRegister}
          style={styles.button}>
            <Text style={styles.buttonText}>{ isSignIn ? 'Login' : "Register" }</Text>
          </TouchableOpacity>
        {!isSignIn && <View>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleAlreadyHaveAnAccount}>
            <Text style={styles.loginButtonText}>Already have an account? Click here</Text>
          </TouchableOpacity>
        </View>}
        {isSignIn && <View>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleAlreadyHaveAnAccount}>
            <Text style={styles.loginButtonText}>Don't have an account? Sign up</Text>
          </TouchableOpacity>
        </View>}
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: hp(2),
    flex: 1,
  },
  titleContainer: {
    marginTop: hp(12),
    marginBottom: hp(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: hp(5),
    fontWeight: 'bold',
  },
  textInput: {
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    fontSize: wp(4),
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: hp(1),
  },
  inputContainer: {
    margin: hp(2),
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  buttonContainer: {
    margin: hp(2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: wp(70),
    borderRadius: 6,
    height: hp(5),
    backgroundColor: '#0D0D0D',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: hp(3)
  },
  loginButton: {
    marginTop: hp(1),
  },
  loginButtonText: {
    color: '#000',
    fontSize: hp(1.5)
  },
  errorText: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    fontSize: wp(3),
    marginTop: hp(0.2),
    color: 'red'
  }
});

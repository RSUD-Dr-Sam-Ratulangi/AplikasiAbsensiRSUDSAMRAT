/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React from 'react';
import {useEffect, useState} from 'react';
import {
  SplashScreen,
  Login,
  AttendanceDone,
  OpenCamera,
  AttendanceConfirmation,
  Profile,
  History,
} from './src/pages';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Tabs from './src/navigation';
import NetInfo from '@react-native-community/netinfo';
import {View} from 'react-native';
import LottieView from 'lottie-react-native';

const App = () => {
  const [isConnected, setIsConnected] = useState(false);

  const Stack = createNativeStackNavigator();

  useEffect(() => {
    unSubscribe();
  }, []);

  const unSubscribe = NetInfo.addEventListener(state => {
    if (state.isConnected === false && isConnected === true) {
      setIsConnected(false);
      console.log('not connected');
    } else if (state.isConnected === true && isConnected === false) {
      setIsConnected(true);
      console.log('connected');
    }
  });

  return (
    <>
      {isConnected ? (
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="SplashScreen"
              component={SplashScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Login"
              component={Login}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Tabs"
              component={Tabs}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="OpenCamera"
              component={OpenCamera}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="AttendanceConfirmation"
              component={AttendanceConfirmation}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="AttendanceDone"
              component={AttendanceDone}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Profile"
              component={Profile}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="History"
              component={History}
              options={{headerShown: false}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      ) : (
        <View style={{flex: 1, backgroundColor: '#fff'}}>
          <LottieView
            source={require('./src/assets/gif/noInternet.json')}
            autoPlay
            loop
            style={{flex: 1}}
          />
        </View>
      )}
    </>
  );
};

export default App;

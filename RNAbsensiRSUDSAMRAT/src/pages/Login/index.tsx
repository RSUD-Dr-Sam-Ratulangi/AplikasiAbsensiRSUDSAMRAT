import {
  Image,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  ScrollView,
  Dimensions,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Ilustration3, Logo} from '../../assets/images';
import Button from '../../components/Button';
import Gap from '../../components/Gap';
import axios from 'axios';

const Login = ({navigation}: any) => {
  const [nik, setNik] = useState('');
  const [password, setPassword] = useState('');
  const [dataUser, setDataUser] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

  const imageWidth = screenWidth * 1;
  const imageHeight = imageWidth * (2 / 1);

  const url = 'http://rsudsamrat.site:3001/api/auth/login';
  const data = {
    nik: nik,
    password: password,
  };
  const headers = {
    'Content-Type': 'application/json',
  };

  const storeAccessToken = async (token, nik) => {
    try {
      await AsyncStorage.multiSet([
        ['access_token', token],
        ['nik', nik],
        ['password', password],
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickLogin = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(url, data, {headers});
      const {access_token, nik} = response.data.data;

      setDataUser(access_token);
      storeAccessToken(access_token, nik);

      if (access_token) {
        if (Platform.OS === 'android') {
          navigation.replace('Tabs');
          setIsLoading(false);
        } else if (Platform.OS === 'ios') {
          navigation.push('Tabs');
        }
      } else {
        Alert.alert('', 'Terjadi Kesalahan Pada Akun!', [
          {
            text: 'OK',
            style: 'default',
          },
        ]);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        Alert.alert(
          'NIK/Password tidak sesuai!',
          'Pastikan NIK dan Password di isi dengan benar.',
          [
            {
              text: 'OK',
              style: 'default',
            },
          ],
        );
      } else {
        console.error('An unexpected error occurred:', error);
        Alert.alert('Pastikan NIK & PASSWORD di isi dengan benar.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const keys = ['nik', 'password'];

    AsyncStorage.multiGet(keys)
      .then(result => {
        result.forEach(([key, value]) => {
          if (key === 'nik') {
            setNik(value);
          } else if (key === 'password') {
            setPassword(value);
          }
        });
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <SafeAreaView style={styles.page}>
      <Image
        source={Ilustration3}
        style={{
          width: imageWidth,
          height: imageHeight,
          position: 'absolute',
          resizeMode: 'cover',
        }}
      />
      <ScrollView>
        <View style={styles.container}>
          <Image source={Logo} style={styles.logo} />
          <Text style={styles.text}>RSUD DR SAM RATULANGI TONDANO</Text>
          <Gap height={93} />
          <TextInput
            style={styles.input}
            onChangeText={setNik}
            value={nik}
            placeholder="NIK"
            keyboardType="numeric"
          />
          <Gap height={76} />
          <TextInput
            style={styles.input}
            onChangeText={setPassword}
            value={password}
            secureTextEntry={true}
            placeholder="Kata Sandi"
          />
          <Gap height={82} />
          <Button title="Log in" onPress={handleClickLogin} />

          {isLoading && (
            <View style={styles.activityIndicatorContainer}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  container: {
    alignItems: 'center',
  },
  logo: {
    height: 115,
    width: 115,
    marginTop: 120,
  },
  text: {
    fontSize: 17,
    color: '#293030',
    marginTop: 30,
  },
  input: {
    height: 40,
    width: 320,
    borderBottomWidth: 2,
    borderColor: '#4E7674',
  },
  activityIndicatorContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -20, // Half of the ActivityIndicator size
    marginLeft: -20, // Half of the ActivityIndicator size
    zIndex: 1,
  },
});

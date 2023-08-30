import { Image, StyleSheet, Text, View, SafeAreaView, TextInput, ScrollView, Dimensions, Alert } from 'react-native';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ilustration3, Logo } from '../../assets/images';
import Button from '../../components/Button';
import Gap from '../../components/Gap';
import axios from 'axios';

const Login = ({navigation}: any) => {
    const [nik, setNik] = useState('');
    const [password, setPassword] = useState('');
    const [dataUser, setDataUser] = useState();
    const [error, setError] = useState('');
    
    const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
    
    const imageWidth = screenWidth * 1;
    const imageHeight = imageWidth * (2 / 1);
    
    const url = 'http://rsudsamrat.site:3001/api/auth/login';
    const data = {
        "nik": nik,
        "password": password
    };
    const headers = {
        'Content-Type': 'application/json'
    };

    const storeAccessToken = async (token, nik) => {
        try {
            await AsyncStorage.multiSet([['access_token', token], ['nik', nik]]);
            console.log('Token dan nik berhasil disimpan.');
        } catch (error) {
            console.log('Gagal menyimpan token dan nik:', error);
        }
    };

    const handleClickLogin = () => {
        axios.post(url, data, {headers})
        .then(function (response) {
            const { access_token, nik } = response.data.data

            setDataUser(access_token);
            storeAccessToken(access_token, nik);
            
            if(access_token){
                navigation?.replace('Tabs');
            } else {
                console.log("No access token found!")
                Alert.alert(
                    '',
                    'Something wrong when access your account!',
                    [
                        {
                            text: 'OK',
                            style: 'default',
                        },
                    ],
                )
            }
        })
        .catch(function (error) {
            console.log('error:',error);
            Alert.alert(
                'Error',
                `${error}`,
                [
                    {
                        text: 'OK',
                        style: 'default'
                    }
                ]
            )
            
            Alert.alert(
                'NIK/Password tidak sesuai!',
                'Pastikan NIK dan Password di isi dengan benar.',
                [
                    {
                        text: 'OK',
                        style: 'default',
                    },
                ],
            )
        });
    };


    return (
        <SafeAreaView style={styles.page}>
            <ScrollView>
                <View style={styles.container}>
                    <Image source={Ilustration3} style={{width: imageWidth, height: imageHeight, position: 'absolute'}} />
                    <Image source={Logo} style={styles.logo} />
                    <Text style={styles.text}>RSUD DR SAM RATULANGI TONDANO</Text>
                    <Gap height={93}/>
                    <TextInput
                        style={styles.input}
                        onChangeText={setNik}
                        value={nik}
                        placeholder='NIK'
                        keyboardType='numeric'
                        />
                    <Gap height={76}/>
                    <TextInput
                        style={styles.input}
                        onChangeText={setPassword}
                        value={password}
                        secureTextEntry={true}
                        placeholder='Kata Sandi'
                        />
                    <Gap height={82}/>
                    <Button title="Log in" onPress={handleClickLogin}/> 
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Login

const styles = StyleSheet.create({
    page:{
        flex: 1,
    },
    container:{
        alignItems: 'center',
        paddingBottom: '30%'
    },
    logo:{
        height: 115,
        width: 88,
        marginTop: 120
    },
    text:{
        fontSize: 17,
        color: '#293030',
        marginTop: 30
    },
    input:{
        height: 40,
        width: 320,
        borderBottomWidth: 2,
        borderColor: '#4E7674',
    }
})
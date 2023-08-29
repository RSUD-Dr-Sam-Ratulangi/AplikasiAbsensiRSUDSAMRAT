import { StyleSheet, Text, View, Button, Alert, Image, SafeAreaView, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ProfilePicture, Ilustration7 } from '../../assets/images'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'

const Profile = ({navigation}: any) => {
    const [picture, setPicture] = useState(ProfilePicture);
    const [name, setName] = useState('');
    const [id, setId] = useState('19740516 199705 1 001');
    const [division, setDivision] = useState('UPTIRSsss');
    const [agency, setAgency] = useState('Pemerintah Provinsi Sulawesi Utara');
    const [office, setOffice] = useState('RSUD DR Sam Ratulangi Tondano');
    const [appVersion, setAppVersion] = useState('v.2.3.0');

    const getUserData = async () => {
        const nik = await AsyncStorage.getItem('nik');
        axios.get(`http://rsudsamrat.site:9999/api/v1/dev/employees/nik/${nik}`)
                .then(function (response){
                    console.log(response.data.name)
                    setName(response.data.name)
                    setId(response.data.nik)
                    setDivision(response.data.role)
                }).catch(function(error){
                    console.log('error:', error)
                })
    }

    useEffect(() => {
        getUserData();
    }, [])
    
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.headerBg}>
                    <Image source={Ilustration7} style={{height: '100%', width: '100%'}}/>
                    <Text style={styles.pageTitle}>Profile</Text>
                </View>
                <View style={styles.contentContainer}>
                    <Text style={{fontSize: 20, color: '#86869E', fontWeight: '500', alignSelf: 'flex-start'}}>Data Pegawai</Text>
                    <View style={styles.secContainer}>
                        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 15}}>
                            <Image source={ProfilePicture} style={styles.profilePicture} />
                            <View>
                                <Text style={{fontSize: 16, fontWeight: 'bold', color: '#424247'}}>{name}</Text>
                                <Text style={{fontSize: 14, color: '#424247'}}>{id}</Text>
                            </View>
                        </View>
                        <View>
                            <Text style={styles.text}>Instansi</Text>
                            <Text style={styles.text2}>{agency}</Text>
                        </View>
                        <View style={{marginTop: 20}}>
                            <Text style={styles.text}>Kantor</Text>
                            <Text style={styles.text2}>{office}</Text>
                        </View>
                        <View style={{marginTop: 20}}>
                            <Text style={styles.text}>Bidang</Text>
                            <Text style={styles.text2}>{division}</Text>
                        </View>
                    </View>
                    <Text style={{fontSize: 20, color: '#86869E', fontWeight: '500', alignSelf: 'flex-start'}}>Pengaturan</Text>
                    <View style={styles.secContainer}>
                        <Text style={styles.text}>App Version</Text>
                        <Text style={styles.text2}>{appVersion}</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Profile

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#ffffff'
    },
    headerBg:{
        height: 120,
        flexDirection: 'row'
    },
    pageTitle:{
        fontSize: 25,
        fontWeight: 'bold',
        color: '#fff',
        position: 'absolute',
        alignSelf: 'center',
        left: 27
    },
    contentContainer:{
        paddingTop: 46,
        paddingHorizontal: 25,
        alignItems: 'center',
    },
    profilePicture:{
        height: 66,
        width: 66,
        borderRadius: 33,
        borderWidth: 2,
        borderColor: '#01A7A3',
        marginRight: 13
    },
    secContainer:{
        width: '100%',
        height: 'auto',
        padding: 14,
        backgroundColor: '#ffffff',
        shadowColor: '#000000',
        shadowOffset: {width:0, height:2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        borderRadius: 12,
        marginBottom: 42,
        marginTop: 12
    },
    text:{
        fontSize: 14,
        fontWeight: 'bold',
        color: '#9A9A9A',
        marginBottom: 6
    },
    text2:{
        fontSize: 16,
        color: '#424247'
    }
})
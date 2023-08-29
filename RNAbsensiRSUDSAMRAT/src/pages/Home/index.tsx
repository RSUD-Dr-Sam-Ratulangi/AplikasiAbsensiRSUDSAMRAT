import { StyleSheet, Text, View, SafeAreaView, Image, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ilustration1, ProfilePicture } from '../../assets/images'
import AttendanceCard from '../../components/AttendanceCard';
import AnnouncementCard from '../../components/AnnouncementCard';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = () => {
    const [name, setName] = useState('');

    const getNik = async () => {
        try {
            const nik = await AsyncStorage.getItem('nik');
            const getUserData = () => {
                axios.get(`http://rsudsamrat.site:9999/api/v1/dev/employees/nik/${nik}`)
                .then(function (response){
                    setName(response.data.name);
                    const getEmployeeId = response.data.employeeId;
                    const conEmployeeId = getEmployeeId.toString();
                    setEmployeeId(conEmployeeId);
                }).catch(function(error){
                    console.log('error:', error)
                })
            }
            getUserData();
        } catch (error) {
            console.log('Gagal mengambil nik: ', error)
        }
    }

    
    const setEmployeeId = async (employeeId) => {
        try {
            await AsyncStorage.setItem('employeeId', employeeId);
            console.log('berhasil menyimpan employee id :', employeeId);
        } catch (error) {
            console.log('error:', error);
        }
    }

    useEffect(() => {
        getNik();
    }, [])

    return (
        <SafeAreaView style={styles.page}>
            <ScrollView>
                <Image source={Ilustration1} style={styles.ilustration}/>
                <View style={styles.header}>
                    <View style={styles.profilePicture}>
                        <Image source={ProfilePicture} style={{width: 86, height: 86, borderRadius: 43}} />
                    </View>
                    <View>
                        <Text style={styles.greeting}>Holla,</Text>
                        <Text style={styles.name}>{name}</Text>
                    </View>
                </View>
                <View style={styles.contentContainer}>
                    <Text style={styles.text1}>Today Attendance</Text>
                    <View style={styles.cardContainer}>
                        <AttendanceCard icon={require('./../../assets/icons/Signin.png')} title="Check In" time="08.00 am" addInfo="On Time"/>
                        <AttendanceCard icon={require('./../../assets/icons/Signout.png')} title="Check Out" time="16.00 am" addInfo="Go Home"/>
                    </View>
                    <View style={styles.additionalCard}>
                        <AttendanceCard icon={require('./../../assets/icons/MiniCalendar.png')} title="Total Days" time="28" addInfo="Working Days"/>
                    </View>
                </View>
                <View style={styles.announcementContainer}>
                    <Text style={styles.text1}>Announcement</Text>
                    <AnnouncementCard title="HOLIDAY HUT RI-78" desc="Agustus 16-17 Akan libur bersama dalam rangka HUT RI ke-78" date="Kamis, 17 Agustus 2023"/>
                    <AnnouncementCard title="RELOKASI RSUD SAM RATULANGI TONDANO" desc="September Akan pindah ke rumah sakit baru Seluruh Staff MANAJEMEN" date="Senin, 1 Agustus 2023"/>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Home

const styles = StyleSheet.create({
    page:{
        flex:1,
        backgroundColor: '#ffffff'
    },
    ilustration:{
        position: 'absolute',

    },
    header:{
        marginTop: 50,
        borderBottomWidth: 1,
        borderColor: '#D7D8D8',
        width: '100%',
        paddingLeft: 10,
        marginHorizontal: 10,
        flexDirection: 'row',
    },
    profilePicture:{
        width: 86,
        height: 86,
        marginRight: 14,
        marginBottom: 11,
    },
    greeting:{
        fontSize: 25,
        color: '#333333',
    },
    name:{
        fontSize: 16,
        fontWeight: '600',
        color: '#717171',
    },
    contentContainer:{
        marginTop: 26,
        paddingHorizontal: 16
    },
    text1:{
        fontSize: 20,
        color: '#333333'
    },
    cardContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15
    },
    additionalCard:{
        alignItems: 'center',
        marginTop: 21
    },
    announcementContainer:{
        marginTop: 20,
        paddingHorizontal: 20,
        marginBottom: 90
    }
})
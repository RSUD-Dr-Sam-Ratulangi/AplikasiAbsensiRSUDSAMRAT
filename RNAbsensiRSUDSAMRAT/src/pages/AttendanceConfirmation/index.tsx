import { Image, StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import SwipeButton from 'rn-swipe-button'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

const AttendanceConfirmation = ({imageData, navigation, attdType}: any) => {

    const [scheduleId, setScheduledID] = useState();
    const [employeeId, setEmployeeId] = useState('');
    const [attendanceDate, setAttendanceDate] = useState('');
    const [clock, setClock] = useState('');
    const [locationLatIn, setLocationLatIn] = useState(37.7749);
    const [locationLongIn, setLocationLongIn] = useState(-122.4194);
    const [locationLatOut, setLocationLatOut] = useState(37.7749);
    const [locationLongOut, setLocationLongOut] = useState(-122.4194);
    const [selfieUrlCheckIn, setSelfieUrlCheckIn] = useState('https://rb.gy/fre1l');
    const [selfieUrlCheckOut, setSelfieUrlCheckOut] = useState('https://rb.gy/fre1l');
    const [status, setStatus] = useState('CheckIn');
    const [attendanceType, setAttendanceType] = useState(attdType);
    const [attendanceInOrOut, setAttendanceInOrOut] = useState('');
    const [attendanceId, setAttendanceId] = useState(0);

    const getUserData = async (currentDate) => {
        try {
            const employeeId = await AsyncStorage.getItem('employeeId');
            setEmployeeId(employeeId);

            const getAttendanceId = async (attendanceDate,employeeId) => {
                await axios.get(`http://rsudsamrat.site:9999/api/v1/dev/attendances/byDateAndEmployee?attendanceDate=${attendanceDate}&employeeId=${employeeId}`)
                .then(function(response){
                    const attendanceId = response.data[0].attendanceId;
                    setAttendanceId(attendanceId);
                    console.log('success to get attendanceId:', attendanceId)
                })
                .catch(function(error){
                    console.log('failed to get attendanceId:', error)
                })
            }

            const getScheduledId = async (attendanceDate, employeeId) => {
                await axios.get(`http://rsudsamrat.site:9999/api/v1/dev/schedule`)
                .then((response) => {
                    const convertEmployeeId = parseInt(employeeId);
                    const filteredScheduleId = response.data.filter(schedule => 
                        schedule.scheduleDate === attendanceDate &&
                        schedule.employees.some(employee => employee.employeeId === convertEmployeeId)
                    )
                    .map(schedule => schedule.scheduleId);
                    console.log('Filtered Schedule ID:', filteredScheduleId[0]);
                    setScheduledID(filteredScheduleId[0]);
                }).catch((err) => {
                    console.log('error when access endpoint:', err)
                });
            } 

            getAttendanceId(currentDate, employeeId);
            getScheduledId(currentDate, employeeId);
        } catch (error) {
            console.log('error: ', error)
        }
    }

    const checkIn = async () => {
        let data = new FormData();
        const url = 'http://rsudsamrat.site:9999/api/v1/dev/attendances/checkInMasuk';
        data.append('scheduleId', `${scheduleId}`);
        data.append('employeeId', `${employeeId}`);
        data.append('attendanceDate', `${attendanceDate}`);
        data.append('clockIn', `2023-09-04T07:55:00`);
        data.append('clockOut', '');
        data.append('locationLatIn', `${locationLatIn}`);
        data.append('locationLongIn', `${locationLongIn}`);
        data.append('selfieCheckInImage', `${selfieUrlCheckIn}`);
        data.append('status', `${status}`);
        data.append('attendanceType', `${attendanceType}`);
        
        try {
            await axios.post(url, data,{
                headers: {"Content-Type": "multipart/form-data"}
            })
            .then(function(response){
                console.log('berhasil check in');
                navigation.replace('AttendanceDone');
            })
        } catch (error) {
            console.log('error saat check in:', error);
            Alert.alert('Kendala saat Check In', 'Pastikan anda memiliki jadwal. Jika ada kendala, mohon hubungi admin.', 
            [
                {text: 'OK', onPress: () => console.log('OK Pressed')},
            ]);
        }
    }

    const checkOut = (attendanceId) => {
        let url = 'http://rsudsamrat.site:9999/api/v1/dev/attendances/updatePulang';
        let data = new FormData();

        data.append('attendanceId', `${attendanceId}`);
        data.append('clockOut', `2023-09-04T14:05:00`);
        data.append('locationLatOut', `${locationLatOut}`);
        data.append('locationLongOut', `${locationLongOut}`);
        data.append('selfieUrlCheckOut', `${selfieUrlCheckOut}`);

        axios.post(url, data, {
            headers: {"Content-Type": "multipart/form-data"}
        })
        .then((result) => {
            navigation.replace('AttendanceDone');
            console.log('berhasil check out')
        }).catch((err) => {
            console.log('error saat check out:',err)
            Alert.alert('Tidak bisa Check Out', 'Pastikan anda Check Out sesuai jadwal. Jika ada kendala, mohon hubungi admin.', 
            [
                {text: 'OK', onPress: () => console.log('OK Pressed')},
            ]);
        });
    }

    const setCheckInOrOut = async (attendanceDate) => {
        const employeeIdd = await AsyncStorage.getItem('employeeId');

        axios.get(`http://rsudsamrat.site:9999/api/v1/dev/attendances/byDateAndEmployee?attendanceDate=${attendanceDate}&employeeId=${employeeIdd}`) //jangan lupa ganti employee id logic
        .then(function(response){
            if(response.data === `Employee hasn't taken any attendance on the given date.`){
                setAttendanceInOrOut('Swipe to Check-In');
            } else {
                setAttendanceInOrOut('Swipe to Check-Out');
            }
        })
        .catch((error)=>{
            console.log('error:',error);
        })
    }

    useEffect(() => {
        const date = String(new Date().getDate()).padStart(2, '0'); 
        const month = String(new Date().getMonth() + 1).padStart(2, '0'); 
        const year = String(new Date().getFullYear()).padStart(2, '0');
        const hours = String(new Date().getHours()).padStart(2, '0'); 
        const min = String(new Date().getMinutes()).padStart(2, '0'); 
        const sec = String(new Date().getSeconds()).padStart(2, '0'); 

        const getDate =  year + '-' + month + '-' + date;
        // const getDate = '2023-09-04';
        setAttendanceDate(getDate);

        setClock(
            year + '-' + month + '-' + date + 'T' + hours + ':' + min + ':' + sec
        );

        setCheckInOrOut(getDate);
        getUserData(getDate);
    }, [])
    
    const afterSwipe = () => {
        if(attendanceInOrOut === 'Swipe to Check-In'){
            checkIn();
        } else if (attendanceInOrOut === 'Swipe to Check-Out') {
            checkOut(attendanceId);
        }
    }
    
    const reOpenCamera = () => {
        navigation?.replace('OpenCamera', { attendanceType: attendanceType });
    }

return (
    <SafeAreaView style={styles.page}>
        <Text style={styles.title}>Konfirmasi Foto</Text>
        <View style={styles.photoContainer}>
            <Image 
                source={{uri: 'file://' + imageData}}
                style={{
                    height: '100%',
                    width: '100%',
                    borderRadius: 15
                }}
                />
        </View>
        <TouchableOpacity 
            style={styles.button}
            activeOpacity={0.7}
            onPress={()=> {
                reOpenCamera();
        }}>
            <Text style={{fontSize: 23, color: '#262D33', fontWeight: '600'}}>Take Again</Text>
        </TouchableOpacity>
        <View style={{width: '75%', marginTop: 20}}>
            <SwipeButton
                title={attendanceInOrOut}
                thumbIconImageSource={require('./../../assets/icons/Expand_right_double.png')} 
                railBackgroundColor="#03AD00"
                railBorderColor="#03AD00"
                thumbIconBackgroundColor='#fff'
                thumbIconBorderColor='#fff'
                titleStyles={{fontSize:23, color:'#fff', fontWeight:'600'}}
                shouldResetAfterSuccess={true}
                onSwipeSuccess={afterSwipe}
            />
        </View>
    </SafeAreaView>
)
}

export default AttendanceConfirmation

const styles = StyleSheet.create({
    page:{
        flex: 1,
        backgroundColor: '#4ABEBB',
        alignItems: 'center'
    },
    title:{
        fontSize: 30,
        fontWeight: '500',
        color: '#fff',
        marginTop: 93,
        marginBottom: 20
    },
    photoContainer:{
        height: '50%',
        width: '70%',
        marginBottom: 36
    },
    button:{
        width: '70%',
        backgroundColor: '#61F8F5',
        paddingVertical: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100
    }
})
import { StyleSheet, Text, View, SafeAreaView, Image, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Calendar } from 'react-native-calendars'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const History = ({navigation}: any) => {
    const screenWidht = Dimensions.get('window').width;

    const [status, setStatus] = useState('');
    const [location, setLocation] = useState('');
    const [time, setTime] = useState('');
    const [date, setDate] = useState('')
    const [data, setData] = useState([]);
    const [getMarkedDates, setGetMarkedDates] = useState();
    const [selectedDateData, setSelectedDateData] = useState(null);
    
    const getEmployeeId = async () => {
        const employeeId = await AsyncStorage.getItem('employeeId');
        getData(employeeId);
        console.log(employeeId);
    }
    
    const getData = (employeeId) => {
        const url = `http://rsudsamrat.site:9999/api/v1/dev/attendances/filter?employeeId=${employeeId}`;
        axios.get(url)
        .then(function (response) {
            setData(response.data);
        })
        .catch(function (error) {
            console.log('error:',error);
        });
    }

    useEffect(() => {
        getEmployeeId();
    }, [])

    useEffect(() => {
        const markedDates = data.reduce((result, schedule) => {
            schedule.attendances.forEach(attendance => {
                const { scheduleDate, attendanceState } = attendance;
                if (scheduleDate) {
                    result[scheduleDate] = { selected: true, selectedColor:  getColorForAttendanceState(attendanceState)};
                }
            });
            return result;
        }, {});

        setGetMarkedDates(markedDates);
    }, [data]);

    const getColorForAttendanceState = (attendanceState) => {
        switch (attendanceState) {
            case "ONTIME":
                return "#14F42B";
            case "ALPHA":
                return "#F41414";
            case "LATE":
                return "#F0F414";
            default:
                return "#14F42B";
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Image 
                source={require('./../../assets/images/Ilustration4.png')}
                style={{width: screenWidht, height: 50}}
                resizeMode='cover'
            />
            <Calendar
            style={{
                height: 350,
            }}
            current={'2023-08-01'}
            onDayPress={day => {
                const selectedData = data.find(schedule => schedule.attendances?.some(attendance => attendance.scheduleDate === day.dateString));
                if (selectedData) {
                    setSelectedDateData(selectedData);
                    const clockInTimeString = selectedData.attendances[0].clockIn;
                    const formattedClockInTime = clockInTimeString.slice(11, 19);
                    setTime(formattedClockInTime);
                    setDate(selectedData.attendances[0].scheduleDate);
                    setStatus('Check-In Pagi ('+selectedData.attendances[0].attendanceType+')');
                    if(selectedData.attendances[0].location === null){
                        setLocation('RSUD DR SAM RATULANGI TONDANO, Kembuan, Tondano Utara, Minahasa, Sulawesi Utara');
                    } else {
                        setLocation(selectedData.attendances[0].location);
                    }
                } else {
                    setTime('');
                    setDate('-');
                    setStatus('Tidak ada riwayat pekerjaan pada '+day.dateString);
                    setLocation('-');
                }
            }}
            markedDates={getMarkedDates}
        />
        <View>
            <Image 
                source={require('./../../assets/images/Ilustration5.png')}
                style={{width: screenWidht, height: 110, position: 'absolute'}}
                resizeMode='cover'
            />
            <Text style={styles.status}>{status}</Text>
            <View style={styles.desc}>
                <View style={styles.locationContainer}>
                    <Image 
                        source={require('./../../assets/icons/IconLocation.png')}
                        style={{width: 38, height: 38}}
                    />
                    <Text style={styles.text}>{location}</Text>
                </View>
                <View style={styles.timeContainer}>
                    <Image 
                        source={require('./../../assets/icons/IconTime.png')}
                        style={{width: 33, height: 33, marginRight: 2}}
                    />
                    <Text style={styles.text}>{time} {date}</Text>
                </View>
            </View>
        </View>
        </SafeAreaView>
    )
}

export default History

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#ffffff',
    },
    status: {
        fontSize: 25,
        color: '#292F2F',
        paddingHorizontal: 27
    },
    desc:{
        marginLeft: 15,
        marginTop: 20
    },
    text:{
        fontSize: 17,
        color: '#666666',
        width: '80%',
        marginLeft: 7
    },
    locationContainer:{
        flexDirection: 'row',
    },
    timeContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 3,
        marginTop: 15
    },
})
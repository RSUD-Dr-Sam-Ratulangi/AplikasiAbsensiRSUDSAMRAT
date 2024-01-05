import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Dimensions,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Calendar} from 'react-native-calendars';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalApp from '../../components/Modal';

const History = ({navigation}: any) => {
  const screenWidht = Dimensions.get('window').width;

  const [status, setStatus] = useState('');
  const [location, setLocation] = useState('');
  const [timeIn, setTimeIn] = useState('');
  const [timeOut, setTimeOut] = useState('');
  const [dateCheckIn, setDateCheckIn] = useState('');
  const [dateCheckOut, setDateCheckOut] = useState('');
  const [data, setData] = useState([]);
  const [getMarkedDates, setGetMarkedDates] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckOut, setIsCheckOut] = useState(false);
  const [isEnableDesc, setIsEnableDesc] = useState(false);
  const getdate = String(new Date().getDate()).padStart(2, '0');
  const getmonth = String(new Date().getMonth() + 1).padStart(2, '0');
  const getyear = String(new Date().getFullYear()).padStart(2, '0');
  const currentDate = getyear + '-' + getmonth + '-' + getdate;
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDateData, setSelectedDateData] = useState<any | null>(null);

  //   const handleDayPress = () => {
  //     setModalVisible(true);
  //   };

  const handleRefresh = async () => {
    setRefreshing(true);

    try {
      await getEmployeeId();
    } catch (error) {
      console.error('Error handling refresh:', error.message);
    } finally {
      setRefreshing(false);
    }
  };

  const getEmployeeId = async () => {
    const employeeId = await AsyncStorage.getItem('employeeId');
    getData(employeeId);
  };

  const getData = async employeeId => {
    setIsLoading(true);
    const url = `http://rsudsamrat.site:9999/api/v1/dev/attendances/filter?employeeId=${employeeId}`;

    try {
      const response = await axios.get(url);
      console.log('Data:', response.data);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getEmployeeId();
  }, []);

  const handleDayPress = day => {
    const selectedData = data.find(schedule =>
      schedule.attendances?.some(
        attendance => attendance.scheduleDate === day.dateString,
      ),
    );

    if (selectedData) {
      setModalVisible(true);
      console.log('ini selected data', selectedData);
      const clockInTime = selectedData.attendances[0].clockIn.slice(11, 19);
      const clockOutTime = selectedData.attendances[0].clockOut;
      const formattedClockOutTime =
        clockOutTime !== null ? clockOutTime.slice(11, 19) : null;
      const formattedDateCheckOut =
        clockOutTime !== null ? clockOutTime.slice(0, 10) : null;

      setSelectedDateData(selectedData);
      setIsEnableDesc(true);
      setIsCheckOut(clockOutTime !== null);
      setTimeOut(
        formattedClockOutTime ? `Check-Out -> ${formattedClockOutTime}` : '',
      );
      setDateCheckOut(formattedDateCheckOut || '');
      setIsCheckOut(Boolean(formattedClockOutTime));
      setTimeIn(`Check-In    -> ${clockInTime}`);
      setDateCheckIn(selectedData.attendances[0].scheduleDate);
      setStatus(`Check-In (${selectedData.attendances[0].attendanceType})`);

      if (selectedData.attendances[0].location === null) {
        setLocation(
          'RSUD DR SAM RATULANGI TONDANO, Kembuan, Tondano Utara, Minahasa, Sulawesi Utara',
        );
      } else {
        setLocation(selectedData.attendances[0].location);
      }
    } else {
      setTimeIn('');
      setTimeOut('');
      setDateCheckIn('-');
      setStatus(`Tidak ada riwayat pekerjaan pada ${day.dateString}`);
      setIsEnableDesc(false);
      setLocation('-');
    }
  };

  useEffect(() => {
    const markedDates = data.reduce((result, schedule) => {
      schedule.attendances.forEach(attendance => {
        const {scheduleDate, attendanceState} = attendance;
        if (scheduleDate) {
          result[scheduleDate] = {
            selected: true,
            selectedColor: getColorForAttendanceState(attendanceState),
          };
        }
      });
      return result;
    }, {});

    setGetMarkedDates(markedDates);
  }, [data]);

  const getColorForAttendanceState = attendanceState => {
    switch (attendanceState) {
      case 'ONTIME':
        return '#14F42B';
      case 'ALPHA':
        return '#F41414';
      case 'LATE':
        return '#3DF414';
      default:
        return '#F41414';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size={'large'} />
        </View>
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size={'large'} />
            </View>
          ) : (
            <>
              <Image
                source={require('./../../assets/images/Ilustration4.png')}
                style={{width: screenWidht, height: 50}}
                resizeMode="cover"
              />
              <Calendar
                style={{
                  height: 350,
                }}
                current={currentDate}
                onDayPress={handleDayPress}
                markedDates={getMarkedDates}
              />
              <View>
                <Image
                  source={require('./../../assets/images/Ilustration5.png')}
                  style={{
                    width: screenWidht,
                    height: 110,
                    position: 'absolute',
                  }}
                  resizeMode="cover"
                />
                <Text style={styles.status}>{status}</Text>
                {isEnableDesc ? (
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
                      <Text style={styles.text}>
                        {' '}
                        {timeIn} {dateCheckIn}
                      </Text>
                    </View>
                    {isCheckOut ? (
                      <View style={styles.timeContainer}>
                        <Image
                          source={require('./../../assets/icons/IconTime.png')}
                          style={{width: 33, height: 33, marginRight: 2}}
                        />
                        <Text style={styles.text}>
                          {' '}
                          {timeOut} {dateCheckOut}
                        </Text>
                      </View>
                    ) : (
                      <></>
                    )}
                  </View>
                ) : (
                  <></>
                )}
                {/* Modal component */}
                <ModalApp
                  modalVisible={modalVisible}
                  setModalVisible={setModalVisible}
                  selectedDateData={selectedDateData} // Pass the data as a prop
                />
              </View>
            </>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default History;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flex: 1,
  },
  status: {
    fontSize: 25,
    color: '#292F2F',
    paddingHorizontal: 27,
  },
  desc: {
    marginLeft: 15,
    marginTop: 20,
    marginBottom: 90,
  },
  text: {
    fontSize: 17,
    color: '#666666',
    width: '80%',
    marginLeft: 7,
  },
  locationContainer: {
    flexDirection: 'row',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 3,
    marginTop: 15,
  },
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -20, // Half of the ActivityIndicator size
    marginLeft: -20, // Half of the ActivityIndicator size
    zIndex: 1,
  },
});

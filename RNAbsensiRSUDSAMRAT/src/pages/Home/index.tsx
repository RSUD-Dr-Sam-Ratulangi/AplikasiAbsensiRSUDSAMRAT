import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Ilustration1, UsersImage} from '../../assets/images';
import AttendanceCard from '../../components/AttendanceCard';
import AnnouncementCard from '../../components/AnnouncementCard';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import socketService from '../../config/socket/socket';
import {Notifications} from 'react-native-notifications';

const Home = ({navigation}) => {
  const [name, setName] = useState('');
  const [totalDays, setTotalDays] = useState(0);
  const [checkInTime, setCheckInTime] = useState('');
  const [checkOutTime, setCheckOutTime] = useState('');
  const [getNotification, setGetNotification] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const getNotif = async () => {
    try {
      const response = await axios.get(
        'http://rsudsamrat.site:3001/api/notification',
      );
      setGetNotification(response.data.data);
      const notifications = response.data.data || [];

      notifications.forEach((notification, index) => {
        Notifications.postLocalNotification({
          title: notification.title,
          body: notification.body,
          id: index,
        } as any);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    socketService.initializeSocket();
    getNotif();
  }, []);

  useEffect(() => {
    socketService.on('recieve_message', data => {
      setGetNotification(prevMessage => [...prevMessage, data]);
    });

    return () => {
      socketService.removeListener('recieve_message');
    };
  }, []);

  const getNik = async () => {
    try {
      const nik = await AsyncStorage.getItem('nik');
      const getUserData = () => {
        axios
          .get(`http://rsudsamrat.site:9999/api/v1/dev/employees/nik/${nik}`)
          .then(function (response) {
            setName(response.data.name);
            const getEmployeeId = response.data.employeeId;
            const conEmployeeId = getEmployeeId.toString();
            setEmployeeId(conEmployeeId);

            const date = String(new Date().getDate()).padStart(2, '0');
            const month = String(new Date().getMonth() + 1).padStart(2, '0');
            const year = String(new Date().getFullYear()).padStart(2, '0');
            const getDate = year + '-' + month + '-' + date;
            getScheduleTime(getDate, conEmployeeId);
          })
          .catch(function (error) {
            console.log('error:', error);
          });
      };
      getUserData();
    } catch (error) {
      console.log('Gagal mengambil nik: ', error);
    }
  };

  const getScheduleTime = async (attendanceDate, employeeId) => {
    await axios
      .get(`http://rsudsamrat.site:9999/api/v1/dev/schedule`)
      .then(response => {
        const convertEmployeeId = parseInt(employeeId);
        const startTime = response.data
          .filter(
            schedule =>
              schedule.scheduleDate === attendanceDate &&
              schedule.employees.some(
                employee => employee.employeeId === convertEmployeeId,
              ),
          )
          .map(schedule => schedule.shift.start_time);

        const endTime = response.data
          .filter(
            schedule =>
              schedule.scheduleDate === attendanceDate &&
              schedule.employees.some(
                employee => employee.employeeId === convertEmployeeId,
              ),
          )
          .map(schedule => schedule.shift.end_time);
        setCheckInTime(startTime[0]);
        setCheckOutTime(endTime[0]);
        setIsLoading(false);
      })
      .catch(err => {
        console.log('error when access endpoint:', err);
      });
  };

  const setEmployeeId = async employeeId => {
    try {
      await AsyncStorage.setItem('employeeId', employeeId);
      console.log('berhasil menyimpan employee id :', employeeId);
      getData(employeeId);
    } catch (error) {
      console.log('error:', error);
    }
  };

  const getData = async employeeId => {
    const url = `http://rsudsamrat.site:9999/api/v1/dev/attendances/filter?employeeId=${employeeId}`;
    try {
      const response = await axios.get(url);

      const uniqueScheduleCounts = {};
      response.data.forEach(item => {
        const scheduleDate = item.attendances[0].scheduleDate;
        const scheduleId = item.scheduleId;
        if (!uniqueScheduleCounts[scheduleDate]) {
          uniqueScheduleCounts[scheduleDate] = new Set();
        }
        uniqueScheduleCounts[scheduleDate].add(scheduleId);
      });

      const numberOfUniqueDates = Object.keys(uniqueScheduleCounts).length;
      setTotalDays(numberOfUniqueDates);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    getNik();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    setIsLoading(true);

    try {
      // Use Promise.all to concurrently fetch data
      await Promise.all([getNotif(), getNik(), getNotif()]);
    } catch (error) {
      console.error('Error during data fetching:', error);
    } finally {
      setRefreshing(false);
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.page}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }>
        <Image source={Ilustration1} style={styles.ilustration} />
        <View style={styles.header}>
          <View style={styles.profilePicture}>
            <Image
              source={UsersImage}
              style={{
                width: 65,
                height: 65,
                borderRadius: 50,
                borderWidth: 1,
                borderColor: '#000f',
              }}
            />
          </View>
          <View>
            <Text style={styles.greeting}>Hello,</Text>
            <Text style={styles.name}>{name}</Text>
          </View>
        </View>
        <View style={styles.contentContainer}>
          {isLoading ? (
            <ActivityIndicator
              size={'large'}
              style={{
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            />
          ) : (
            <>
              <Text style={styles.text1}>Total Hari Bekerja :</Text>

              <TouchableOpacity
                style={styles.additionalCard}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('History')}>
                <AttendanceCard
                  icon={require('./../../assets/icons/MiniCalendar.png')}
                  title="Total Hari"
                  time={totalDays}
                  addInfo="Hari Kerja"
                />
              </TouchableOpacity>

              <View style={styles.announcementContainer}>
                <Text style={styles.text1}>Pengumuman :</Text>
                {getNotification.length > 0 ? (
                  getNotification.map((notif, index) => (
                    <AnnouncementCard
                      key={index}
                      title={notif.title}
                      desc={notif.desc}
                      date={notif.date}
                    />
                  ))
                ) : (
                  <Text style={styles.greeting}>
                    TIDAK ADA PENGUMUMAN UNTUK SAAT INI.
                  </Text>
                )}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  ilustration: {
    position: 'absolute',
  },
  header: {
    marginTop: 50,
    borderBottomWidth: 1,
    borderColor: '#D7D8D8',
    width: '100%',
    paddingLeft: 10,
    marginHorizontal: 10,
    flexDirection: 'row',
  },
  profilePicture: {
    width: 86,
    height: 86,
    marginRight: 5,
    marginBottom: 5,
  },
  greeting: {
    fontSize: 25,
    color: '#333333',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#717171',
  },
  contentContainer: {
    marginTop: 26,
    paddingHorizontal: 16,
  },
  text1: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  additionalCard: {
    marginTop: 21,
    width: 100, // or use flex: 1
  },
  announcementContainer: {
    marginTop: 20,
    marginBottom: 90,
  },
});

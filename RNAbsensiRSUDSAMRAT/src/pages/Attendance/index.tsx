import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Alert,
  Platform,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import MapView, {Polygon} from 'react-native-maps';
import {request, check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import * as geolib from 'geolib';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Attendance = ({navigation}: any) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState('belum absen');
  const [viewAColor, setViewAColor] = useState('#ffffff');
  const [viewBColor, setViewBColor] = useState('#ffffff');
  const [viewCColor, setViewCColor] = useState('#ffffff');
  const [attendanceType, setAttendanceType] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [enabledAttendance, setEnabledAttendance] = useState(false);
  const [mapRef, setMapRef] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [currentDate, setCurrentDate] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const polygonCoordinates = [
    {latitude: 1.309076, longitude: 124.915889},
    {latitude: 1.309002, longitude: 124.916579},
    {latitude: 1.309382, longitude: 124.91702},
    {latitude: 1.309939, longitude: 124.91742},
    {latitude: 1.310158, longitude: 124.916386},
    {latitude: 1.309595, longitude: 124.916263},
    {latitude: 1.309586, longitude: 124.916012},
  ];

  const getName = async () => {
    const nik = await AsyncStorage.getItem('nik');
    await axios
      .get(`http://rsudsamrat.site:9999/api/v1/dev/employees/nik/${nik}`)
      .then(result => {
        setName(result.data.name);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const getScheduleTime = async (attendanceDate, employeeId) => {
    try {
      setIsLoading(true);
      const scheduleResponse = await axios.get(
        'http://rsudsamrat.site:9999/api/v1/dev/schedule',
      );
      const convertEmployeeId = parseInt(employeeId, 10);
      const filteredSchedules = scheduleResponse.data.filter(
        schedule =>
          schedule.scheduleDate === attendanceDate &&
          schedule.employees.some(
            employee => employee.employeeId === convertEmployeeId,
          ),
      );

      if (filteredSchedules.length === 0) {
        throw new Error('No schedule found for the given date and employee');
      }

      const startTime = filteredSchedules[0].shift.start_time;
      const endTime = filteredSchedules[0].shift.end_time;

      const attendanceResponse = await axios.get(
        `http://rsudsamrat.site:9999/api/v1/dev/attendances/byDateAndEmployee?attendanceDate=${attendanceDate}&employeeId=${employeeId}`,
      );

      if (
        attendanceResponse.data ===
        "Employee hasn't taken any attendance on the given date."
      ) {
        setTime(startTime.substring(0, 5));
        setStatus('Belum absen');
      } else {
        setStatus('Sudah absen');
        if (
          attendanceResponse.data !== null &&
          attendanceResponse.data[0].clockOut == null
        ) {
          setStatus('Belum Checkout');
        } else {
          setStatus('Sudah Checkout');
        }
        setTime(endTime.substring(0, 5));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const setAttendanceInfo = async () => {
    const daysOfWeek = [
      'Minggu',
      'Senin',
      'Selasa',
      'Rabu',
      'Kamis',
      'Jumat',
      'Sabtu',
    ];
    const months = [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember',
    ];

    const currentDate = new Date();
    const dayOfWeek = daysOfWeek[currentDate.getDay()];
    const date = currentDate.getDate();
    const monthName = months[currentDate.getMonth()];
    const year = currentDate.getFullYear();
    const getdate = String(new Date().getDate()).padStart(2, '0');
    const getmonth = String(new Date().getMonth() + 1).padStart(2, '0');
    const getyear = String(new Date().getFullYear()).padStart(2, '0');

    const formattedDate = `${dayOfWeek}, ${date} ${monthName} ${year}`;
    setDate(formattedDate);

    const attendanceDate = getyear + '-' + getmonth + '-' + getdate;

    setCurrentDate(attendanceDate);
    const employeeId = await AsyncStorage.getItem('employeeId');

    getScheduleTime(attendanceDate, employeeId);
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
        if (granted === 'granted') {
        }
      } catch (error) {
        console.error('Error requesting location permission:', error);
      }
    }
  };

  useEffect(() => {
    getName();
    setAttendanceInfo();
    requestLocationPermission();
  }, []);

  const checkForSchedule = async attendanceDate => {
    try {
      const employeeId = await AsyncStorage.getItem('employeeId');
      const response = await axios.get(
        `http://rsudsamrat.site:9999/api/v1/dev/attendances/byDateAndEmployee?attendanceDate=${attendanceDate}&employeeId=${employeeId}`,
      );

      const hasTakenAttendance =
        response.data ===
        "Employee hasn't taken any attendance on the given date.";
      const hasClockIn = response.data[0]?.clockIn !== null;
      const hasClockOut = response.data[0]?.clockOut !== null;

      if (hasTakenAttendance) {
        if (
          enabledAttendance &&
          attendanceType &&
          time &&
          Platform.OS === 'android'
        ) {
          navigation.navigate('OpenCamera', {attendanceType});
        } else {
          Alert.alert('Tidak ada jadwal untuk hari ini!', '', [
            {text: 'OK', style: 'default'},
          ]);
        }
      } else if (
        hasClockIn &&
        !hasClockOut &&
        enabledAttendance &&
        attendanceType &&
        Platform.OS === 'android'
      ) {
        navigation.navigate('OpenCamera', {attendanceType});
      } else if (hasClockIn && hasClockOut) {
        Alert.alert(
          'Sudah waktunya pulang 🥳',
          'Absen hari ini sudah selesai. Terima kasih.',
          [{text: 'OK', style: 'default'}],
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (
      userLocation &&
      geolib.isPointInPolygon(userLocation, polygonCoordinates)
    ) {
      setEnabledAttendance(true);
    }
  }, [userLocation]);

  const handleViewAClick = () => {
    setViewAColor('#01A7A3');
    setViewBColor('#ffffff');
    setAttendanceType('WFH');
  };

  const handleViewBClick = () => {
    setViewAColor('#ffffff');
    setViewBColor('#01A7A3');
    setAttendanceType('WFO');
  };

  const handleViewCClick = () => {
    if (viewCColor === '#ffffff') {
      setViewCColor('#01A7A3');
    } else if (viewCColor === '#01A7A3') {
      setViewCColor('#ffffff');
    }
  };

  const handleClickCameraButton = async () => {
    if (!enabledAttendance || !attendanceType) {
      Alert.alert(
        'ALERT!',
        'Pastikan anda berada di dalam area yang di tentukan & telah memilih lokasi kerja.',
        [
          {
            text: 'OK',
            style: 'default',
          },
        ],
      );
    } else {
      checkForSchedule(currentDate);
    }
  };

  const handleFocusUserLocation = () => {
    if (userLocation && mapRef && mapReady) {
      mapRef.animateCamera({center: userLocation, zoom: 18});
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);

    try {
      await getName();
      await setAttendanceInfo();
      await requestLocationPermission();
    } catch (error) {
      console.error('Error during refresh:', error);
    }

    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.page}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View
          style={{
            height: 480,
            width: '100%',
            borderColor: '#ECE7E4',
            borderBottomWidth: 2,
          }}>
          <MapView
            ref={ref => setMapRef(ref)}
            style={{flex: 1, height: '100%', width: '100%'}}
            showsUserLocation={true}
            showsMyLocationButton={false}
            onMapReady={() => setMapReady(true)}
            onUserLocationChange={event => {
              const {coordinate} = event.nativeEvent;
              setUserLocation(coordinate);
            }}>
            <Polygon
              coordinates={polygonCoordinates}
              fillColor="rgba(255, 0, 0, 0.2)"
              strokeColor="rgba(255, 0, 0, 0.6)"
              strokeWidth={2}
            />
          </MapView>
          <TouchableOpacity
            onPress={handleFocusUserLocation}
            style={styles.focusButton}>
            <Text style={{color: '#fff', fontSize: 16}}>Zoom</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{width: '100%', alignItems: 'center', position: 'absolute'}}>
          <View style={styles.descContainer}>
            <View style={styles.descContainerBackground}></View>
            <View style={styles.inerContainer}>
              <View>
                <Text style={styles.date}>{date}</Text>
                <Text style={styles.name}>{name}</Text>
              </View>
              <View style={styles.statusContainer}>
                <Text style={styles.status1}>Status:</Text>
                {isLoading ? (
                  <View>
                    <ActivityIndicator size={'small'} />
                  </View>
                ) : (
                  <Text
                    style={[
                      styles.status1,
                      {color: '#D20C0C', textTransform: 'uppercase'},
                    ]}>
                    {status}
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>
        {isLoading ? (
          <View>
            <ActivityIndicator size={'large'} />
          </View>
        ) : (
          <View style={styles.contentContainer}>
            <View
              style={{
                width: 140,
                height: 3,
                backgroundColor: '#04837B',
                marginTop: 16,
                borderRadius: 10,
              }}></View>
            <View style={styles.locationContainer}>
              <Image
                source={require('./../../assets/icons/IconLocation.png')}
                style={{
                  width: 43,
                  height: 44,
                  tintColor: '#FD0202',
                  marginRight: 12,
                }}
              />
              <View>
                <Text style={styles.locationName}>
                  RSUD DR SAM RATULANGI TONDANO
                </Text>
                <Text style={styles.locationDesc}>
                  Kembuan, Tondano Utara, Minahasa, Sulawesi Utara
                </Text>
              </View>
            </View>
            <View style={styles.specialButtonContainer}>
              <TouchableOpacity
                disabled
                style={[styles.specialButton, {backgroundColor: viewAColor}]}
                activeOpacity={0.8}
                onPress={handleViewAClick}>
                <Text style={styles.specialButtonText}>WFH</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.specialButton, {backgroundColor: viewBColor}]}
                onPress={handleViewBClick}>
                <Text style={styles.specialButtonText}>WFO</Text>
              </TouchableOpacity>
            </View>
            {/* <TouchableOpacity
            style={[
              styles.attendanceButton,
              {
                backgroundColor: viewCColor,
                marginTop: 30,
                marginBottom: 20,
                height: 52,
              },
              isButtonDisabled && {opacity: 0.5},
            ]}
            onPress={isButtonDisabled ? null : handleViewCClick}
            disabled={isButtonDisabled}>
            <Text style={styles.specialButtonText}>Absen Khusus</Text>
          </TouchableOpacity> */}
            <TouchableOpacity
              style={[
                styles.specialButton,
                {
                  backgroundColor: '#01A7A3',
                  width: '80%',
                  marginTop: 15,
                  marginBottom: 90,
                  height: 52,
                  flexDirection: 'row',
                },
              ]}
              onPress={handleClickCameraButton}>
              <Image
                source={require('./../../assets/icons/IconCamera.png')}
                style={{width: 24, height: 24, marginRight: 5}}
              />
              <Text style={{fontSize: 16, color: '#fff', fontWeight: '500'}}>
                Ambil Absen
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Attendance;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  descContainerBackground: {
    backgroundColor: '#01A7A3',
    width: 324,
    height: 45,
    borderRadius: 20,
    position: 'absolute',
    opacity: 0.7,
  },
  descContainer: {
    width: 324,
    height: 60,
    paddingLeft: 15,
    paddingTop: 5,
    marginTop: 70,
    position: 'absolute',
  },
  inerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  date: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
  },
  name: {
    fontSize: 8,
    fontWeight: '600',
    color: '#ffffff',
    paddingLeft: 9,
    opacity: 0.7,
    textTransform: 'uppercase',
  },
  statusContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 15,
  },
  status1: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    width: 'auto',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginBottom: 40,
    marginTop: 34,
    paddingTop: 10,
    paddingLeft: 7,
    paddingRight: 10,
    paddingBottom: 7,
    borderRadius: 20,
    shadowColor: '#000000',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  locationName: {
    fontSize: 15,
    color: '#333333',
  },
  locationDesc: {
    fontSize: 12,
    color: '#9E9E9E',
  },
  specialButton: {
    width: 150,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    shadowColor: '#000000',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  attendanceButton: {
    width: '80%',
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    shadowColor: '#000000',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  specialButtonText: {
    fontSize: 15,
    color: '#333333',
  },
  specialButtonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
  },
  camera: {
    width: 'auto',
    height: 30,
  },
  focusButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#333333',
    padding: 10,
    opacity: 0.8,
    borderRadius: 20,
  },
});

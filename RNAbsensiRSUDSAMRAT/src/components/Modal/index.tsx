import React, {useRef, useEffect, useState} from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  Animated,
  Image,
  TouchableHighlight,
} from 'react-native';

interface ModalAppProps {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  selectedDateData: any; // Adjust the type accordingly
}

const ModalApp: React.FC<ModalAppProps> = ({
  modalVisible,
  setModalVisible,
  selectedDateData,
}) => {
  const [checkInPressed, setCheckInPressed] = useState(false);
  const [checkOutPressed, setCheckOutPressed] = useState(false);

  const handleCheckInPress = () => {
    // Handle Check In click
    console.log('Check In Clicked');
    setCheckInPressed(true);
    setCheckOutPressed(false);
  };

  const handleCheckOutPress = () => {
    // Handle Check Out click
    console.log('Check Out Clicked');
    setCheckInPressed(false);
    setCheckOutPressed(true);
  };

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const clockInTime = (selectedDateData?.attendances[0]?.clockIn || '').replace(
    'T',
    '  ',
  );
  const clockOutTime = selectedDateData?.attendances[0]?.clockOut
    ? selectedDateData.attendances[0].clockOut.replace('T', ' ')
    : 'Belum Absen Pulang';
  const selfieCheckIn = selectedDateData?.attendances[0]?.selfieCheckIn;
  const selfieCheckOut = selectedDateData?.attendances[0]?.selfieCheckOut;
  const imageSourceCheckIn = {uri: `data:image/jpeg;base64,${selfieCheckIn}`};
  const imageSourceCheckOut = {uri: `data:image/jpeg;base64,${selfieCheckOut}`};

  useEffect(() => {
    if (modalVisible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [fadeAnim, modalVisible]);

  const closeModal = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <Animated.View style={[styles.centeredView, {opacity: fadeAnim}]}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <Pressable style={styles.overlay} onPress={closeModal}>
          <Animated.View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <View style={styles.checkInOrOut}>
                <TouchableHighlight
                  onPress={handleCheckInPress}
                  underlayColor="transparent"
                  style={[
                    styles.checkInButton,
                    checkInPressed ? styles.pressedButton : null,
                  ]}>
                  <Text style={{color: 'black'}}>Check In</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  onPress={handleCheckOutPress}
                  underlayColor="transparent"
                  style={[
                    styles.checkOutButton,
                    checkOutPressed ? styles.pressedButton : null,
                  ]}>
                  <Text style={{color: 'black'}}>Check Out</Text>
                </TouchableHighlight>
              </View>
              <View>
                {checkInPressed && clockInTime && (
                  <Text style={styles.modalText}>{clockInTime}</Text>
                )}
                {checkOutPressed && clockOutTime && (
                  <Text style={styles.modalText}>{clockOutTime}</Text>
                )}
              </View>
              {checkInPressed && imageSourceCheckIn && (
                <Image style={styles.modalImage} source={imageSourceCheckIn} />
              )}

              {checkOutPressed && imageSourceCheckOut && (
                <Image style={styles.modalImage} source={imageSourceCheckOut} />
              )}
            </View>
          </Animated.View>
        </Pressable>
      </Modal>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 1, // Initial opacity
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalImage: {
    width: 300,
    height: 350,
    marginBottom: 10,
    borderRadius: 13,
    resizeMode: 'stretch',
  },
  checkInOrOut: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginTop: 15,
    marginBottom: 15,
    textAlign: 'center',
    color: 'black',
    fontWeight: 'bold',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  gap: {
    marginRight: 10, // Adjust the value to set the desired gap
  },
  checkInButton: {
    marginRight: 10,
    padding: 10,
    borderColor: 'green',
    borderWidth: 1,
    borderRadius: 5,
  },
  checkOutButton: {
    padding: 10,
    borderColor: 'red',
    borderWidth: 1,
    borderRadius: 5,
  },
  pressedButton: {
    backgroundColor: 'rgba(0, 128, 0, 0.1)', // Change this color as needed
  },
});

export default ModalApp;

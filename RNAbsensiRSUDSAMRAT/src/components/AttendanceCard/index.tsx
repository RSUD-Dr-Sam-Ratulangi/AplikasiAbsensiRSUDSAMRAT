import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';

const AttendanceCard = ({icon, title, time, addInfo}: any) => {
  return (
    <View style={styles.container}>
      <View style={styles.secContainer}>
        <View style={styles.icon}>
          <Image
            source={icon}
            style={{height: 20, width: 20, tintColor: '#01A7A3'}}
          />
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={styles.time}>{time}</Text>
      <Text style={styles.addInfo}>{addInfo}</Text>
    </View>
  );
};

export default AttendanceCard;

const styles = StyleSheet.create({
  container: {
    height: 130,
    width: 350,
    backgroundColor: '#CCEDED',
    borderRadius: 10,
    paddingTop: 9,
    paddingLeft: 10,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  icon: {
    width: 39,
    height: 37,
    borderRadius: 10,
    backgroundColor: '#A3DFDE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 7,
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  secContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 13,
    color: '#393D3C',
  },
  time: {
    fontSize: 20,
    color: '#292F2F',
    marginTop: 16,
    marginLeft: 7,
  },
  addInfo: {
    fontSize: 13,
    color: '#393D3C',
    marginTop: 7,
    marginLeft: 6,
  },
});

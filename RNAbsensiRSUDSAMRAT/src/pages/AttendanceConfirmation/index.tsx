import { Image, StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native'
import React, { useState } from 'react'
import SwipeButton from 'rn-swipe-button'

const AttendanceConfirmation = ({imageData, navigation}: any) => {

    const reOpenCamera = () => {
        navigation?.replace('OpenCamera');
    }
    
    const afterSwipe = () => {
        navigation?.replace('AttendanceDone');
    }
return (
    <SafeAreaView style={styles.page}>
        <Text style={styles.title}>Konfirmasi Foto</Text>
        <View style={styles.photoContainer}>
            <Image 
                source={{uri: 'file://' + imageData}}
                // source={require('./../../assets/images/ProfilePicture.png')}
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
                title='Swipe to Check-in'
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
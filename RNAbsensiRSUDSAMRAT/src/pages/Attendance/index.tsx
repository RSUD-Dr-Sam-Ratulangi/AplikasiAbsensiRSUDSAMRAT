import { StyleSheet, Text, View, ScrollView, SafeAreaView, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'

const Attendance = ({navigation}: any) => {
    const [date, setDate] = useState('Selasa, 1 Agustus 2023');
    const [time, setTime] = useState('08.00');
    const [name, setName] = useState('Nariva Charline Wagey, S.Kom, ACP');
    const [status, setStatus] = useState('belum absen');
    const [viewAColor, setViewAColor] = useState('#ffffff');
    const [viewBColor, setViewBColor] = useState('#ffffff');
    const [viewCColor, setViewCColor] = useState('#ffffff');

    const handleViewAClick = () => {
        setViewAColor('#01A7A3');
        setViewBColor('#ffffff');
    };
    
    const handleViewBClick = () => {
        setViewAColor('#ffffff');
        setViewBColor('#01A7A3');
    };

    const handleViewCClick = () => {
        if(viewCColor === '#ffffff'){
            setViewCColor('#01A7A3');
        } else if(viewCColor === '#01A7A3'){
            setViewCColor('#ffffff');
        }
    };

    const handleClickCameraButton = () => {
        navigation.push('OpenCamera')
    };

    return (
        <SafeAreaView style={styles.page}>
            <ScrollView>
                <View style={{width: '100%', alignItems: 'center'}}>
                    <View style={styles.descContainer}>
                        <View style={styles.descContainerBackground}></View>
                        <View style={styles.inerContainer}>
                            <View>
                                <Text style={styles.date}>{date}</Text>
                                <Text style={styles.time}>{time}</Text>
                                <Text style={styles.name}>{name}</Text>
                            </View>
                            <View style={styles.statusContainer}>
                                <Text style={styles.status1}>Status:</Text>
                                <Text style={[styles.status1, {color: '#D20C0C', textTransform: 'uppercase'}]}>{status}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{height: 480, width: '100%', borderColor: '#ECE7E4', borderBottomWidth: 50, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 70}}>MAPS MAPS</Text>
                </View>
                <View style={styles.contentContainer}>
                    <View style={{width: 140, height: 3, backgroundColor: '#04837B', marginTop: 16, borderRadius: 10}}></View>
                    <View style={styles.locationContainer}>
                        <Image 
                            source={(require('./../../assets/icons/IconLocation.png'))}
                            style={{width: 43, height: 44, tintColor: '#FD0202', marginRight: 12}}
                        />
                        <View>
                            <Text style={styles.locationName}>RSUD DR SAM RATULANGI TONDANO</Text>
                            <Text style={styles.locationDesc}>Kembuan, Tondano Utara, Minahasa, Sulawesi Utara</Text>
                        </View>
                    </View>
                    <View style={styles.specialButtonContainer}>
                        <TouchableOpacity style={[styles.specialButton, { backgroundColor: viewAColor }]} activeOpacity={0.8} onPress={handleViewAClick}>
                            <Text style={styles.specialButtonText}>WFH</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.specialButton, { backgroundColor: viewBColor }]} onPress={handleViewBClick}>
                            <Text style={styles.specialButtonText}>WFO</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={[styles.attendanceButton, { backgroundColor: viewCColor, marginTop: 30, marginBottom: 20}]} onPress={handleViewCClick}>
                        <Text style={styles.specialButtonText}>Absen Khusus</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.specialButton, { backgroundColor: '#01A7A3', width: '80%',marginTop: 15, marginBottom: 180, height: 100}]} onPress={handleClickCameraButton}>
                        <Image 
                            source={require('./../../assets/icons/IconCamera.png')}
                            style={{width: 40, height: 40}}
                        />
                        <Text>*Tombol sementara</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Attendance

const styles = StyleSheet.create({
    page:{
        flex: 1,
        backgroundColor: '#ffffff'
    },
    descContainerBackground:{
        backgroundColor: '#01A7A3', 
        width: 324, 
        height: 60,
        borderRadius: 20,
        position: 'absolute',
        opacity: 0.7
    },
    descContainer:{
        width: 324,
        height: 60,
        paddingLeft: 15,
        paddingTop: 5,
        marginTop: 70,
        position: 'absolute'
    },
    inerContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    date:{
        fontSize: 15,
        fontWeight: '600',
        color: '#ffffff'
    },
    time:{
        fontSize: 10,
        fontWeight: '600',
        color: '#ffffff'
    },
    name:{
        fontSize: 8,
        fontWeight: '600',
        color: '#ffffff',
        paddingLeft: 9,
        opacity: 0.7,
        textTransform: 'uppercase'
    },
    statusContainer:{
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingRight: 15,
    },
    status1:{
        fontSize: 12,
        fontWeight: '600',
        color: '#ffffff'
    },
    contentContainer:{
        flex: 1,
        width: '100%',
        alignItems: 'center'
    },
    locationContainer:{
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
        shadowOffset: {width:2, height:2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    locationName:{
        fontSize: 15,
        color: '#333333'
    },
    locationDesc:{
        fontSize: 12,
        color: '#9E9E9E'
    },
    specialButton:{
        width: 150,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        shadowColor: '#000000',
        shadowOffset: {width:2, height:2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5
    },
    attendanceButton:{
        width: '80%',
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        shadowColor: '#000000',
        shadowOffset: {width:2, height:2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5
    },
    specialButtonText:{
        fontSize: 15,
        color: '#333333'
    },
    specialButtonContainer:{
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        paddingHorizontal: 40
    },
    camera:{
        width: 'auto',
        height: 30
    }
})
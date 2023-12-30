import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  LayoutAnimation,
  BackHandler,
  Alert,
  Platform,
} from 'react-native';
import database from '@react-native-firebase/database';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const AppointmentHistory = () => {
  const [appointments, setAppointments] = useState([]);
  const [expandedAppointment, setExpandedAppointment] = useState(null);
  const [hasUserChoseToExit, setHasUserChoseToExit] = useState(false);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress,
    );

    return () => {
      backHandler.remove();
    };
  }, []);

  const handleBackPress = () => {
    if (hasUserChoseToExit) {
      return false; // Allow default back button behavior
    }

    Alert.alert(
      'Quit',
      'Are you sure you want to quit?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            setHasUserChoseToExit(true);
            if (Platform.OS === 'android') {
              BackHandler.exitApp();
            } else {
              navigation.navigate('Home'); // Replace 'Home' with your home screen name
            }
          },
        },
      ],
      {cancelable: false},
    );

    return true; // Prevent default back button behavior
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      const databaseRef = database().ref('Appointments');

      databaseRef.on('value', snapshot => {
        const data = snapshot.val();
        if (data) {
          const appointmentsArray = Object.entries(data).map(
            ([key, value]) => ({
              id: key,
              ...value,
            }),
          );
          appointmentsArray.sort((a, b) => a.timestamp - b.timestamp);

          // Reverse the array before setting it in the state
          setAppointments(appointmentsArray.reverse());
        } else {
          setAppointments([]);
        }
      });
    };

    fetchAppointments();
  }, []);

  const toggleExpand = appointmentId => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (expandedAppointment === appointmentId) {
      setExpandedAppointment(null);
    } else {
      setExpandedAppointment(appointmentId);
    }
  };

  const isAppointmentExpanded = appointmentId => {
    return expandedAppointment === appointmentId;
  };

  const handleDelete = appointmentId => {
    if (appointments) {
      database()
        .ref('Appointments') // Corrected path
        .child(appointmentId)
        .remove()
        .then(() => {
          setAppointments(prevAppointment =>
            prevAppointment.filter(a => a.id !== appointmentId),
          );
        })
        .catch(error => {
          console.error('Error Deleting Appointment: ', error);
        });
    }
  };

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => toggleExpand(item.id)}
        style={styles.card}>
        <View className="flex-1 p-2">
          <View className="flex-row justify-between mt-3">
            <Text
              className="text-[18px]  text-black mb-3"
              style={{fontFamily: 'Montserrat-Medium'}}>
              Appointment
            </Text>
            <Text
              className="text-[18px]  text-black mb-3"
              style={{fontFamily: 'Montserrat-Medium'}}>
              {item.availability}
            </Text>
          </View>

          {isAppointmentExpanded(item.id) && (
            <>
              <View>
                <View className="flex-row justify-between ">
                  <Text
                    className="text-[18px]  text-black mb-3"
                    style={{fontFamily: 'Montserrat-Medium'}}>
                    Name
                  </Text>
                  <Text
                    className="text-[18px]  text-black mb-3"
                    style={{fontFamily: 'Montserrat-Medium'}}>
                    {item.name}
                  </Text>
                </View>
                <View className="flex-row justify-between ">
                  <Text
                    className="text-[18px]  text-black mb-3"
                    style={{fontFamily: 'Montserrat-Medium'}}>
                    Phone
                  </Text>
                  <Text
                    className="text-[18px]  text-black mb-3"
                    style={{fontFamily: 'Montserrat-Medium'}}>
                    {item.phone}
                  </Text>
                </View>
                <View className="flex-row justify-between ">
                  <Text
                    className="text-[18px]  text-black mb-3"
                    style={{fontFamily: 'Montserrat-Medium'}}>
                    Email
                  </Text>
                  <Text
                    className="text-[18px]  text-black mb-3"
                    style={{fontFamily: 'Montserrat-Medium'}}>
                    {item.email}
                  </Text>
                </View>
                <View className="flex-row justify-between ">
                  <Text
                    className="text-[18px]  text-black mb-3"
                    style={{fontFamily: 'Montserrat-Medium'}}>
                    Treatment
                  </Text>
                  <Text
                    className="text-[18px]  text-black mb-3"
                    style={{fontFamily: 'Montserrat-Medium'}}>
                    {item.treatment}
                  </Text>
                </View>
                <View className="flex-row justify-between ">
                  <Text
                    className="text-[18px]  text-black mb-3"
                    style={{fontFamily: 'Montserrat-Medium'}}>
                    Availability Day
                  </Text>
                  <Text
                    className="text-[18px]  text-black mb-3"
                    style={{fontFamily: 'Montserrat-Medium'}}>
                    {item.day}
                  </Text>
                </View>
                <View className="flex-row justify-between ">
                  <Text
                    className="text-[18px]  text-black mb-3"
                    style={{fontFamily: 'Montserrat-Medium'}}>
                    Starting Time
                  </Text>
                  <Text
                    className="text-[18px]  text-black mb-3"
                    style={{fontFamily: 'Montserrat-Medium'}}>
                    {item.startTime}
                  </Text>
                </View>
                <View className="flex-row justify-between ">
                  <Text
                    className="text-[18px]  text-black mb-3"
                    style={{fontFamily: 'Montserrat-Medium'}}>
                    Finishing Time
                  </Text>
                  <Text
                    className="text-[18px]  text-black mb-3"
                    style={{fontFamily: 'Montserrat-Medium'}}>
                    {item.finishTime}
                  </Text>
                </View>
              </View>
            </>
          )}
        </View>
        <TouchableOpacity
          onPress={() => handleDelete(item.id)}
          style={styles.deleteIcon}>
          <MaterialCommunityIcons name="delete" size={25} color="red" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1">
      {appointments.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text
            className="text-[20px] text-black"
            style={{fontFamily: 'Montserrat-Bold'}}>
            No Appointments Yet!
          </Text>
        </View>
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={item => item.id}
          renderItem={renderItem}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    overflow: 'hidden',
  },
  deleteIcon: {
    padding: 10,
  },
});

export default AppointmentHistory;

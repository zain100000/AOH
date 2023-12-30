import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  LayoutAnimation,
  RefreshControl,
  BackHandler,
  Alert,
  Platform,
} from 'react-native';
import {SearchBar} from 'react-native-elements';
import database from '@react-native-firebase/database';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import '../../../../FirebaseConfig';

const CurrentAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [expandedAppointment, setExpandedAppointment] = useState(null);
  const [search, setSearch] = useState('');
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
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
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    const databaseRef = database().ref('Appointments');
    const currentDate = new Date().toISOString().split('T')[0];

    databaseRef.on('value', snapshot => {
      const data = snapshot.val();
      if (data) {
        const appointmentsArray = Object.entries(data)
          .map(([key, value]) => ({
            id: key,
            ...value,
          }))
          .filter(appointment => {
            if (appointment.availability === currentDate) {
              return true; // Current appointments
            } else if (
              new Date(appointment.availability) < new Date(currentDate)
            ) {
              // Move to past appointments
              setPastAppointments(prevPastAppointments => [
                ...prevPastAppointments,
                appointment,
              ]);
              return false;
            }
            return false;
          });

        setAppointments(appointmentsArray.reverse());
        setFilteredAppointments(appointmentsArray); // Update filtered appointments as well
        setRefreshing(false); // Stop refreshing
      } else {
        setAppointments([]);
        setFilteredAppointments([]); // Update filtered appointments as well
        setRefreshing(false); // Stop refreshing
      }
    });
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAppointments();
  };

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
        .ref('Appointments')
        .child(appointmentId)
        .remove()
        .then(() => {
          setAppointments(prevAppointment =>
            prevAppointment.filter(a => a.id !== appointmentId),
          );

          // Remove from past appointments as well
          setPastAppointments(prevPastAppointments =>
            prevPastAppointments.filter(a => a.id !== appointmentId),
          );
        })
        .catch(error => {
          console.error('Error Deleting Appointment: ', error);
        });
    }
  };

  const handleSearch = text => {
    setSearch(text);
    const filtered = appointments.filter(
      appointment =>
        appointment.name.toLowerCase().includes(text.toLowerCase()) ||
        appointment.phone.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredAppointments(filtered);
  };

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => toggleExpand(item.id)}
        style={styles.card}>
        <View style={{flex: 1, padding: 16}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 8,
            }}>
            <Text
              style={{
                fontSize: 18,
                color: 'black',
                fontFamily: 'Montserrat-Medium',
              }}>
              Appointment
            </Text>
            <Text
              style={{
                fontSize: 18,
                color: 'black',
                fontFamily: 'Montserrat-Medium',
              }}>
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
    <SafeAreaView style={{flex: 1}}>
      <SearchBar
        placeholder="Search by Name or Phone"
        onChangeText={handleSearch}
        value={search}
      />
      {filteredAppointments.length === 0 ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text
            style={{
              fontSize: 20,
              color: 'black',
              fontFamily: 'Montserrat-Bold',
            }}>
            No Current Appointments Yet!
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredAppointments}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
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

export default CurrentAppointments;

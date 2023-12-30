import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  BackHandler,
  Alert,
  Platform,
} from 'react-native';
import '../../../../FirebaseConfig';
import firebase from 'firebase/compat/app';
import '@react-native-firebase/database';
import {Picker} from '@react-native-picker/picker';
import {Calendar} from 'react-native-calendars';
import moment from 'moment';

const AppointmentForm = () => {
  const [hasUserChoseToExit, setHasUserChoseToExit] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [treatment, setTreatment] = useState('');
  const [availability, setAvailability] = useState(
    moment().format('YYYY-MM-DD'),
  );
  const [day, setDay] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [startTime, setStartTime] = useState('');
  const [finishTime, setFinishTime] = useState('');
  const [loading, setLoading] = useState(false);

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

  const handleDatePress = () => {
    setShowCalendar(true);
  };

  const handleDateChange = date => {
    setShowCalendar(false);
    if (date) {
      const formattedDate = moment(date).format('YYYY-MM-DD');
      setAvailability(formattedDate);
    }
  };

  const handleBooking = () => {
    // Validation checks
    if (!name) {
      alert('Name is mandatory');
      nameRef.current.focus();
      return;
    }

    if (!phone) {
      alert('Phone is mandatory');
      phoneRef.current.focus();
      return;
    }

    if (!ValidInput()) {
      alert('Please fill all the fields correctly');
      return;
    }

    setLoading(true);

    // Create a new appointment object
    const appointmentData = {
      name,
      email,
      phone,
      treatment,
      availability,
      day,
      startTime,
      finishTime,
    };

    // Assuming your Firebase Realtime Database is already initialized
    const appointmentsRef = firebase.database().ref('Appointments');

    // Use push method to generate a unique key (appointmentId)
    const newAppointmentRef = appointmentsRef.push();

    // Get the generated appointmentId
    const appointmentId = newAppointmentRef.key;

    // Set the appointment data along with appointmentId
    newAppointmentRef.set({
      appointmentId,
      ...appointmentData,
    });

    setTimeout(() => {
      setLoading(false);

      // Reset state values
      setName('');
      setEmail('');
      setPhone('');
      setTreatment('');
      setAvailability(moment().format('YYYY-MM-DD'));
      setDay('');
      setStartTime('');
      setFinishTime('');

      alert('Thank You! Your Appointment has been booked');
    }, 2000);
  };

  // Validations
  // Declare and initialize refs
  const nameRef = useRef();
  const phoneRef = useRef();

  const ValidInput = () => {
    const namePattern = /^[a-zA-Z\s]*$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^(\+92|92|0)(3\d{2}|\d{2})(\d{7})$/;

    return (
      namePattern.test(name) &&
      emailPattern.test(email) &&
      phonePattern.test(phone)
    );
  };

  const validateName = () => {
    const regex = /^[a-zA-Z\s]*$/;
    if (!name.match(regex)) {
      return 'Special Characters Not Allowed';
    }
    return '';
  };
  const nameError = validateName();

  const handlePhoneChange = value => {
    setPhone(value);
  };
  const validatephone = () => {
    if (!phone) {
      return '';
    }
    const phoneRegex = /^(\+92|92|0)(3\d{2}|\d{2})(\d{7})$/;
    if (!phoneRegex.test(phone)) {
      return 'Invalid phone Format';
    }
    return '';
  };
  const phoneError = validatephone();

  return (
    <SafeAreaView className="flex-1 mt-10">
      <ScrollView>
        <View>
          <Text
            className="text-[20px] text-primary text-center"
            style={{fontFamily: 'Montserrat-Medium'}}>
            Book Your Appointment
          </Text>

          {/* Name, phone, email */}

          <View className="flex-1 mt-10 px-5 item-center">
            {/* Name */}
            <View>
              <Text
                className="text-[18px] text-primary left-1 mb-2"
                style={{fontFamily: 'Montserrat-Bold'}}>
                Name
                <Text style={{color: 'red'}}> *</Text>
              </Text>
              <View className="flex-row mb-8 border-2 border-gray-400 rounded-lg">
                <TextInput
                  className="text-base px-5 w-full text-secondary"
                  placeholder="Enter Name"
                  placeholderTextColor={'#000'}
                  value={name}
                  onChangeText={setName}
                  ref={nameRef}
                  style={{fontFamily: 'Montserrat-Medium'}}
                />
              </View>
              {nameError ? (
                <Text
                  className="text-red-600 text-[14px] bottom-5 left-2"
                  style={{fontFamily: 'Montserrat-Medium'}}>
                  {nameError}
                </Text>
              ) : null}
            </View>

            {/* Phone */}

            <View>
              <Text
                className="text-[18px] text-primary left-1 mb-2"
                style={{fontFamily: 'Montserrat-Bold'}}>
                Phone
                <Text style={{color: 'red'}}> *</Text>
              </Text>
              <View className="flex-row mb-5 border-2 border-gray-400 rounded-lg">
                <TextInput
                  className="text-base px-5 w-full text-secondary"
                  placeholder="Enter Phone"
                  placeholderTextColor={'#000'}
                  keyboardType="number-pad"
                  value={phone}
                  onChangeText={handlePhoneChange}
                  ref={phoneRef}
                  style={{fontFamily: 'Montserrat-Medium'}}
                />
              </View>
              {phoneError ? (
                <Text
                  className="text-red-600 text-[14px] bottom-3 left-2"
                  style={{fontFamily: 'Montserrat-Medium'}}>
                  {phoneError}
                </Text>
              ) : null}
            </View>

            {/* Email */}

            <View>
              <Text
                className="text-[18px] text-primary left-1 mb-2"
                style={{fontFamily: 'Montserrat-Bold'}}>
                Email
              </Text>
              <View className="flex-row mb-5 border-2 border-gray-400 rounded-lg">
                <TextInput
                  className="text-base px-5 w-full text-secondary"
                  placeholder="Enter Email"
                  placeholderTextColor={'#000'}
                  value={email}
                  onChangeText={setEmail}
                  style={{fontFamily: 'Montserrat-Medium'}}
                />
              </View>
            </View>
          </View>

          {/* Treatment */}

          <View>
            <Text
              className="text-[18px] text-primary left-6"
              style={{fontFamily: 'Montserrat-Bold'}}>
              Treatment
            </Text>
            <View
              className="mb-5 m-5 border-2 border-gray-400 rounded-lg
            ">
              <Picker
                selectedValue={treatment}
                onValueChange={setTreatment}
                style={{color: '#000'}}>
                <Picker.Item
                  label="Select Service"
                  value=""
                  style={{color: '#fff', fontFamily: 'Montserrat-Medium'}}
                />
                <Picker.Item
                  label="For Aesthetic Appointment"
                  value="Aesthetic"
                  style={{color: '#fff', fontFamily: 'Montserrat-Medium'}}
                />
              </Picker>
            </View>
          </View>

          {/* Availability Date */}

          <View>
            <Text
              className="text-[18px] text-primary left-6"
              style={{fontFamily: 'Montserrat-Bold'}}>
              I'm available on or after
            </Text>
            <View
              className="mb-5 m-5 p-4 border-2 border-gray-400 rounded-lg
            ">
              <TouchableOpacity onPress={handleDatePress}>
                <Text
                  className="text-secondary"
                  style={{fontFamily: 'Montserrat-Medium'}}>
                  {availability}
                </Text>
              </TouchableOpacity>
              {showCalendar && (
                <Calendar
                  onDayPress={day => {
                    handleDateChange(day.dateString);
                  }}
                />
              )}
            </View>
          </View>

          {/* Availability Day */}

          <View>
            <Text
              className="text-[18px] text-primary left-6"
              style={{fontFamily: 'Montserrat-Bold'}}>
              I'm available on or after Day
            </Text>
            <View
              className="mb-5 m-5 border-2 border-gray-400 rounded-lg
            ">
              <Picker
                selectedValue={day}
                onValueChange={setDay}
                style={{color: '#000'}}>
                <Picker.Item
                  label="Select Day"
                  value=""
                  style={{color: '#fff'}}
                />
                <Picker.Item
                  label="Monday"
                  value="Monday"
                  style={{color: '#fff'}}
                />
                <Picker.Item
                  label="Tuesday"
                  value="Tuesday"
                  style={{color: '#fff'}}
                />
                <Picker.Item
                  label="Wednesday"
                  value="Wednesday"
                  style={{color: '#fff'}}
                />
                <Picker.Item
                  label="Thursday"
                  value="Thursday"
                  style={{color: '#fff'}}
                />
                <Picker.Item
                  label="Friday"
                  value="Friday"
                  style={{color: '#fff'}}
                />
              </Picker>
            </View>
          </View>

          {/* Start Time */}

          <View>
            <Text
              className="text-[18px] text-primary left-6"
              style={{fontFamily: 'Montserrat-Bold'}}>
              Start Time
            </Text>
            <View
              className="mb-5 m-5 border-2 border-gray-400 rounded-lg
            ">
              <Picker
                selectedValue={startTime}
                onValueChange={setStartTime}
                style={{color: '#000'}}>
                <Picker.Item
                  label="Select Start Time"
                  value=""
                  style={{color: '#fff'}}
                />
                <Picker.Item
                  label="8:00 am"
                  value="8:00am"
                  style={{color: '#fff'}}
                />
                <Picker.Item
                  label="9:00 am"
                  value="9:00am"
                  style={{color: '#fff'}}
                />
                <Picker.Item
                  label="10:00 am"
                  value="10:00am"
                  style={{color: '#fff'}}
                />
                <Picker.Item
                  label="11:00 am"
                  value="11:00am"
                  style={{color: '#fff'}}
                />
                <Picker.Item
                  label="12:00 pm"
                  value="12:00pm"
                  style={{color: '#fff'}}
                />
                <Picker.Item
                  label="1:00 pm"
                  value="1:00pm"
                  style={{color: '#fff'}}
                />
                <Picker.Item
                  label="2:00 pm"
                  value="2:00pm"
                  style={{color: '#fff'}}
                />
                <Picker.Item
                  label="3:00 pm"
                  value="3:00pm"
                  style={{color: '#fff'}}
                />
                <Picker.Item
                  label="4:00 pm"
                  value="4:00pm"
                  style={{color: '#fff'}}
                />
                <Picker.Item
                  label="5:00 pm"
                  value="5:00pm"
                  style={{color: '#fff'}}
                />
                <Picker.Item
                  label="6:00 pm"
                  value="6:00pm"
                  style={{color: '#fff'}}
                />
              </Picker>
            </View>
          </View>

          {/* Finish Time */}

          <View>
            <Text
              className="text-[18px] text-primary left-6"
              style={{fontFamily: 'Montserrat-Bold'}}>
              Finish Time
            </Text>
            <View
              className="mb-5 m-5 border-2 border-gray-400 rounded-lg
            ">
              <Picker
                selectedValue={finishTime}
                onValueChange={setFinishTime}
                style={{color: '#000'}}>
                <Picker.Item
                  label="Select Finish Time"
                  value=""
                  style={{color: '#fff'}}
                />
                <Picker.Item
                  label="8:00 am"
                  value="8:00am"
                  style={{color: '#fff'}}
                />
                <Picker.Item
                  label="9:00 am"
                  value="9:00am"
                  style={{color: '#fff'}}
                />
                <Picker.Item
                  label="10:00 am"
                  value="10:00am"
                  style={{color: '#fff'}}
                />
                <Picker.Item
                  label="11:00 am"
                  value="11:00am"
                  style={{color: '#fff'}}
                />
                <Picker.Item
                  label="12:00 pm"
                  value="12:00pm"
                  style={{color: '#fff'}}
                />
                <Picker.Item
                  label="1:00 pm"
                  value="1:00pm"
                  style={{color: '#fff'}}
                />
                <Picker.Item
                  label="2:00 pm"
                  value="2:00pm"
                  style={{color: '#fff'}}
                />
                <Picker.Item
                  label="3:00 pm"
                  value="3:00pm"
                  style={{color: '#fff'}}
                />
                <Picker.Item
                  label="4:00 pm"
                  value="4:00pm"
                  style={{color: '#fff'}}
                />
                <Picker.Item
                  label="5:00 pm"
                  value="5:00pm"
                  style={{color: '#fff'}}
                />
                <Picker.Item
                  label="6:00 pm"
                  value="6:00pm"
                  style={{color: '#fff'}}
                />
              </Picker>
            </View>
          </View>

          {/* Button */}

          <TouchableOpacity
            className="flex-1 justify-center left-3 mb-5 mr-6 items-center mt-8 p-4 bg-primary rounded-xl"
            onPress={handleBooking}>
            {loading ? (
              <ActivityIndicator color={'#fff'} />
            ) : (
              <Text
                className="text-white text-xl"
                style={{fontFamily: 'Montserrat-Bold'}}>
                Submit Appointment
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AppointmentForm;

import React, {useState, useRef} from 'react';
import {
  ScrollView,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Animated,
  Easing,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {Picker} from '@react-native-picker/picker';
import '../../../FirebaseConfig';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [hidePassword1, setHidePassword1] = useState(true);
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const formTranslateY = new Animated.Value(200);

  const animateScreen = () => {
    Animated.parallel([
      Animated.timing(formTranslateY, {
        toValue: 0,
        duration: 1500,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start();
  };

  React.useEffect(() => {
    animateScreen();
  }, []);

  const handleRoleChange = value => {
    setRole(value);
  };

  const handleSignup = async () => {
    try {
      if (!email || !password || !confirmPassword || !ValidInput()) {
        if (!email) {
          alert('Email is mandatory');
          emailRef.current.focus();
        } else if (!password) {
          alert('Password is mandatory');
          passwordRef.current.focus();
        } else if (!confirmPassword) {
          alert('Please confirm your password');
          confirmPasswordRef.current.focus();
        } else {
          alert('Please fill all the fields correctly');
        }
        return;
      }

      if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
      }

      setLoading(true);

      const authCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      const user = authCredential.user;

      // Create a reference to the Realtime Database
      const db = database();

      // Reference to the user's data in Realtime Database
      const userRef = db.ref(`users/${user.uid}`);

      // Set user data in Realtime Database
      await userRef.set({
        role,
        email,
        password, 
      });
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
      navigation.navigate('Login');
    }
  };

  // Validations

  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  const ValidInput = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,}$/;
    const confirmPasswordPattern =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,}$/;

    return (
      emailPattern.test(email) &&
      passwordPattern.test(password) &&
      confirmPasswordPattern.test(confirmPassword)
    );
  };

  const validateEmail = () => {
    if (!email) {
      return ''; // Return an empty string if the email is empty
    }

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      return 'Invalid Email Format';
    }
    return '';
  };
  const emailError = validateEmail();

  const validatePassword = () => {
    if (!password) {
      return ''; // Return an empty string if the email is empty
    }

    const regex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,}$/;
    if (!regex.test(password)) {
      return 'Invalid Password Format';
    }
    return '';
  };
  const passwordError = validatePassword();

  const validateConfirmPassword = () => {
    if (!confirmPassword) {
      return '';
    }

    const regex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,}$/;
    if (!regex.test(confirmPassword)) {
      return 'Passwords didn not match';
    }
    return '';
  };
  const confirmPasswordError = validateConfirmPassword();

  const handleResetPassword = async () => {
    auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        alert('Password reset email sent successfully');
      })
      .catch(error => {
        alert('Error sending password reset email:', error);
      });
  };

  return (
    <SafeAreaView className="flex-1 mt-20">
      <ScrollView>
        <View className="flex-1 items-center mt-[80px]">
          <Text
            className="text-primary text-4xl mb-5"
            style={{fontFamily: 'Montserrat-Bold'}}>
            Signup
          </Text>
          <Text
            className="text-grey text-[20px]"
            style={{fontFamily: 'Montserrat-Bold'}}>
            Please Fill the Form to Continue
          </Text>
        </View>

        <Animated.View
          style={[
            styles.container,
            {transform: [{translateY: formTranslateY}]},
          ]}>
          {/* Form Start */}

          <View className="flex-1 mt-10 w-full px-3">
            <View className="flex-row mb-5 border-b-2 border-b-black">
              <View className="mt-3">
                <MaterialCommunityIcons
                  name="email-outline"
                  size={25}
                  color={'#000'}
                />
              </View>
              <TextInput
                className="text-base px-5 w-full text-secondary"
                placeholder="Enter Email *"
                placeholderTextColor={'#003D53'}
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                ref={emailRef}
                style={{fontFamily: 'Montserrat-Medium'}}
              />
            </View>
            {emailError ? (
              <Text
                className="text-red-600 text-[14px] bottom-3"
                style={{fontFamily: 'Montserrat-Medium'}}>
                {emailError}
              </Text>
            ) : null}

            <View className="flex-1 flex-row border-b-2 border-b-black">
              <View className="flex-1 flex-row">
                <View className="mt-3">
                  <MaterialCommunityIcons
                    name="lock-outline"
                    size={25}
                    color={'#000'}
                  />
                </View>
                <TextInput
                  className="text-base px-5 w-full text-secondary"
                  placeholder="Enter Password *"
                  placeholderTextColor={'#003D53'}
                  value={password}
                  secureTextEntry={hidePassword}
                  onChangeText={setPassword}
                  ref={passwordRef}
                  style={{fontFamily: 'Montserrat-Medium'}}
                />
              </View>
              <View className="mt-3">
                <TouchableOpacity
                  onPress={() => setHidePassword(!hidePassword)}>
                  <MaterialCommunityIcons
                    name={hidePassword ? 'eye-off-outline' : 'eye-outline'}
                    size={25}
                    color={hidePassword ? '#000' : '#000'}
                  />
                </TouchableOpacity>
              </View>
            </View>
            {passwordError ? (
              <Text
                className="text-red-600 text-[14px] top-3"
                style={{fontFamily: 'Montserrat-Medium'}}>
                {passwordError}
              </Text>
            ) : null}

            <View className="flex-1 flex-row border-b-2 border-b-black mt-5">
              <View className="flex-1 flex-row">
                <View className="mt-3">
                  <MaterialCommunityIcons
                    name="lock-outline"
                    size={25}
                    color={'#000'}
                  />
                </View>
                <TextInput
                  className="text-base px-5 w-full text-secondary"
                  placeholder="Enter Confirm Password *"
                  placeholderTextColor={'#003D53'}
                  value={confirmPassword}
                  secureTextEntry={hidePassword1}
                  onChangeText={setConfirmPassword}
                  ref={confirmPasswordRef}
                  style={{fontFamily: 'Montserrat-Medium'}}
                />
              </View>
              <View className="mt-3">
                <TouchableOpacity
                  onPress={() => setHidePassword1(!hidePassword1)}>
                  <MaterialCommunityIcons
                    name={hidePassword1 ? 'eye-off-outline' : 'eye-outline'}
                    size={25}
                    color={hidePassword1 ? '#000' : '#000'}
                  />
                </TouchableOpacity>
              </View>
            </View>
            {confirmPasswordError ? (
              <Text
                className="text-red-600 text-[14px] top-3"
                style={{fontFamily: 'Montserrat-Medium'}}>
                {confirmPasswordError}
              </Text>
            ) : null}

            <View
              className="mb-5 border-2 border-b-black border-t-0 border-l-0 border-r-0 mt-5
            ">
              <Picker
                selectedValue={role}
                onValueChange={handleRoleChange}
                style={{color: '#000'}}>
                <Picker.Item
                  label="Select Role"
                  value=""
                  style={{color: '#fff', fontFamily: 'Montserrat-Medium'}}
                />
                <Picker.Item
                  label="User"
                  value="user"
                  style={{color: '#fff', fontFamily: 'Montserrat-Medium'}}
                />
                <Picker.Item
                  label="Admin"
                  value="admin"
                  style={{color: '#fff', fontFamily: 'Montserrat-Medium'}}
                />
              </Picker>
            </View>

            {/* Button Start */}

            <TouchableOpacity
              className="flex-1 justify-center left-3 mb-5 mr-5 items-center mt-10 p-4 bg-primary rounded-xl"
              onPress={handleSignup}>
              {loading ? (
                <ActivityIndicator color={'#fff'} />
              ) : (
                <Text
                  className="text-white text-xl"
                  style={{fontFamily: 'Montserrat-Bold'}}>
                  Signup
                </Text>
              )}
            </TouchableOpacity>

            {/* Button End */}

            {/* Extra */}

            <View className="flex-1 flex-row justify-around mt-8 mb-2">
              <View className="translate-y-4">
                <Text
                  className="text-[#000] text-[18px] "
                  style={{fontFamily: 'Montserrat-Bold'}}>
                  Already have an account
                </Text>
              </View>
              <TouchableOpacity
                className="bg-secondary p-4 w-32 items-center rounded-xl"
                onPress={() => navigation.navigate('Login')}>
                <Text
                  className="text-white text-[18px]"
                  style={{fontFamily: 'Montserrat-Bold'}}>
                  Login
                </Text>
              </TouchableOpacity>
            </View>

            {/* Extra */}
          </View>

          {/* Form End */}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});

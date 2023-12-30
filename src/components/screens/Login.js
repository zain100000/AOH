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
import '../../../FirebaseConfig';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
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

  const handleLogin = async () => {
    try {
      if (!email || !password || !ValidInput()) {
        if (!email) {
          alert('Email is mandatory');
          emailRef.current.focus();
        } else if (!password) {
          alert('Password is mandatory');
          passwordRef.current.focus();
        } else {
          alert('Please fill all the fields correctly');
        }
        return;
      }

      setLoading(true);

      // Use Firebase authentication to sign in
      const authCredential = await auth().signInWithEmailAndPassword(
        email,
        password,
      );
      const user = authCredential.user;

      // Fetch user data from Firebase Realtime Database
      const userSnapshot = await database()
        .ref(`users/${user.uid}`)
        .once('value');
      const userData = userSnapshot.val();

      if (userData) {
        const role = userData.role;
        if (role === 'user') {
          navigation.navigate('UserHome');
        } else if (role === 'admin') {
          navigation.navigate('AdminHome');
        }
      } else {
        alert('User data not found');
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Validations

  const emailRef = useRef();
  const passwordRef = useRef();

  const ValidInput = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,}$/;

    return emailPattern.test(email) && passwordPattern.test(password);
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
            Login
          </Text>
          <Text
            className="text-grey text-[20px]"
            style={{fontFamily: 'Montserrat-Bold'}}>
            Please Login to Continue
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

            {/* Forget Password */}
            <View className="flex-1 mt-8 px-2">
              <TouchableOpacity onPress={handleResetPassword}>
                <Text
                  className="text-[18px] text-primary"
                  style={{fontFamily: 'Montserrat-Medium'}}>
                  Forget Password ?
                </Text>
              </TouchableOpacity>
            </View>
            {/* Forget Password */}

            {/* Button Start */}

            <TouchableOpacity
              className="flex-1 justify-center left-3 mb-5 mr-7 items-center mt-8 p-4 bg-primary rounded-xl"
              onPress={handleLogin}>
              {loading ? (
                <ActivityIndicator color={'#fff'} />
              ) : (
                <Text
                  className="text-white text-xl"
                  style={{fontFamily: 'Montserrat-Bold'}}>
                  Login
                </Text>
              )}
            </TouchableOpacity>

            {/* Button End */}

            {/* Extra */}

            {/* <View className="flex-1 flex-row justify-around mt-8 mb-2">
              <View className="translate-y-4">
                <Text
                  className="text-[#000] text-[18px] "
                  style={{fontFamily: 'Montserrat-Bold'}}>
                  Didn't have an account
                </Text>
              </View>
              <TouchableOpacity
                className="bg-secondary p-4 w-32 items-center rounded-xl"
                onPress={() => navigation.navigate('Signup')}>
                <Text
                  className="text-white text-[18px]"
                  style={{fontFamily: 'Montserrat-Bold'}}>
                  Signup
                </Text>
              </TouchableOpacity>
            </View> */}

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

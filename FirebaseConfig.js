import firebase from 'firebase/compat';
import 'firebase/compat/auth';
import 'firebase/compat/database';

const firebaseConfig = {
  apiKey: 'AIzaSyBOT7F3p_HOhkNlsg1Ux8wPeZuBlPGB1VA',
  authDomain: 'abidomer-a4c14.firebaseapp.com',
  databaseUrl: 'https://abidomer-a4c14-default-rtdb.firebaseio.com',
  projectId: 'abidomer-a4c14',
  storageBucket: 'abidomer-a4c14.appspot.com',
  messagingSenderId: '40210985528',
  appId: '1:40210985528:web:885d8c42965fcb97d56ccd',
  measurementId: 'G-CDL2YS1Y2P',
};

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const storage = firebase.database();

export const roles = {
  user: 'user',
  admin: 'admin',
};

import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database'; //добавили
// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyDxjhFai38NP4WnEYFOE0xFRC68mnoynLo',
	authDomain: 'todolisttask1.firebaseapp.com',
	projectId: 'todolisttask1',
	storageBucket: 'todolisttask1.firebasestorage.app',
	messagingSenderId: '939129891123',
	appId: '1:939129891123:web:f7c35db6cfc5b6d9303646',
	databaseURL:
		'https://todolisttask1-default-rtdb.europe-west1.firebasedatabase.app/',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//при подключении db в других файлах будет инициализироваться app с помощью firebaseConfig

//из файла экспортируем базу данных

export const db = getDatabase(app);

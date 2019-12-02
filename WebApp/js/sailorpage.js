var config = 
	{
		apiKey: "AIzaSyDG6CosTJ21RN1dNak2ZJr58eiZkLBQvaU",
		authDomain: "garage-sailor-5b177.firebaseapp.com",
		databaseURL: "https://garage-sailor-5b177.firebaseio.com",
		projectId: "garage-sailor-5b177",
		storageBucket: "garage-sailor-5b177.appspot.com",
		messagingSenderId: "53970225751",
		appId: "1:53970225751:web:f495df6b08d1c76e8df112",
		measurementId: "G-LF18WB35BV"
	};

firebase.initializeApp(config);
firebase.analytics();
const db = firebase.firestore();

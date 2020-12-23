// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
	production: false,
	firebase: {
		apiKey: "AIzaSyBIDXtQIVaViLg21FBRcB6MbGmg3ozmBYU",
		authDomain: "stephen-king-info.firebaseapp.com",
		databaseURL: "https://stephen-king-info.firebaseio.com",
		projectId: "stephen-king-info",
		storageBucket: "stephen-king-info.appspot.com",
		messagingSenderId: "565526373313",
		appId: "1:565526373313:web:4705dc6d41da71d9488540"
	},
	appBaseHref: '/',
	useHash: false,
	libraryData: 'files' // files || firestore
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

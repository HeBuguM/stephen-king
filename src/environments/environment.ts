// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyBLTJJHVCnzNlE162i_CeS3wfJvzm1JACo",
    authDomain: "sk-database.firebaseapp.com",
    databaseURL: "https://sk-database.firebaseio.com",
    projectId: "sk-database",
    storageBucket: "sk-database.appspot.com",
    messagingSenderId: "178616645591",
    appId: "1:178616645591:web:a634d6a1aa5693c422fd92"
  },
  appBaseHref: '/',
  useHash: false,
  libraryData: 'firestore' // files || firestore
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

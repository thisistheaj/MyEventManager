import { Component, NgZone } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import firebase from 'firebase';

import { HomePage } from '../pages/home/home';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;
  zone: NgZone;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      firebase.initializeApp({
        apiKey: "AIzaSyDIX9h1XPh3A84v_OrT35R4vANTTLj-zQg",
        authDomain: "followers-e0e8d.firebaseapp.com",
        databaseURL: "https://followers-e0e8d.firebaseio.com",
        projectId: "followers-e0e8d",
        storageBucket: "followers-e0e8d.appspot.com",
        messagingSenderId: "758989306245"
      });

      this.zone = new NgZone({});
      const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
        this.zone.run( () => {
          if (!user) {
            this.rootPage = 'login';
            unsubscribe();
          } else {
            this.rootPage = HomePage;
            unsubscribe();
          }
        });
      });

    });


  }
}


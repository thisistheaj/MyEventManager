import {Injectable} from '@angular/core';
import firebase from 'firebase/app';
/*
 Generated class for the EventProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class EventProvider {

  constructor() {
  }

  createEvent(eventName: string, eventDate: string, eventPrice: number, eventCost: number): firebase.Promise<any> {
    return firebase.database()
      .ref(`userProfile/${firebase.auth().currentUser.uid}/eventList`)
      .push({
        name: eventName,
        date: eventDate,
        price: eventPrice * 1,
        cost: eventCost * 1,
        revenue: eventCost * (-1)
      });
  }

  getEventList(): Promise<any> {
    return new Promise((resolve, reject) => {
      firebase.database().ref(`userProfile/${firebase.auth().currentUser.uid}/eventList`).on('value', snapshot => {
        let rawList = [];
        snapshot.forEach(snap => {
          rawList.push({
            id: snap.key,
            name: snap.val().name,
            price: snap.val().price,
            date: snap.val().date,
          });
          return false
        });
        resolve(rawList);
      });
    });
  }

  getEventDetail(eventId): Promise<any> {
    return new Promise((resolve, reject) => {
      firebase.database().ref(`userProfile/${firebase.auth().currentUser.uid}/eventList`).child(eventId).on('value', snapshot => {
        resolve({
          id: snapshot.key,
          name: snapshot.val().name,
          date: snapshot.val().date,
          price: snapshot.val().price,
          cost: snapshot.val().cost,
          revenue: snapshot.val().revenue
        });
      });
    });
  }

  addGuest(guestName: string, eventId: string, eventPrice: number, guestPicture = null): firebase.Promise<any> {
    return firebase.database().ref(`userProfile/${firebase.auth().currentUser.uid}/eventList`).child(eventId).child('guestList').push({
      guestName: guestName
    }).then(newGuest => {
      if (guestPicture != null) {
        firebase.storage().ref('/guestProfile/').child(newGuest.key).child('profilePicture.png').putString(guestPicture, 'base64', {contentType: 'image/png'}).then((savedPicture) => {
          firebase.database().ref(`userProfile/${firebase.auth().currentUser.uid}/eventList`).child(eventId).child('guestList').child(newGuest.key).child('profilePicture').set(savedPicture.downloadURL);
        });
      }
      firebase.database().ref(`userProfile/${firebase.auth().currentUser.uid}/eventList`).child(eventId).transaction(event => {
        event.revenue += eventPrice;
        return event;
      });
    });
  }

}

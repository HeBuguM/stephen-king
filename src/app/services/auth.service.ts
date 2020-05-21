import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/User'; // optional

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {

    user$: Observable<User>;
    loadingAuth = true;

    constructor(
        private afAuth: AngularFireAuth,
        private afs: AngularFirestore,
        private router: Router
    ) {
      this.user$ = this.afAuth.authState.pipe(
        switchMap( user => {
          if (user) {
            this.loadingAuth = false;
            return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
          } else {
            this.loadingAuth = null;
            return of(null);
          }
        })
      );
    }

    async googleSignin() {
      const provider = new auth.GoogleAuthProvider();
      const credential = await this.afAuth.signInWithPopup(provider);
      return this.updateUserData(credential.user);
    }

    private updateUserData(user) {
      const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

      const data: User = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        roles: {
          reader: true
        }
      }
      return userRef.set(data, { merge: true })
    }

    async signOut() {
      await this.afAuth.signOut();
      this.router.navigate(['/books']);
    }

    isReader(user: User) {
      return user.roles.reader == true ? true : false;
    }
    isEditor(user: User) {
      return user.roles.editor == true ? true : false;
    }
    isAdmin(user: User) {
      return user.roles.admin == true ? true : false;
    }

}

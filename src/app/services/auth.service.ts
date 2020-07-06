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
	user;
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
	  this.user$.subscribe(user => {
		this.user = user;
	  })
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
		  reader: true,
		  admin: false,
		  editor: false
        }
      }
      return userRef.set(data, { merge: true })
    }

    async signOut() {
		await this.afAuth.signOut();
		this.router.navigate(['/books']);
	}

	public isDataSync() {
		let user_data_id = this.user.data_id ? parseInt(this.user.data_id) : 0;
		let local_data_id = localStorage.getItem("data_id") !== null ? parseInt(localStorage.getItem("data_id")) : 0;

		let user_data_modified = this.user.data_modified ? parseInt(this.user.data_modified) : 0;
		let local_data_modified = localStorage.getItem("data_modified") !== null ? parseInt(localStorage.getItem("data_modified")) : 0;

		let user_data_sync = this.user.data_sync ? parseInt(this.user.data_sync) : 0;
		let local_data_sync = localStorage.getItem("data_sync") !== null ? parseInt(localStorage.getItem("data_sync")) : 0;

		if(user_data_id != local_data_id || user_data_sync != local_data_sync) {
			return false;
		} else {
			if(local_data_modified > user_data_sync) {
				return false;
			} else {
				return true;
			}
		}
	}

	public syncLocalStorageData() {
		const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/`+this.user.uid);
		let data_sync = new Date().getTime().toString();
		let data = {
			data_id: localStorage.getItem("data_id"),
			data_modified: localStorage.getItem("data_modified"),
			data_sync: data_sync,
			read_books: JSON.parse(localStorage.getItem("read_books")),
			read_shorts: JSON.parse(localStorage.getItem("read_shorts")),
			selected_editions: JSON.parse(localStorage.getItem("selected_editions"))
		};
		userRef.update(data);
		localStorage.setItem("data_sync", data_sync);
	}

	public importProfileStorageData() {
		try {
			let user_data = this.user;
			if(
				typeof user_data.data_id !== 'undefined'
				&& typeof user_data.data_modified !== 'undefined'
				&& typeof user_data.data_sync !== 'undefined'
				&& typeof user_data.read_books !== 'undefined'
				&& typeof user_data.read_shorts !== 'undefined'
				&& typeof user_data.selected_editions !== 'undefined'
			) {
				localStorage.clear();
				if(user_data.data_id !== null) {
					localStorage.setItem("data_id", user_data.data_id.toString());
				}
				if(user_data.data_modified !== null) {
					localStorage.setItem("data_modified", user_data.data_modified.toString());
				}
				if(user_data.data_sync !== null) {
					localStorage.setItem("data_sync", user_data.data_sync.toString());
				}
				if(user_data.read_books !== null) {
					localStorage.setItem("read_books", JSON.stringify(user_data.read_books));
				}
				if(user_data.read_shorts !== null) {
					localStorage.setItem("read_shorts", JSON.stringify(user_data.read_shorts));
				}
				if(user_data.selected_editions) {
					localStorage.setItem("selected_editions", JSON.stringify(user_data.selected_editions));
				}
				alert("Данните са заредени успешно!")
			}
		} catch (e) {
			console.log(e);
			alert("Невалидно съдържание!")
		}
	}

	public booksReadCount() {
		return typeof this.user.read_books !== 'undefined' && this.user.read_books !== null ? Object.values(this.user.read_books).length : 0;
	}
	public shortsReadCount() {
		return typeof this.user.read_shorts !== 'undefined' && this.user.read_shorts !== null ? Object.values(this.user.read_shorts).length : 0;
	}
	public selectedEditionsCount() {
		return typeof this.user.selected_editions !== 'undefined' && this.user.selected_editions !== null ? Object.values(this.user.selected_editions).length : 0;
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

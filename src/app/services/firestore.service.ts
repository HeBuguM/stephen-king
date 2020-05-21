import { Injectable } from '@angular/core';

import { Observable, of, combineLatest, pipe, defer } from 'rxjs';
import { switchMap, map, tap, shareReplay } from 'rxjs/operators';

import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';


type CollectionPredicate<T> = string | AngularFirestoreCollection<T>;
type DocPredicate<T>        = string | AngularFirestoreDocument<T>;

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private afs: AngularFirestore) { }

  col<T>(ref: CollectionPredicate<T>, queryFn?): AngularFirestoreCollection<T> {
    return typeof ref === 'string' ? this.afs.collection<T>(ref, queryFn) : ref
  }

  doc<T>(ref: DocPredicate<T>): AngularFirestoreDocument<T> {
    return typeof ref === 'string' ? this.afs.doc<T>(ref) : ref;
  }

  //// Get Data Functions

  doc$<T>(ref: DocPredicate<T>): Observable<T> {
    return this.doc(ref).snapshotChanges().pipe(map(doc => {
      return doc.payload.data() as T
    }))
  }

  col$<T>(ref: CollectionPredicate<T>,queryFn?): Observable<T[]> {
    return this.col(ref,queryFn).snapshotChanges().pipe(
      map(docs => {
          return docs.map(a => a.payload.doc.data()) as T[]
        }
      )
    )
  }

  docJoin = (
    afs: AngularFirestore,
    paths: {[key: string]: string}
  ) => {
    return source =>
      defer(() => {
        let parent;
        const keys = Object.keys(paths);

        return source.pine(
          switchMap(data => {
            parent = data;
            const docs$ = keys.map(k => {
              const fullPath = `$(paths[k]/${parent[k]})`;
              return afs.doc(fullPath).valueChanges();
            })
            return combineLatest(docs$)
          }),
          map(arr => {
            const joins = keys.reduce((acc, cur, idx) => {
              return { ...acc, [cur]: arr[idx]};
            }, {});
            return { ...parent, ...joins }
          })
        );

      })
  }

  leftJoin = (
    afs: AngularFirestore,
    field,
    collection,
    limit = 100
  ) => {
    return source =>
      defer(() => {
        let collectionData;
        let totalJoins = 0;
        return source.pipe(
          switchMap(data => {
            const reads$ = [];
            collectionData = data as any[];
            for (const doc of collectionData) {
              if(doc[field]) {
                const q = ref => ref.where(field, '==', doc[field]).limit(limit);
                reads$.push(afs.collection(collection, q).valueChanges());
              } else {
                reads$.push(of([]));
              }
            }
            return combineLatest(reads$);
          }),
          map(joins => {
            return collectionData.map((v,i) => {
              totalJoins += joins[i].length;
              return {...v, [collection]: joins[i]} || null;
            });
          }),tap(
            final => {
              console.log(
                `Queried ${(final as any).length}, Joined ${totalJoins} docs`
              );
              totalJoins = 0;
            }
          )
        );
      });
  };
}

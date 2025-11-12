import { Injectable, inject, signal } from '@angular/core';
import { Firestore, doc, docData } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export interface UserData {
  nome: string;
  peso: number;
  idade: number;
  genero: string;
  atividade: string;
}

@Injectable({ providedIn: 'root' })
export class UserDataService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);

  //sina para armazenar o usuário atual
  userData$!: Observable<UserData | null>;
  userId$!: Observable<string | null>;

  constructor() {
    // toda vez que o auth muda carrega os dados do Firestore
    this.userData$ = new Observable(subscriber => {
      const unsubscribe = this.auth.onAuthStateChanged(user => {
        if (user) {
          const userRef = doc(this.firestore, 'usuarios', user.uid);
          const data$ = docData(userRef) as Observable<UserData>;
          data$.subscribe(subscriber);
        } else {
          subscriber.next(null);
        }
      });
      return unsubscribe;
    });

    this.userId$ = new Observable(subscriber => {
      const unsubscribe = this.auth.onAuthStateChanged(user => {
        subscriber.next(user ? user.uid : null);
      });
      return unsubscribe;
    });
  }
}
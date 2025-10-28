import { Injectable, inject } from "@angular/core";
import { Firestore, collectionData, collection, addDoc, doc, getDoc, getDocs} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class FirestoreService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  
    async addUser(data: any) {
        const usersRef = collection(this.firestore, 'usuarios');
        await addDoc(usersRef, data);
  }

  getUsers() {
    const usersRef = collection(this.firestore, 'usuarios');
    return collectionData(usersRef, { idField: 'id' });
  }

}
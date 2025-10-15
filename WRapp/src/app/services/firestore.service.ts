import { Injectable, inject } from "@angular/core";
import { Firestore, collectionData, collection, addDoc } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class FirestoreService {
  private firestore = inject(Firestore);

    async addUser(data: any) {
        const usersRef = collection(this.firestore, 'usuarios');
        await addDoc(usersRef, data);
  }

  getUsers() {
    const usersRef = collection(this.firestore, 'usuarios');
    return collectionData(usersRef, { idField: 'id' });
  }

}

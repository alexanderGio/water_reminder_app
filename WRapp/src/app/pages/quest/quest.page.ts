import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-quest',
  templateUrl: './quest.page.html',
  styleUrls: ['./quest.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonButton,
  ],
})
export class QuestPage {
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private router = inject(Router);

  formData = {
    nome: '',
    peso: null,
    idade: null,
    genero: '',
    atividade: '',
  };

  async onSubmit() {
    const user = this.auth.currentUser;

    if (!user) {
      alert('Você precisa estar logado!');
      return;
    }

    try {
      const userRef = doc(this.firestore, 'usuarios', user.uid);
      await setDoc(userRef, this.formData, { merge: true });

      this.router.navigate(['/tabs/tab1']);
    } catch (err) {
      console.error('Erro ao salvar:', err);
      alert('Erro ao salvar os dados.');
    }
  }

  goHome() {
    this.router.navigate(['/tabs/tab1']);
  }
}

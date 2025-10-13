import { Component, OnInit } from '@angular/core';
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
  IonButton, } from '@ionic/angular/standalone';

import { Router } from '@angular/router';

import { getAuth } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../../environments/firebase.config';

@Component({
  selector: 'app-quest',
  templateUrl: './quest.page.html',
  styleUrls: ['./quest.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,  IonHeader,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,

  ]
})
export class QuestPage implements OnInit {
  formData = {
    nome: '',
    peso: null,
    idade: null,
    genero: '',
    atividade: '',
  };
   async onSubmit() {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert('Você precisa estar logado!');
      return;
    }
 
    try {
      await setDoc(doc(db, 'usuarios', user.uid), this.formData, { merge: true });
      //alert('Dados salvos com sucesso!');
    } catch (err) {
      console.error('Erro ao salvar:', err);
      //alert('Erro ao salvar os dados.');
    }
  }

  constructor(private router: Router) {}

    goHome() {
    this.router.navigateByUrl('/Tab1Page');
  }


  ngOnInit() {
  }

}

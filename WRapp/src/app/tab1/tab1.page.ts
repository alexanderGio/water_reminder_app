import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';
import { AguaDiariaComponent } from '../components/agua-diaria/agua-diaria.component';
import { FirestoreService } from '../services/firestore.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    AguaDiariaComponent,
    CommonModule,
     IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardContent 
  ],
  styleUrls: ['./tab1.page.scss'],
  template: `
    <ion-content class="ion-padding">
      <app-agua-diaria></app-agua-diaria>

      <h1>Bem vindo</h1>
      <ion-button (click)="aumentar()">Aumentar</ion-button>
      <ion-button (click)="apagar()">apagar</ion-button>
    </ion-content>
  `
})
export class Tab1Page {
  progresso = 0;

  aumentar(){
    this.progresso = Math.min(this.progresso + 10,100)
  }

  apagar(){
    this.progresso = 0;
  }

  constructor(private auth: AuthService,
    private router: Router) {}

    private firestoreService = inject(FirestoreService);
    users$ = this.firestoreService.getUsers();

  async logout() {
    await this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}

//<ion-buttons slot="end">
//          <ion-button (click)="logout()">
//            <ion-icon name="log-out-outline" slot="start"></ion-icon>
//            Sair
//         </ion-button>
//        </ion-buttons>
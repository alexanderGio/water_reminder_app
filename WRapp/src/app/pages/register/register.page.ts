import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  template: `
    <ion-header><ion-toolbar><ion-title>Criar Conta</ion-title></ion-toolbar></ion-header>
    <ion-content class="ion-padding">
      <form (ngSubmit)="onRegister()">
        <ion-item>
          <ion-input [(ngModel)]="email" name="email" type="email" placeholder="Email"></ion-input>
        </ion-item>
        <ion-item>
          <ion-input [(ngModel)]="password" name="password" type="password" placeholder="Senha"></ion-input>
        </ion-item>
        <ion-button expand="block" type="submit">Cadastrar</ion-button>
        <ion-button expand="block" fill="clear" (click)="goToLogin()">Voltar</ion-button>
      </form>
    </ion-content>
  `
})
export class RegisterPage {
  email = '';
  password = '';

  constructor(private auth: AuthService, private router: Router) {}

  async onRegister() {
    try {
      await this.auth.register(this.email, this.password);
      this.router.navigateByUrl('/login');
    } catch (err) {
      console.error(err);
    }
  }

  goToLogin() {
    this.router.navigateByUrl('/login');
  }
}

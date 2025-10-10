import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
 
@Component({
  selector: 'app-login',
  standalone: true,
  styleUrls: ['././login.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
  template: `
    <ion-content class="ion-padding">
    <h1>Faça seu Login!</h1>
      <form (ngSubmit)="onLogin()" class="form">
        <ion-item>
          <ion-input [(ngModel)]="email" name="email" type="email" placeholder="Email"></ion-input>
        </ion-item>
        <ion-item>
          <ion-input [(ngModel)]="password" name="password" type="password" placeholder="Senha"></ion-input>
        </ion-item>
        <ion-button expand="block" type="submit">Entrar</ion-button>
        <ion-button expand="block" fill="clear" (click)="goToRegister()">Criar conta</ion-button>
      </form>
    </ion-content>
  `
})
export class LoginPage {
  email = '';
  password = '';

  constructor(private auth: AuthService, private router: Router) {}

  async onLogin() {
    try {
      await this.auth.login(this.email, this.password);
      this.router.navigateByUrl('/Tab1Page');
    } catch (err) {
      console.error(err);
    }
  }

  goToRegister() {
    this.router.navigateByUrl('/register');
  }
}

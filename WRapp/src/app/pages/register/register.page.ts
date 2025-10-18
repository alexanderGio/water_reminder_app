import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  standalone: true,
  styleUrls: ['././register.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
  template: `
    <ion-content [fullscreen]="true">
    <h1>Cadastro</h1>
      <div class="container">
        <form (ngSubmit)="onRegister()">  
            <ion-input
              [(ngModel)]="email"
              name="email"
              type="email"
              placeholder=" Email"
              required
            ></ion-input>

            <ion-input
              [(ngModel)]="password"
              name="password"
              type="password"
              placeholder=" Senha"
              required
            ></ion-input>
          <ion-button class="btn-cadastro" fill="clear"type="submit">Cadastrar</ion-button><br>
          <ion-button class="btn-voltar" fill="clear" (click)="goToLogin()">Voltar</ion-button>
        </form>
        </div>
    </ion-content>
  `,
})
export class RegisterPage {
  email = '';
  password = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private alertController: AlertController
  ) {}

  async mostrarErro(mensagem: string) {
    const alert = await this.alertController.create({
      header: 'Erro',
      message: mensagem,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async onRegister() {
    try {
      await this.auth.register(this.email, this.password);
      this.router.navigateByUrl('/QuestPage');
    } catch (err: any) {
      this.mostrarErro(err.message);
    }
  }

  goToLogin() {
    this.router.navigateByUrl('/login');
  }
}
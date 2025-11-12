import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';

 
@Component({
  selector: 'app-login',
  standalone: true,
  styleUrls: ['././login.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
  template: `
<ion-content>
  <form (ngSubmit)="onLogin()" class="form-container">

    <div class="input-box">
      <ion-icon name="mail-outline"></ion-icon>
      <ion-input
        [(ngModel)]="email"
        name="email"
        type="email"
        placeholder="Email"
        required
      ></ion-input>
    </div>

    <div class="input-box">
      <ion-icon name="lock-closed-outline"></ion-icon>
      <ion-input
        [(ngModel)]="password"
        name="password"
        type="password"
        placeholder="Senha"
        required
      ></ion-input>
    </div>

    <button type="submit" class="btn-entrar">Entrar</button>
    <button type="button" (click)="goToRegister()" class="btn-cadastrar">
      Criar conta
    </button>

  </form>
</ion-content>

  `
})
export class LoginPage {
  email = '';
  password = '';

  constructor(private auth: AuthService, 
    private router: Router,
    private alertController: AlertController) {}

    async mostrarErro(mensagem: string) {
      const alert = await this.alertController.create({
      header: 'Erro ao fazer login!',
      message: mensagem,
      buttons: ['OK'],
  });

  await alert.present();
}

  async onLogin() {
    try {
      await this.auth.login(this.email, this.password);
      this.router.navigate(['/tabs/tab1']);
    } catch (err:any) {
      this.mostrarErro(err.message);
    }
  }

  goToRegister() {
    this.router.navigateByUrl('/register');
  }
}
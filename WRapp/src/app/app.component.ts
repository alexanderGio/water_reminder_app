import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { LocalNotifications } from '@capacitor/local-notifications';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {
    this.pedirPermissaoNotificacao();
  }

  // Solicita permissão ao iniciar o app
  async pedirPermissaoNotificacao() {
    try {
      const perm = await LocalNotifications.requestPermissions();
      console.log('Permissão para notificações:', perm);
    } catch (error) {
      console.error('Erro ao solicitar permissão:', error);
    }
  }
}

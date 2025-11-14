import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true, // IMPORTANTE em apps standalone!
  imports: [
    IonApp,
    IonRouterOutlet
  ],
})
export class AppComponent implements OnInit {

  constructor(private notificationService: NotificationService) {}

  async ngOnInit() {
    // Inicializa notificações assim que o app abre
    await this.notificationService.init();
  }
}


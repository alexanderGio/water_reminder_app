import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() {}

  // Solicita permissão no Android 13+
  async requestPermission() {
    try {
      const result = await LocalNotifications.requestPermissions();
      console.log('📌 Permissão de notificações:', result);
    } catch (err) {
      console.error('Erro ao solicitar permissão:', err);
    }
  }

  // Cancela notificações anteriores (evita duplicar)
  async cancelAll() {
    try {
      await LocalNotifications.cancel({ notifications: [] });
      console.log('🚫 Todas as notificações foram canceladas');
    } catch (err) {
      console.error('Erro ao cancelar notificações:', err);
    }
  }

  // Agenda a notificação de lembrete de hidratação
  async scheduleHydrationReminder() {
    try {
      await this.cancelAll(); // Evita duplicação

      await LocalNotifications.schedule({
        notifications: [
          {
            id: 1,
            title: 'Hora de beber água 💧',
            body: 'Não esqueça de se hidratar!',
            schedule: { every: 'minute' },
            smallIcon: 'ic_stat_icon_config_sample',
            sound: 'default',
          }
        ]
      });

      console.log('⏰ Notificação de hidratação agendada com sucesso!');

    } catch (err) {
      console.error('Erro ao agendar notificações:', err);
    }
  }

  // Inicialização geral (chamar no app.component.ts)
  async init() {
    await this.requestPermission();
    await this.scheduleHydrationReminder();
  }
}
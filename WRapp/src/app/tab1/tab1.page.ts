import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';
import { FirestoreService } from '../services/firestore.service';
import { UserDataService } from '../services/data.service';
import { CommonModule } from '@angular/common';
import { Geolocation } from '@capacitor/geolocation';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonContent,
    CommonModule,
    HttpClientModule,
  ],
  styleUrls: ['./tab1.page.scss'],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Water Reminder</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <h1>Bem vindo</h1>

      <p>Temperatura atual: {{ temperatura !== null ? temperatura + '°C' : 'Carregando...' }}</p>
      <p>Status: {{ status }}</p>

      <div class="wave-container" style="position: relative; height: 200px; overflow: hidden; margin-bottom: 20px;">
        <div class="wave" [style.bottom.%]="consumoPercentual" style="position: absolute; width: 100%; height: 100%;">
          <svg viewBox="0 0 1440 320" preserveAspectRatio="none" style="width: 100%; height: 100%;">
            <path fill="#4fc3f7" fill-opacity="0.7" d="M0,160 C360,200 1080,120 1440,160 L1440,320 L0,320 Z"></path>
          </svg>
        </div>
        <div class="percentage-text" style="position: absolute; width: 100%; text-align: center; top: 50%; transform: translateY(-50%); font-size: 24px; font-weight: bold;">
          {{ consumoPercentual | number:'1.0-0' }}%
        </div>
      </div>

      <ion-button expand="block" (click)="toggleDrinkOptions()">
        {{ showDrinkOptions ? 'Fechar opções' : 'Beber Água' }}
      </ion-button>

      <div *ngIf="showDrinkOptions" style="margin-top: 10px; display: flex; justify-content: space-around;">
        <ion-button (click)="beber(200)">200 ml</ion-button>
        <ion-button (click)="beber(300)">300 ml</ion-button>
        <ion-button (click)="beber(500)">500 ml</ion-button>
      </div>

      <p style="margin-top: 20px;">
        Consumo total: {{ consumoTotal }} ml / Meta diária: {{ necessidadeAguaML }} ml ({{ qntdDiariaLitro | number:'1.2-2' }} litros)
      </p>
    </ion-content>
  `
})
export class Tab1Page implements OnInit, OnDestroy {
  consumoPercentual = 0;
  consumoTotal = 0;
  necessidadeAguaML = 0;
  qntdDiariaLitro = 0;

  temperatura: number | null = null;
  status = 'Obtendo localização e temperatura...';

  showDrinkOptions = false;
  parabenizouHoje = false;

  private http = inject(HttpClient);
  private firestoreService = inject(FirestoreService);
  private userDataService = inject(UserDataService);

  private destroy$ = new Subject<void>();

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.userDataService.userData$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        if (!user) return;

        const genMult = user.genero === 'feminino' ? 1 : 1.08;
        let idadeMult = user.idade <= 12 ? 1.10 : user.idade >= 55 ? 0.95 : 1;
        let atvMult = user.atividade === 'pouca' ? 1 : user.atividade === 'muita' ? 1.30 : 1.15;

        const baseMl = user.peso * 35;
        this.necessidadeAguaML = baseMl * genMult * idadeMult * atvMult;
        this.qntdDiariaLitro = this.necessidadeAguaML / 1000;

        this.atualizarPercentual();
      });

    this.getLocalizacaoEClima();
  }

  ionViewWillEnter() {
    this.getLocalizacaoEClima(); // roda toda vez que o usuário volta pra essa aba/tela
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleDrinkOptions() {
    this.showDrinkOptions = !this.showDrinkOptions;
  }

  beber(volume: number) {
    if (!this.necessidadeAguaML) return;

    this.consumoTotal += volume;
    if (this.consumoTotal > this.necessidadeAguaML) {
      this.consumoTotal = this.necessidadeAguaML;
    }

    this.atualizarPercentual();
    this.showDrinkOptions = false;

    if (this.consumoPercentual >= 100 && !this.parabenizouHoje) {
      this.parabenizarUsuario();
      this.parabenizouHoje = true;
    }
  }

  atualizarPercentual() {
    this.consumoPercentual = (this.consumoTotal / this.necessidadeAguaML) * 100;
    if (this.consumoPercentual > 100) this.consumoPercentual = 100;
  }

  async parabenizarUsuario() {
    const alert = document.createElement('ion-alert');
    alert.header = 'Parabéns! 🎉';
    alert.message = 'Você atingiu sua meta diária de hidratação! Continue assim! 💧';
    alert.buttons = ['OK'];
    document.body.appendChild(alert);
    await alert.present();
  }

  async getLocalizacaoEClima() {
    try {
      const permissionStatus = await Geolocation.checkPermissions();
      console.log('Permissões atuais:', permissionStatus);

      if (permissionStatus.location !== 'granted') {
        const requestStatus = await Geolocation.requestPermissions();
        console.log('Permissões solicitadas:', requestStatus);

        if (requestStatus.location !== 'granted') {
          this.status = 'Permissão para localização negada.';
          return;
        }
      }

      const position = await Geolocation.getCurrentPosition();
      this.status = `Localização: (${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)})`;
      this.fetchTemperatura(position.coords.latitude, position.coords.longitude);
    } catch (error) {
      console.error('Erro ao obter localização:', error);
      this.status = 'Erro ao acessar localização: ' + (error instanceof Error ? error.message : JSON.stringify(error));

    }
  }

  fetchTemperatura(lat: number, lon: number) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

    this.http.get<any>(url).subscribe({
      next: data => {
        this.temperatura = data?.current_weather?.temperature ?? null;
        if (this.temperatura === null) {
          this.status = 'Dados climáticos indisponíveis.';
        } else {
          this.status = `Temperatura atual: ${this.temperatura}°C`;
        }
      },
      error: err => {
        console.error('Erro ao obter dados climáticos:', err);
        this.status = 'Erro ao obter dados climáticos.';
      }
    });
  }

  async logout() {
    await this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}

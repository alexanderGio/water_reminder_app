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
  selector: 'app-tab1',
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
  templateUrl: './tab1.page.html'

   
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

}

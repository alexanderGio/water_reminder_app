import { Component, OnInit } from '@angular/core';
import { IonicModule, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Geolocation } from '@capacitor/geolocation';

declare var Pedometer: any;

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, HttpClientModule]
})
export class Tab2Page implements OnInit {

  hydrationLevel: number = 100;
  temperatura: number | null = null;
  distanciaTotalMetros: number = 0;
  rastreamentoAtivo: boolean = false;
  status: string = 'Obtendo localização...';

  private distanciaAnteriorParaHidratacao: number = 0;
  private watchId: string | null = null;
  private ultimaPosicao: { latitude: number; longitude: number } | null = null;

  constructor(private http: HttpClient, private alertController: AlertController) {}

  ngOnInit() {
    this.getLocalizacaoEClima();
  }

  async getLocalizacaoEClima() {
    try {
      await Geolocation.requestPermissions();
      const position = await Geolocation.getCurrentPosition();
      this.status = `Localização: (${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)})`;
      this.getTemperaturaAtual(position.coords.latitude, position.coords.longitude);
    } catch (error) {
      console.error('Erro ao obter localização:', error);
      this.status = 'Permissão de localização negada ou erro ao acessar GPS.';
    }
  }

  getTemperaturaAtual(lat: number, lon: number) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

    this.http.get<any>(url).subscribe({
      next: data => {
        this.temperatura = data?.current_weather?.temperature ?? null;
        this.status = this.temperatura ? `Temperatura atual: ${this.temperatura}°C` : 'Dados climáticos não disponíveis.';
        this.atualizarHidratação();
      },
      error: err => {
        console.error(err);
        this.status = 'Erro ao obter dados climáticos.';
      }
    });
  }

  startPedometer() {
    if (typeof Pedometer === 'undefined') return;

    Pedometer.startPedometerUpdates((data: any) => {
      const distanciaEstimativa = (data.distance && data.distance > 0 ? data.distance : data.numberOfSteps * 0.7) || 0;
      this.distanciaTotalMetros = distanciaEstimativa;
      this.atualizarHidratação();
    }, (error: any) => console.error('Erro pedômetro:', error));
  }

  async startTrackingDistance() {
    this.watchId = await Geolocation.watchPosition({ enableHighAccuracy: true }, position => {
      if (!position) return;
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      if (this.ultimaPosicao) {
        const d = this.calcularDistanciaMetros(this.ultimaPosicao.latitude, this.ultimaPosicao.longitude, lat, lon);
        if (d >= 0.5 && d <= 100) {
          this.distanciaTotalMetros += d;
          this.atualizarHidratação();
        }
      }
      this.ultimaPosicao = { latitude: lat, longitude: lon };
    });
  }

  stopTrackingDistance() {
    if (this.watchId !== null) {
      Geolocation.clearWatch({ id: this.watchId }).catch(err => console.error(err));
      this.watchId = null;
    }
  }

  calcularDistanciaMetros(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371000;
    const toRad = (x: number) => x * Math.PI / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat/2) ** 2 +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  atualizarHidratação() {
    if (this.temperatura === null) return;
    let dehydrationRate: number = 0.1;
    if (this.temperatura > 30) dehydrationRate += (this.temperatura - 30) * 0.05;
    const distanciaIncremental = this.distanciaTotalMetros - this.distanciaAnteriorParaHidratacao;
    if (distanciaIncremental > 0) {
      dehydrationRate += distanciaIncremental * 0.05;
      this.distanciaAnteriorParaHidratacao = this.distanciaTotalMetros;
    }
    this.hydrationLevel -= dehydrationRate;
    if (this.hydrationLevel < 0) this.hydrationLevel = 0;
  }

  formatarDistancia(): string {
    const metros = this.distanciaTotalMetros;
    return metros < 1000 ? metros.toFixed(1) + ' m' : (metros/1000).toFixed(2) + ' km';
  }

  iniciarCaminhada() {
    this.rastreamentoAtivo = true;
    this.startPedometer();
    this.startTrackingDistance();
    this.status = 'Rastreamento iniciado ✅';
  }

  pararCaminhada() {
    this.rastreamentoAtivo = false;
    this.stopTrackingDistance();
    this.status = 'Rastreamento parado ⏹️';
  }
}

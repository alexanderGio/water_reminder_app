import { Component, OnInit } from '@angular/core';
import { IonicModule, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    HttpClientModule
  ]
})
export class HomePage implements OnInit {

  // === Variáveis principais ===
  latitude: number | null = null;
  longitude: number | null = null;
  temperatura: number | null = null;
  walkingSpeed: number = 0;
  hydrationLevel: number = 100;       // Barra de desidratação (de 0 a 100)
  consumoPercentual: number = 0;      // Barra de consumo de água (de 0 a 100)
  status: string = 'Obtendo localização...';

  // === Variáveis do usuário ===
  peso: number | null = null;
  altura: number | null = null;
  necessidadeAguaML: number = 0;      // Ex: 2450 ml (meta diária)
  consumoTotal: number = 0;            // ml já ingeridos
  showDrinkOptions: boolean = false;
  parabenizouHoje: boolean = false;

  constructor(
    private http: HttpClient,
    private alertController: AlertController
  ) {}

  // === Início da aplicação ===
  ngOnInit() {
    this.mostrarAlertaPesoAltura();
    this.getLocalizacaoEClima();
    this.monitorarMovimento();
  }

  // === ALERT para peso/altura ===
  async mostrarAlertaPesoAltura() {
    const alert = await this.alertController.create({
      header: 'Informações Pessoais',
      subHeader: 'Preencha para calcular sua hidratação ideal',
      inputs: [
        {
          name: 'peso',
          type: 'number',
          placeholder: 'Peso em kg',
          min: 1,
          max: 500
        },
        {
          name: 'altura',
          type: 'number',
          placeholder: 'Altura em cm',
          min: 50,
          max: 300
        }
      ],
      buttons: [
        {
          text: 'Confirmar',
          handler: data => {
            this.peso = parseFloat(data.peso);
            this.altura = parseFloat(data.altura);

            if (!this.peso || this.peso <= 0 || !this.altura || this.altura <= 0) {
              this.status = 'Peso ou altura inválidos.';
              return false; // Impede o fechamento do alerta até corrigir
            }

            this.calcularNecessidadeAgua();
            return true;
          }
        }
      ],
      backdropDismiss: false
    });

    await alert.present();
  }

  // === Cálculo da necessidade de água (em ml) ===
  calcularNecessidadeAgua() {
    this.necessidadeAguaML = this.peso! * 35;
    this.hydrationLevel = 100;
    this.consumoTotal = 0;
    this.consumoPercentual = 0;
    this.parabenizouHoje = false;
    this.status = `Você precisa beber ${this.necessidadeAguaML} ml de água por dia.`;
  }

  // === Botão "Beber" ===
  beber(volume: number) {
    if (!this.necessidadeAguaML) return;

    this.consumoTotal += volume;
    this.consumoPercentual = (this.consumoTotal / this.necessidadeAguaML) * 100;

    if (this.consumoPercentual > 100) {
      this.consumoPercentual = 100;
    }

    this.showDrinkOptions = false;

    if (this.consumoPercentual >= 100 && !this.parabenizouHoje) {
      this.parabenizarUsuario();
      this.parabenizouHoje = true;
    }
  }

  // === Alterna exibição do botão "Beber" ===
  toggleDrinkOptions() {
    this.showDrinkOptions = !this.showDrinkOptions;
  }

  // === Localização + clima ===
  getLocalizacaoEClima() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;

          this.status = `Localização: (${this.latitude.toFixed(4)}, ${this.longitude.toFixed(4)})`;
          this.getTemperaturaAtual();
        },
        (error) => {
          this.status = 'Permissão de localização negada.';
        }
      );
    } else {
      this.status = 'Geolocalização não suportada neste navegador.';
    }
  }

  // === Chamada à API de clima ===
  getTemperaturaAtual() {
    if (this.latitude === null || this.longitude === null) {
      this.status = 'Coordenadas inválidas.';
      return;
    }

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${this.latitude}&longitude=${this.longitude}&current_weather=true`;

    this.http.get<any>(url).subscribe({
      next: (data) => {
        this.temperatura = data?.current_weather?.temperature ?? null;

        if (this.temperatura === null) {
          this.status = 'Dados climáticos não disponíveis.';
        } else {
          this.status = `Temperatura atual: ${this.temperatura}°C`;
        }

        this.atualizarHidratação();
      },
      error: (error) => {
        console.error(error);
        this.status = 'Erro ao obter dados climáticos.';
      }
    });
  }

  // === Monitoramento contínuo do movimento ===
  monitorarMovimento() {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          this.walkingSpeed = position.coords.speed ?? 0;
          this.atualizarHidratação();
        },
        (error) => {
          console.error('Erro ao monitorar o movimento', error);
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
      );
    }
  }

  // === Atualiza a hidratação com base em movimento e calor ===
  atualizarHidratação() {
    if (this.temperatura === null) return;

    let dehydrationRate: number = 0.1;

    if (this.temperatura > 30) {
      dehydrationRate += (this.temperatura - 30) * 0.05;
    }

    dehydrationRate += this.walkingSpeed * 0.1;

    this.hydrationLevel -= dehydrationRate;

    if (this.hydrationLevel < 0) {
      this.hydrationLevel = 0;
    }
  }

  // === Parabeniza usuário ao atingir meta ===
  async parabenizarUsuario() {
    const alert = await this.alertController.create({
      header: 'Parabéns! 🎉',
      message: 'Você atingiu sua meta diária de hidratação! Continue assim! 💧',
      buttons: ['OK']
    });

    await alert.present();
  }
}
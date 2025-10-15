import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { UserDataService } from '../../services/data.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-agua-diaria',
  templateUrl: './agua-diaria.component.html',
  styleUrls: ['./agua-diaria.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class AguaDiariaComponent {
  private userDataService = inject(UserDataService);
  private destroy$ = new Subject<void>();

  qntdDiariaLitro: number | null = null; // valor que será exibido no template

  constructor() {
    this.userDataService.userData$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        if (!user) return;

        // multiplicadores
        const genMult = user.genero === 'feminino' ? 1 : 1.08;
        let idadeMult = 1;

        if (user.idade <= 12) {//crianla
          idadeMult = 1.10;
        } else if (user.idade >= 13 && user.idade < 55) { //normaçl
          idadeMult = 1;
        } else {
          idadeMult = 0.95;//velhos
        }

        let atvMult = 1;
        if (user.atividade === 'pouca') {
          atvMult = 1;
        } else if (user.atividade === 'muita') {
          atvMult = 1.30;
        } else {
          atvMult = 1.15;
        }

        //contas finais
        const baseMl = user.peso * 35;
        const qntdDiaria = baseMl * genMult * idadeMult * atvMult;
        this.qntdDiariaLitro = qntdDiaria / 1000;
      });
  }

}

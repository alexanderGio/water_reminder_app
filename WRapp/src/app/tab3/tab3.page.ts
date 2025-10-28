import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { UserDataService, UserData } from '../services/data.service'; // ajuste o caminho se necessário
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab3',
  styleUrls: ['./tab3.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
  template: `
    <ion-content class="ion-padding">
    <div class="container">
      <ng-container *ngIf="userData; else noUser">
         <img src="assets/perfil.jpg" alt="Foto de perfil" class="perfil-img">
        <h2>Olá, {{ userData.nome }}!</h2>
        <p class="id"><strong>ID do usuário:</strong> {{ userId }}</p>
        <button type="button" (click)="logoutButton()">Logout</button>
      </ng-container>
    </div>

      <ng-template #noUser>
        <p>Nenhum usuário autenticado.</p>
      </ng-template>
    </ion-content>
  `,
})
export class Tab3Page implements OnInit {
  private userDataService = inject(UserDataService);
  private auth = inject(AuthService);
  private router = inject(Router);

  userData: UserData | null = null;
  userId: string | null = null;

  ngOnInit() {
    // Observa o id
    this.userDataService.userId$
      .subscribe(id => {
        this.userId = id;
      });

    // Observando os dados do usuário
    this.userDataService.userData$.subscribe((data) => {
      this.userData = data;
    });
  }

  async logoutButton() {
    try {
      await this.auth.logout();
      this.router.navigate(['/login'])
    } catch (err:any) {

    }
  }
}

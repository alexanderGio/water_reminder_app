import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
@Component({
  selector: 'app-agua-diaria',
  templateUrl: './agua-diaria.component.html',
  styleUrls: ['./agua-diaria.component.scss'],
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class AguaDiariaComponent {
  @Input() qntd_diaria = 0;
}
 
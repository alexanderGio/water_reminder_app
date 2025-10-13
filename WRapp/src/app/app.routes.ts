import { Routes } from '@angular/router';
import {LoginPage} from './pages/login/login.page';
import {RegisterPage} from './pages/register/register.page';
import {Tab1Page} from './tab1/tab1.page';
import {QuestPage} from './pages/quest/quest.page';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginPage },
  { path: 'register', component: RegisterPage },
  { path: 'Tab1Page', component:Tab1Page},
  { path: 'QuestPage', component:QuestPage},
];

import { Routes } from '@angular/router';
import {LoginPage} from './pages/login/login.page';
import {RegisterPage} from './pages/register/register.page';
//import {Tab1Page} from './tab1/tab1.page';
import {QuestPage} from './pages/quest/quest.page';
//import { Tab2Page } from './tab2/tab2.page';
//import { Tab3Page } from './tab3/tab3.page';
import { TabsPage } from './tabs/tabs.page';

export const routes: Routes = [
 //soltas
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginPage },
  { path: 'register', component: RegisterPage },
  { path: 'QuestPage', component:QuestPage},

// barra de navegação
{
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full',
  },
  {
    path: 'tabs',
    component: TabsPage, // o container com o ion-tabs
    children: [
      {
        path: 'tab1',
        loadComponent: () =>
          import('./tab1/tab1.page').then((m) => m.Tab1Page),
      },
      {
        path: 'tab2',
        loadComponent: () =>
          import('./tab2/tab2.page').then((m) => m.Tab2Page),
      },
      {
        path: 'tab3',
        loadComponent: () =>
          import('./tab3/tab3.page').then((m) => m.Tab3Page),
      },
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full',
      },
    ],
  },
];



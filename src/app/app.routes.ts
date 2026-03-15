import { Routes } from '@angular/router';
import { Landing } from './landing/landing';
import { Dashboard } from './dashboard/dashboard';
import { LearnBengali } from './learn-bengali/learn-bengali';
import { Tetris } from './tetris/tetris';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'dashboard', component: Dashboard },
  { path: 'learn-bengali', component: LearnBengali },
  { path: 'tetris', component: Tetris },
  { path: '**', redirectTo: '' }
];

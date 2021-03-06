import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'splashAnimation', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'auth', loadChildren: './auth/auth.module#AuthPageModule' },
  { path: 'splashAnimation', loadChildren: './splash-animation/splash-animation.module#SplashAnimationPageModule' },
  { path: '**', redirectTo: 'home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }

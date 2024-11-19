import { Routes } from '@angular/router';
import { HomeComponent } from './shared/home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ProfileComponent } from './user/profile/profile.component';
import { CreateAdComponent } from './ads/create-ad/create-ad.component';
import { AdsViewComponent } from './ads/ads-view/ads-view.component';

export const routes: Routes = [
    {path: '', redirectTo: "/home",pathMatch: 'full'},
    {path: "home", component: HomeComponent},
    {path: "login", component: LoginComponent},
    {path: "register", component: RegisterComponent},
    {path: "profile", component: ProfileComponent},
    {path: 'create-ad', component: CreateAdComponent },
    {path: 'ads-view', component: AdsViewComponent},
];

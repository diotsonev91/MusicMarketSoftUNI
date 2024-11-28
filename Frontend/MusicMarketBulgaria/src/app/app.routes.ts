import { Routes } from '@angular/router';
import { HomeComponent } from './core/home/home.component';
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { ProfileComponent } from './user/profile/profile.component';
import { CreateAdComponent } from './ads/create-ad/create-ad.component';
import { AdsViewComponent } from './ads/ads-view/ads-view.component';
import { AdDetailsComponent } from './ads/ad-details/ad-details.component';
import { EditUserComponent } from './user/edit-user/edit-user.component';
import { EditAdComponent } from './ads/edit-ad/edit-ad.component';

export const routes: Routes = [
    {path: '', redirectTo: "/home",pathMatch: 'full'},
    {path: "home", component: HomeComponent},
    {path: "login", component: LoginComponent},
    {path: "register", component: RegisterComponent},
    {path: "edit-profile", component: EditUserComponent},
    {path: "profile", component: ProfileComponent},
    {path: 'create-ad', component: CreateAdComponent },
    {path: 'ads-view', component: AdsViewComponent},
    {path: 'ad-details/:id', component: AdDetailsComponent },
    {path: 'edit-ad/:id', component: EditAdComponent}
];

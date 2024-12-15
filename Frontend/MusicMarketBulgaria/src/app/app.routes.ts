import { Routes } from '@angular/router';
import { HomeComponent } from './core/home/home.component';
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { ProfileComponent } from './user/profile/profile.component';
import { CreateAdComponent } from './ads/create-ad/create-ad.component';
import { AdsViewComponent } from './ads/ads-view/ads-view.component';
import { AdDetailsContainerComponent } from './ads/ad-details/ad-details-container/ad-details-container.component';
import { EditUserComponent } from './user/edit-user/edit-user.component';
import { EditAdComponent } from './ads/edit-ad/edit-ad.component';
import { MessagesComponent } from './chat/messages/messages.component';
import { authGuard } from './auth/guards/auth.guard';

export const routes: Routes = [
    {path: '', redirectTo: "/home",pathMatch: 'full'},
    {path: "home", component: HomeComponent},
    {path: "login", component: LoginComponent},
    {path: "register", component: RegisterComponent},
    {path: "edit-profile", component: EditUserComponent, canActivate: [authGuard]},
    { path: 'profile/:userId', component: ProfileComponent, canActivate: [authGuard] }, // Current user's profile
    { path: 'user/:userId', component: ProfileComponent }, // Public profile
    {path: 'create-ad', component: CreateAdComponent, canActivate: [authGuard] },
    {path: 'ads-view', component: AdsViewComponent},
    {path: 'ad-details/:id', component: AdDetailsContainerComponent },
    {path: 'edit-ad/:id', component: EditAdComponent, canActivate: [authGuard]},
    {path: 'chat', component: MessagesComponent, canActivate: [authGuard]},
    { path: '**', redirectTo: '/home' } // Wildcard route
];

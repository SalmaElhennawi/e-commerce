import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserRegisterComponent } from './user-register/user-register.component';
import { SellerLoginComponent } from './seller-login/seller-login.component';

const routes: Routes = [
  {  
    path: '',  
    component: AuthComponent, 
    children:[  
      { path: 'user-login', component: UserLoginComponent },
      { path: 'user-register', component: UserRegisterComponent },
      { path: 'seller-login', component: SellerLoginComponent },
      { path: '', redirectTo: 'user-login', pathMatch: 'full' }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}

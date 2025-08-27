import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductsComponent } from './products/products.component';
import { OrdersComponent } from './orders/orders.component';
import { UsersComponent } from './users/users.component';
import { MainComponent } from './main/main.component';
import { SellerAuthGuard } from '../guards/seller-auth.guard';
import { PromoCodesComponent } from './promo-codes/promo-codes.component';

const routes: Routes = [
{  path: '',  canActivate: [SellerAuthGuard],component: DashboardComponent, children:[
      {  path: 'main',  component: MainComponent  },
      {  path: 'products',  component: ProductsComponent  },
      {  path: 'promo-codes',  component: PromoCodesComponent  },
      {  path: 'users',  component: UsersComponent  },
      {  path: 'orders',  component: OrdersComponent  },
       { path: '', redirectTo: 'main', pathMatch: 'full' }
  ]}, 
   
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}

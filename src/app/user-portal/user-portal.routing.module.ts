import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserPortalComponent } from './user-portal/user-portal.component';
import { AboutComponent } from './about/about.component';
import { BrandsComponent } from './brands/brands.component';
import { BlogComponent } from './blog/blog.component';
import { ChildrenComponent } from './children/children.component';
import { ContactComponent } from './contact/contact.component';
import { HomeComponent } from './home/home.component';
import { MenComponent } from './men/men.component';
import { NewOffersComponent } from './new-offers/new-offers.component';
import { ProductsComponent } from './products/products.component';
import { WomenComponent } from './women/women.component';
import { CartComponent } from './cart/cart.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { UserAuthGuard } from '../guards/user-auth.guard';
import { SearchComponent } from './search/search.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';

const routes: Routes = [
  {  path: '', component: UserPortalComponent, children:[
  
      {path: '',redirectTo: 'home', pathMatch: 'full'},
      {  path: 'about',  component: AboutComponent  },
      {  path: 'blog',  component: BlogComponent  },
      {  path: 'brands',  component: BrandsComponent  },
      {  path: 'children',  component: ChildrenComponent  },
      {  path: 'contact',  component: ContactComponent  },
      {  path: 'home',  component: HomeComponent  },
      {  path: 'men',  component: MenComponent  },
      {  path: 'new-offers',  component: NewOffersComponent  },
      {  path: 'products',  component: ProductsComponent  },
      {  path: 'women',  component: WomenComponent  },
      { path: 'product-details/:id', component:ProductDetailsComponent},
      { path: 'search/:query', component: SearchComponent },
      {  path: 'cart',  component: CartComponent,  canActivate: [UserAuthGuard]  },
      {  path: 'wishlist',  component: WishlistComponent,  canActivate: [UserAuthGuard]  },
      {  path: 'my-orders',  component: MyOrdersComponent,  canActivate: [UserAuthGuard]  }
  
  ]}, 
   
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserPortalRoutingModule {}

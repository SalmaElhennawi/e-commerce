import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserPortalRoutingModule } from './user-portal.routing.module'; 
import { AboutComponent } from './about/about.component';
import { BlogComponent } from './blog/blog.component';
import { BrandsComponent } from './brands/brands.component';
import { ChildrenComponent } from './children/children.component';
import { ContactComponent } from './contact/contact.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { MenComponent } from './men/men.component';
import { NewOffersComponent } from './new-offers/new-offers.component';
import { ProductsComponent } from './products/products.component';
import { WomenComponent } from './women/women.component';
import { FooterComponent } from './footer/footer.component';
import { UserPortalComponent } from './user-portal/user-portal.component';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { CartComponent } from './cart/cart.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CheckoutComponent } from './checkout/checkout.component';
import { SearchComponent } from './search/search.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [ UserPortalComponent, AboutComponent, BlogComponent, BrandsComponent, 
    ChildrenComponent, ContactComponent, HeaderComponent, HomeComponent, MenComponent,
    NewOffersComponent, ProductsComponent, WomenComponent, FooterComponent, ProductDetailsComponent,
    CartComponent,CheckoutComponent, SearchComponent, WishlistComponent, MyOrdersComponent ],
  imports: [
    CommonModule,
    UserPortalRoutingModule, 
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    MatCardModule,
    TranslateModule,
    // Angular marterial
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatDialogModule,
    MatCardModule,
  ],
  exports: [UserPortalComponent]
})
export class UserPortalModule {}

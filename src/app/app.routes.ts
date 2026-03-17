import { Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page';
import { RegisterComponent } from './components/register/register';
import { LoginComponent } from './components/login/login';
import { DashboardComponent } from './components/dashboard/dashboard';
import { ProductListComponent } from './components/products/product-list';
import { ProductDetailComponent } from './components/products/product-detail';
import { CartComponent } from './components/cart/cart';
import { CheckoutComponent } from './components/checkout/checkout';
import { OrderListComponent } from './components/orders/order-list';
import { OrderDetailComponent } from './components/orders/order-detail/order-detail';
import { authGuard } from './guards/auth.guard';
import { ProfileComponent } from './components/profile/profile';
import { FavoritesComponent } from './components/favorites/favorites';
import { BuyerDashboardComponent } from './components/dashboard/buyer-dashboard';
import { SellerDashboardComponent } from './components/dashboard/seller-dashboard';
import { ProductAddComponent } from './components/products/product-add';
import { ForgotPasswordComponent } from './components/login/forgot-password';
import { ProductEditComponent } from './components/products/product-edit/product-edit';
import { ShipperLoginComponent } from './components/shipper-login/shipper-login';
import { ShipperDashboardComponent } from './components/shipper-dashboard/shipper-dashboard';
import { ShipperRegisterComponent } from './components/shipper-register/shipper-register';
import { ShipperForgotPasswordComponent } from './components/shipper-forgot-password/shipper-forgot-password';
import { ShipperResetPasswordComponent } from './components/shipper-reset-password/shipper-reset-password';
import { WalletComponent } from './components/user/wallet/wallet';
import { ResetPasswordComponent } from './components/reset-password/reset-password';
import { AboutComponent } from './components/about/about';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'about', component: AboutComponent },
  { path: 'shipper-login', component: ShipperLoginComponent },
  { path: 'shipper-register', component: ShipperRegisterComponent },
  { path: 'shipper-dashboard', component: ShipperDashboardComponent },
  { path: 'shipper-forgot-password', component: ShipperForgotPasswordComponent },
  { path: 'shipper-reset-password', component: ShipperResetPasswordComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'buyer-dashboard', component: BuyerDashboardComponent, canActivate: [authGuard] },
  { path: 'seller-dashboard', component: SellerDashboardComponent, canActivate: [authGuard] },
  { path: 'products', component: ProductListComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'cart', component: CartComponent, canActivate: [authGuard] },
  { path: 'checkout', component: CheckoutComponent, canActivate: [authGuard] },
  { path: 'orders', component: OrderListComponent, canActivate: [authGuard] },
  { path: 'orders/:id', component: OrderDetailComponent, canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'favorites', component: FavoritesComponent, canActivate: [authGuard] },
  { path: 'products/new', component: ProductAddComponent, canActivate: [authGuard] },
  { path: 'products/edit/:id', component: ProductEditComponent, canActivate: [authGuard] },
  { path: 'wallet', component: WalletComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];

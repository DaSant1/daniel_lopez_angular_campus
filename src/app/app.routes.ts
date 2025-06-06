import { Routes } from '@angular/router';
import { productRoutes } from './ui/products/product.routes';

export const routes: Routes = [
  {
    path: 'products',
    children:productRoutes
  },
  {path:'',redirectTo:'products',pathMatch:'full'},
  {path: '**', redirectTo: 'products' }
];

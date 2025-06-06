import { Routes } from "@angular/router";

export const productRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/list.component').then(m => m.ListComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./upsert/upsert.component').then(m => m.UpsertComponent)
  },
  {
    path: ':action/:id',
    loadComponent: () => import('./upsert/upsert.component').then(m => m.UpsertComponent)
  },
  {path: '**', redirectTo: 'products' }
]

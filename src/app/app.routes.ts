import { Routes } from '@angular/router';
import { Catalogo } from './components/catalogo/catalogo';
import { Form } from './components/form/form';
import { Detalles } from './components/detalles/detalles';

export const routes: Routes = [
  { path: '', redirectTo: 'catalogo', pathMatch: 'full' },
  { path: 'catalogo', component: Catalogo },
  { path: 'agregar', component: Form },
  { path: 'detalle/:id', component: Detalles },
  { path: '**', redirectTo: 'catalogo' },
];

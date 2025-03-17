// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { RegistrationComponent } from './registration/registration.component';
import { ExcelOperationsComponent } from './excel-operations.component';

export const routes: Routes = [
  { path: '', component: RegistrationComponent },
  { path: 'excel', component: ExcelOperationsComponent },
  { path: '**', redirectTo: '' }
];
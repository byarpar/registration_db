import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from './registration/registration.component';
import { ExcelOperationsComponent } from './excel-operations.component';


const routes: Routes = [
  { path: '', component: RegistrationComponent },
  { path: 'excel', component: ExcelOperationsComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
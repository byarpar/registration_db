import { NgModule } from "@angular/core"
import { RouterModule, type Routes } from "@angular/router"
import { RegistrationComponent } from "./registration/registration.component"

const routes: Routes = [
  { path: "", component: RegistrationComponent },
  { path: "**", redirectTo: "" },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}


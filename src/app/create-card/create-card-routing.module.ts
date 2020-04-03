import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateCardComponent } from './create-card.component';
import { AuthGuard } from '@app/core/auth-guard/auth.guard';


const routes: Routes = [
  { path: '', component: CreateCardComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateCardRoutingModule { }

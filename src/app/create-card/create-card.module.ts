import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { CreateCardRoutingModule } from './create-card-routing.module';
import { CreateCardComponent } from './create-card.component';


@NgModule({
  declarations: [CreateCardComponent],
  imports: [
    CommonModule,
    CreateCardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule
  ]
})
export class CreateCardModule { }

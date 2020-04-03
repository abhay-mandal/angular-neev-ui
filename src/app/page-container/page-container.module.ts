import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { PageContainerRoutingModule } from './page-container-routing.module';
import { PageContainerComponent } from './page-container.component';
import { SharedModule } from '@app/shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UpdateCardComponent } from '@app/update-card/update-card.component';
import { UploadFileComponent } from '@app/upload-file/upload-file.component';

@NgModule({
  declarations: [
    PageContainerComponent,
    UpdateCardComponent,
    UploadFileComponent
  ],
  imports: [
    CommonModule,
    PageContainerRoutingModule,
    TranslateModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ],
  entryComponents: [UpdateCardComponent],
})
export class PageContainerModule { }

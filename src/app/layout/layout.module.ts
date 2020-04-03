import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { LayoutRoutingModule } from './layout-routing.module';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { DefaultLayoutComponent } from './default-layout/default-layout.component';
import { CatalogComponent } from './catalog/catalog.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AvatarModule } from 'ngx-avatar';
import { ClickEventDirective } from '@app/core/directives/click-event.directive';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    MainLayoutComponent,
    FooterComponent,
    HeaderComponent,
    DefaultLayoutComponent,
    CatalogComponent,
    ClickEventDirective
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    FormsModule,
    TranslateModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    AvatarModule,
    NgbModule
  ]
})
export class LayoutModule { }

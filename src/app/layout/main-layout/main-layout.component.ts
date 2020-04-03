import { Component, OnInit } from '@angular/core';
import { CatalogService } from '@app/core/services/catalog.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {

  constructor(
    public catalogServ: CatalogService
  ) {
  }

  ngOnInit() {
  }

}

import { Component, OnInit } from '@angular/core';
import { MyMenuService } from '../core/services/my-menu.service';
import { AppConstants } from '@app/app.constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-menu',
  templateUrl: './my-menu.component.html',
  styleUrls: ['./my-menu.component.scss']
})
export class MyMenuComponent implements OnInit {

  menuCategory: object[];

  constructor(
    private myMenuService: MyMenuService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.getAllMenuCategory();
  }


  getAllMenuCategory() {
    this.myMenuService.getAllMenuCategory()
      .subscribe(response => {
        if (response.body.httpStatus === AppConstants.STATUS_CODES.SUCCESS) {
          this.menuCategory = response.body.payload;
        }
      });
  }

  // Redirection to menu component
  editMyMenu() {
    this.router.navigate([AppConstants.APP_URLS.MENU]);
  }

}

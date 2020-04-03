import { Component, OnInit } from '@angular/core';
import { DataService } from '@app/core/services/data.service';
import { MyMenuService } from '@app/core/services/my-menu.service';
import { Router } from '@angular/router';
import { AppConstants } from '@app/app.constants';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@app/core/services/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  menuCatName: FormControl = new FormControl('', [Validators.required]);
  menuModalRef: any;
  categoryModalRef: any;
  menuItem: object[];
  menuCategory: object[] = [];
  selectedMenuCategory: string[] = [];
  menuForm: FormGroup;
  ownedCategory: object[] = [];
  CONSTANTS: any = { OWNED: 'owned' };
  userDetails: any = { userId: '' };

  constructor(
    private modalService: NgbModal,
    private dataService: DataService,
    private myMenuService: MyMenuService,
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.userDetails.userId = this.authService.getLoggedInUserDetails().email;
    this.dataService.menuCategory.subscribe((category) => {
      if (category.length) {
        this.menuCategory = category;
        this.filterOwnedCategory(category);
      }
    });

    if (!this.menuCategory.length) {
      this.getEditMenu();
    }
    this.createMenuForm();
  }

  // Filter the category based on userId (Created userId)
  filterOwnedCategory(category) {
    this.ownedCategory = category.filter((cat) => cat.userId == this.userDetails.userId);
  }

  createMenuForm(): void {
    this.menuForm = this.formBuilder.group({
      menuItemName: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      menuItemContent: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      menuItemDesc: new FormControl('', [Validators.maxLength(100)]),
    });
  }

  // convenience getter for easy access to form fields
  get menuF() { return this.menuForm.controls; }

  getEditMenu() {
    this.myMenuService.editMenu()
      .subscribe(response => {
        if (response.body.httpStatus === AppConstants.STATUS_CODES.SUCCESS) {
          this.dataService.updateObservableAarrayObject(response.body.payload, 'menuCategory');
        }
      });
  }

  openCreateMenuModal(createMenuModalContent) {
    this.menuModalRef = this.modalService.open(createMenuModalContent, { windowClass: 'menu-item-modal', backdrop: 'static' });
  }

  createMenu() {
    const payload = { menuItemName: '', menuItemContent: '', menuItemDesc: '' };
    payload.menuItemName = this.menuF.menuItemName.value;
    payload.menuItemContent = this.menuF.menuItemContent.value;
    payload.menuItemDesc = this.menuF.menuItemDesc.value;
    this.myMenuService.createMenu(payload)
      .subscribe(response => {
        if (response.httpStatus === AppConstants.STATUS_CODES.SUCCESS) {
          this.dataService.addElementToObservableArray(response.payload, 'menuItem');
          this.linkMenuItem(response.payload.menuItemId);
        }
      });
  }

  addNewCategory(createMenuCatModalContent) {
    this.openCreateMenuCategoryModal(createMenuCatModalContent);
  }

  openCreateMenuCategoryModal(createMenuCatModalContent) {
    this.categoryModalRef = this.modalService.open(createMenuCatModalContent, { windowClass: 'menu-cat-modal', backdrop: 'static' });
  }

  // Event emitter from Multi select comp
  addMenuCategory(event: object) {
    this.selectedMenuCategory.push(event['menuCategoryId']);
  }

  // Event emitter from Multi select comp
  removeMenuCategory(event: object) {
    const filteredArr = this.selectedMenuCategory.filter(obj => obj !== event['menuCategoryId']);
    this.selectedMenuCategory = [...filteredArr];
  }

  // Event emitter from Multi select comp
  addAllMenuCategory(event: any[]) {
    if (event.length) {
      const filteredArr = event.map(obj => obj['menuCategoryId']);
      this.selectedMenuCategory = [...filteredArr];
    } else {
      this.selectedMenuCategory = [];
    }
  }

  createMenuCategory() {
    const payload = { menuCategoryName: '', linkedMenuItemIds: [] };
    payload.menuCategoryName = this.menuCatName.value;
    this.myMenuService.createMenuCategory(payload)
      .subscribe(response => {
        if (response.httpStatus === AppConstants.STATUS_CODES.SUCCESS) {
          this.dataService.addElementToObservableArray(response.payload, 'menuCategory');
          this.menuCatName.reset();
          this.categoryModalRef.close();
        }
      });
  }

  goBackToMyMenu() {
    this.router.navigate([AppConstants.APP_URLS.MY_MENU]);
  }

  linkMenuItem(menuItemId) {
    const payload = { menuCategoryId: [], menuItemId: null };
    payload.menuCategoryId = this.selectedMenuCategory;
    payload.menuItemId = menuItemId;
    this.myMenuService.linkMenuItem(payload)
      .subscribe(response => {
        if (response.body.httpStatus === AppConstants.STATUS_CODES.SUCCESS) {
          this.dataService.addMenuItemInLinkedMenu(response.body.payload, 'linkedMenuItems', 'menuCategoryId');
          this.menuForm.reset();
          this.selectedMenuCategory = [];
          this.menuModalRef.close();
        }
      });
  }

  addMenuItem(menuCategoryId, menuItemId, userId) {
    const payload = { menuCategoryId: [], menuItemId };
    payload.menuCategoryId.push(menuCategoryId);
    if (userId == this.userDetails.userId) {
      this.myMenuService.linkMenuItem(payload)
        .subscribe(response => {
          if (response.body.httpStatus === AppConstants.STATUS_CODES.SUCCESS) {
            this.dataService.replaceMenuItemInLinkedMenu(response.body.payload, 'menuCategoryId');
          }
        });
    } else {
      this.myMenuService.addMenuItem(payload)
        .subscribe(response => {
          if (response.body.httpStatus === AppConstants.STATUS_CODES.SUCCESS) {
            this.dataService.replaceMenuItemInLinkedMenu(response.body.payload, 'menuCategoryId', 'masterCategoryId');
          }
        });
    }
  }

  removeItemFromCategory(menuCategoryId, menuItemId, userId) {
    const payload = { menuCategoryId: [], menuItemId };
    payload.menuCategoryId.push(menuCategoryId);
    if (userId == this.userDetails.userId) {
      this.myMenuService.unLinkMenuItem(payload)
        .subscribe(response => {
          if (response.body.httpStatus === AppConstants.STATUS_CODES.SUCCESS) {
            this.dataService.replaceMenuItemInLinkedMenu(response.body.payload, 'menuCategoryId');
          }
        });
    } else {
      this.myMenuService.removeMenuItem(payload)
        .subscribe(response => {
          if (response.body.httpStatus === AppConstants.STATUS_CODES.SUCCESS) {
            this.dataService.replaceMenuItemInLinkedMenu(response.body.payload, 'menuCategoryId', 'masterCategoryId');
          }
        });
    }
  }

}

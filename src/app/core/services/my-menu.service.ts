import { Injectable } from '@angular/core';
import { MypageService } from '@app/core/services/mypage.service';
import { AppConstants } from '@app/app.constants';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MyMenuService {

  constructor(private mypageService: MypageService) { }

  getAllMenuCategory() {
    return this.mypageService.get(AppConstants.API_ENDPOINTS.GET_ALL_MENU_CAT);
  }

  createMenuCategory(payload) {
    return this.mypageService.post(AppConstants.API_ENDPOINTS.MENU_CATEGORY, payload);
  }

  createMenu(payload) {
    return this.mypageService.post(AppConstants.API_ENDPOINTS.MENU_ITEM, payload);
  }

  getAllMenuItem() {
    return this.mypageService.get(AppConstants.API_ENDPOINTS.GET_ALL_MENU_ITEM);
  }

  getMenuCategory(menuCategoryId) {
    const params = new HttpParams().set('menuCategoryId', menuCategoryId);
    return this.mypageService.get(AppConstants.API_ENDPOINTS.MENU_CATEGORY, params);
  }

  linkMenuItem(payload) {
    return this.mypageService.put(AppConstants.API_ENDPOINTS.LINK_MENU_ITEM, payload);
  }

  addMenuItem(payload) {
    return this.mypageService.put(AppConstants.API_ENDPOINTS.ADD_MENU_ITEM, payload);
  }

  unLinkMenuItem(payload) {
    return this.mypageService.put(AppConstants.API_ENDPOINTS.UN_LINK_MENU_ITEM, payload);
  }

  removeMenuItem(payload) {
    return this.mypageService.put(AppConstants.API_ENDPOINTS.REMOVE_MENU_ITEM, payload);
  }

  editMenu() {
    return this.mypageService.get(AppConstants.API_ENDPOINTS.EDIT_MENU);
  }

}

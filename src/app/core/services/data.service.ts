import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { take } from 'rxjs/operators';

/**
 * This service class helps to save to store data temporary and can be accessed across application. 
 * Data in this class gets reset on refresh of application (Refresh of browser).
 */
@Injectable({
  providedIn: 'root'
})
export class DataService {
  private decodedToken = '';
  public cards = new BehaviorSubject<any[]>([]);
  public linkedCards = new BehaviorSubject<any[]>([]);
  public pageId = new BehaviorSubject<string>('');
  public pages = new BehaviorSubject<any[]>([]);
  public notificationObj = new BehaviorSubject<any[]>([]);
  private IsInterval = true;
  public readOnly = new BehaviorSubject<boolean>(false);
  public menuItem = new BehaviorSubject<any[]>([]);
  public menuCategory = new BehaviorSubject<any[]>([]);

  constructor() { }

  setDecodedToken(token) {
    this.decodedToken = token;
  }

  getDecodedToken() {
    return this.decodedToken;
  }

  reset() {
    this.decodedToken = '';
  }

  getMenuCategory() {
    return this.menuCategory.asObservable();
  }

  /*
  data : is an array of object value
  key : is the object name where to sets data object
  */
  updateObservableAarrayObject(data, key) {
    this[key].next(data);
  }

  /*
  data : is a single element value
  key : is the observable object key in which to push data
  */
  addElementToObservableArray(item, key) {
    const array: Observable<any[]> = this[key].asObservable();
    array.pipe(take(1)).subscribe(val => {
      this[key].next([...val, item]);
    });
  }

  /*
  data : is a single element value
  key : is the observable object key in which to push data
  idKey: is the key name of id by which comparison happens
  */
  updateElementToObservableArray(data: any, key: string, idKey: string) {
    const array: Observable<any[]> = this[key].asObservable();
    array.pipe(take(1)).subscribe(val => {
      const index = val.findIndex((obj) => obj[idKey] === data[idKey]);
      val[index] = data;
      this[key].next([...val]);
    });
  }

  /*
  data : is a single element value
  key : is the observable aray name in which data stores
  eleKey : is the observable object name in which to push data
  */
  updateElementToObservableArrayOfArray(data: any, key: string, eleKey: string, id?: string) {
    const array: Observable<any[]> = this[key].asObservable();
    array.pipe(take(1)).subscribe(val => {
      const index = val.findIndex((obj) => obj[id] === data[id]);
      val[index][eleKey] = data[eleKey];
      this[key].next([...val]);
    });
  }

  /*
  data : is a single element value
  idKey: is the id by which comparison happen
  aliasIdKey: is the optioanl id by which comparison happen if present
  */
  addMenuItemInLinkedMenu(data: any, eleKey: string, idKey: string, aliasIdKey?: string) {
    const array: Observable<any[]> = this.menuCategory.asObservable();
    array.pipe(take(1)).subscribe(val => {
      data.forEach(element => {
        let index = 0;
        if (aliasIdKey) {
          index = val.findIndex((obj) => obj[idKey] === element[aliasIdKey]);
        } else {
          index = val.findIndex((obj) => obj[idKey] === element[idKey]);
        }
        if (!val[index].linkedMenuItems) {
          val[index].linkedMenuItems = [];
        }
        val[index].linkedMenuItems.push(...element.linkedMenuItems);
      });
      this.menuCategory.next([...val]);
    });
  }

  /*
  data : is an array of element
  idKey: is the id by which comparison happen
  aliasIdKey: is the optioanl id by which comparison happen if present
  */
  replaceMenuItemInLinkedMenu(data: any, idKey: string, aliasIdKey?: string) {
    const array: Observable<any[]> = this.menuCategory.asObservable();
    array.pipe(take(1)).subscribe(val => {
      data.forEach(element => {
        let index = 0;
        if (aliasIdKey) {
          index = val.findIndex((obj) => obj[idKey] === element[aliasIdKey]);
        } else {
          index = val.findIndex((obj) => obj[idKey] === element[idKey]);
        }

        let itemIndex = 0;
        element.linkedMenuItems.forEach(elem => {
          itemIndex = val[index].linkedMenuItems.findIndex((childObj) => childObj.menuItemId === elem.menuItemId);
        });
        val[index].linkedMenuItems.splice(itemIndex, 1, ...element.linkedMenuItems);
      });
      this.menuCategory.next([...val]);
    });
  }

  /*
  id : is an element id
  key : is the object name from where to delete data
  */
  deleteArrayObjectById(id: string, key: string, idKey: string) {
    const array: Observable<any[]> = this[key].asObservable();
    array.pipe(take(1)).subscribe(val => {
      const index = val.findIndex((obj) => obj[idKey] === id);
      val.splice(index, 1);
      this[key].next([...val]);
    });
  }

  setIsInterval(value) {
    this.IsInterval = value;
  }

  getIsInterval() {
    return this.IsInterval;
  }

}

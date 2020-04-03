import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-multi-select-dropdown',
  templateUrl: './multi-select-dropdown.component.html',
  styleUrls: ['./multi-select-dropdown.component.scss']
})
export class MultiSelectDropdownComponent implements OnInit {
  @Input() multiSelect: boolean;
  @Input() multiDropdownList: object[] = [];
  @Input() multiSelectedItems: object[] = [];
  @Output() addDataByKey: EventEmitter<any> = new EventEmitter();
  @Output() removeDataByKey: EventEmitter<any> = new EventEmitter();
  @Output() selectAllData: EventEmitter<any> = new EventEmitter();

  multiDropdownSettings = {};
  keysName: object = {};
  data: any[];

  constructor() { }

  ngOnInit() {
    if (this.multiDropdownList.length) {
      const index = [this.multiDropdownList].length - 1;
      this.keysName = Object.keys(this.multiDropdownList[index]);
      this.multiDropdownSettings = {
        singleSelection: false,
        idField: this.keysName[0],
        textField: this.keysName[1],
        allowSearchFilter: true,
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 2,
      };
    }
  }

  onItemSelect(item: string) {
    this.addDataByKey.emit(item);
  }

  onItemDeSelect(item: any) {
    this.removeDataByKey.emit(item);
  }

  onSelectAll(items: any) {
    this.selectAllData.emit(items);
  }

  onDeSelectAll(items: any) {
    this.selectAllData.emit([]);
  }

}

import { Component, OnInit } from '@angular/core';
import { HeaderService } from './header.service';
import { AppConstants } from '@app/app.constants';
import { DataService } from '@app/core/services/data.service';
import { AuthService } from '@app/core/services/auth.service';
import { HttpParams } from '@angular/common/http';
import { NotificationsService } from '@app/core/services/notifications.service'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  avatarObj: any = {};
  pages: any = [];
  userDetails: object = {};
  notificationObjArray: any = [];

  constructor(private authService: AuthService, private headerService: HeaderService,
    private dataService: DataService, private notificationsService: NotificationsService) {
  }

  ngOnInit() {
    this.userDetails['userId'] = this.authService.getLoggedInUserDetails()['email'];
    this.userDetails['userName'] = this.authService.getLoggedInUserDetails()['name'];
    this.getAllPages();
    this.avatarObj['name'] = this.userDetails['userName'];
    this.dataService.pages.subscribe((pages) => {
      this.pages = pages;
    });
    this.notificationsService.initialize();
    this.dataService.notificationObj.subscribe((data) => {
      if (data && Object.keys(data).length) {
        this.notificationObjArray.push(data);
      }
    });
  }

  logOut() {
    this.notificationsService.disconnect();
    this.authService.logOut();
  }

  redirectToHome() {
    this.authService.redirectToHome();
  }

  getAllPages() {
    const params = new HttpParams().set('userId', this.userDetails['userId']);
    this.headerService.getAllPages(params).subscribe(data => {
      if (data.status === AppConstants.STATUS_CODES.SUCCESS) {
        this.dataService.updateObservableAarrayObject(data.body.payload, 'pages');
      }
    }, err => {
      this.pages = [];
    });
  }

  redirectByPageId(pageId) {
    this.headerService.redirectByPageId(pageId);
  }

  readNotification(message){
    if( message.id ) {
      this.headerService.readMessage(message.id).subscribe(data => {
        if (data.status === AppConstants.STATUS_CODES.SUCCESS) {}
      }, err => {});
    }
  }
}
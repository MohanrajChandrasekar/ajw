import { Component, OnInit } from '@angular/core';
import { NavService } from './services/navListService/nav.service';
import { AuthService } from './login/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  header: string;
  navInfo: any = [];

  constructor(private authService: AuthService, private navService: NavService
  ) {
  }

  ngOnInit() {
    this.fetchData();
    localStorage.removeItem('login_status')
  }
  
  fetchData() {
    this.navService.getNavigationListByLoginId(this.userName).then(res => {
      this.navInfo = res;
    }, err => { throw err; })
  }
  get userName(): string {
    var _user = this.authService.currentUser();
    if (_user != undefined && _user != null) {
      return this.authService.currentUser().userName;
    }
    return '';
  }
} 
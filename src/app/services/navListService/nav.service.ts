import {EventEmitter, Injectable} from '@angular/core';
import {Event, NavigationEnd, Router} from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { environment } from '../../../environments/environment';
import {BehaviorSubject} from 'rxjs';

@Injectable()
export class NavService {
  public appDrawer: any;
  public currentUrl = new BehaviorSubject<string>(undefined);
  _userNavlist : any[]= [];

  public apiUrl = environment.apiUrl+'/navigationList';
  constructor(private http: HttpClient,private router:Router) { 
  this.router.events.subscribe((event: Event) => {
    if (event instanceof NavigationEnd) {
      this.currentUrl.next(event.urlAfterRedirects);
    }
  },
  err => {
    throw err;
  });
}
  public closeNav() {
    this.appDrawer.close();
  }

  public openNav() {
    this.appDrawer.open();
  }
  
  getAllNavigationList(): any {
    return this.http.get<any>(this.apiUrl).toPromise();
  }
  getNavigationListByLoginId(loginId):any{
    return this.http.get<any>(this.apiUrl+ '/'+loginId).toPromise();
  }
  userNavlist(): any[] {
    return  this._userNavlist;
}

}
 
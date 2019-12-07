import { Component, ViewChild, ElementRef, ViewEncapsulation, AfterViewInit, OnChanges } from '@angular/core';
import { VERSION, MatDialogConfig, MatDialog } from '@angular/material';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NavService } from '../services/navListService/nav.service';
import { AuthService } from '../login/auth.service';
import { User } from '../admin/user/user';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { UsersService } from '../services/Master/usersService/users.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, OnDestroy } from '@angular/core';
import { UserService} from '../services/users/users.service';
import { Globals } from '../global';
import { PasswordComponent } from '../admin/password/password.component';

@Component({
    selector: 'app-nav',
    templateUrl: './app-nav.component.html',
    styleUrls: ['./app-nav.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AppNavComponent implements AfterViewInit {
    navInfo: any = [];
    temp: any = [];
    user: User = new User();
    
    // loginStatus: String = "false"; 
    @ViewChild('appDrawer') appDrawer: ElementRef;

    private _mobileQueryListener: () => void;

    ngAfterViewInit() {
        this.navService.appDrawer = this.appDrawer;
    }
    version = VERSION;

    isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
        map(result => result.matches)
    );

    mobileQuery: MediaQueryList;

    constructor(private breakpointObserver: BreakpointObserver,
        private navService: NavService,
        private dialog: MatDialog, 
        private authService: AuthService,
        private router: Router, 
        changeDetectorRef: ChangeDetectorRef,
        media: MediaMatcher) {
        this.mobileQuery = media.matchMedia('(max-width: 600px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
    }

    ngOnInit() {
        this.fetchData();
    }

    openDialog() {
        // var useInfo = this.userInfo.filter(ur => ur.id === id)
        // this.user = useInfo[0];

        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            loginId: this.authService.currentUser().userName

        };
        console.log(dialogConfig.data);
        this.dialog.open(PasswordComponent, dialogConfig);
    }

    fetchData() {
        this.navService.getNavigationListByLoginId(this.userName).then(res => {
            this.navInfo = res;
            console.log(this.userName);
            console.log(res);
        }, err => { throw err; })
    
    }

    logout(): void {
        this.authService.logout();
        this.router.navigate(['/Login']);
        this.navInfo = [];
    }

    ngOnDestroy(): void {
        this.mobileQuery.removeListener(this._mobileQueryListener);
        this.menuVis = false;
    }

    shouldRun = [/(^|\.)plnkr\.co$/, /(^|\.)stackblitz\.io$/].some(h => h.test(window.location.host));

    get isLoggedIn(): boolean {
        // let loginFlag:boolean = this.authService.isLoggedIn();
        // if(loginFlag){
        // this.navService.appDrawer = this.appDrawer;
        // } 
        // console.log(this.authService.isLoggedIn());
        return this.authService.isLoggedIn();

    }

    get userName(): string {
        var _user = this.authService.currentUser();
        if (_user != undefined && _user != null) {
            return this.authService.currentUser().userName;
        }
        return '';
    }


    get navInfoList(): any[] {
        return this.authService.userNavlist();
    }

    get loginId(): string {
        if (this.authService.currentUser) {
            return this.authService.currentUser().loginId;
        }
        return '';
    }

    menuVis = true;
    menuDriven() {
        if (this.menuVis) {
            this.menuVis = false;
        } else {
            this.menuVis = true;
        }
    }
}
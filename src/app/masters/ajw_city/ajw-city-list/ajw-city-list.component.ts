import { Component, OnInit, ViewChild } from '@angular/core';
import { City } from '../City';
import { Router } from '@angular/router';
import { CityService } from '../../../services/Master/cityService/city.service';
import { Globals } from '../../../global';
import { XlsxService } from '../../../services/sharedServices/xlsxService/xlsx.service';
import { OpenDialogBoxService } from '../../../services/sharedServices/openDialogBoxService/open-dialog-box.service';
import { AuthService } from '../../../login/auth.service';

@Component({
  selector: 'app-ajw-city-list',
  templateUrl: './ajw-city-list.component.html',
  styleUrls: ['./ajw-city-list.component.scss']
})

export class AjwCityListComponent implements OnInit {
  @ViewChild('datatable') datatable: any;

  temp = [];
  city: City = new City();
  cityInfo: any[];

  constructor(private cityService: CityService,
    private router: Router,
    private globals: Globals,
    private xlsxService: XlsxService,
    private authService: AuthService,
    private openDialogBoxService: OpenDialogBoxService) { }

  ngOnInit() {
    this.globals.role = "City Master";
    this.fetchAllRecords();
  }

  fetchAllRecords(): void {
    this.cityService.getCityDetails().then((res) => {
      this.cityInfo = res;
      this.temp = res;
      console.log(res);
    }, err => { throw err; });
  }

  save(): void {
    if (this.city.id !== undefined && this.city.id > 0) {
      this.cityService.updateCityDetails(this.city)
        .subscribe(res => {
          this.fetchAllRecords();
        },
          err => {
            throw err;
          });
    }
    else {
      this.cityService.addCityDetails(this.city)
        .subscribe(res => {
          this.fetchAllRecords();
        },
          err => {
            throw err;
          });
    }
  }

  edit(id): void {
    this.router.navigate(['/AjwCityForm'], { queryParams: { id: id } });
  };

  btnClick = function () {
    this.router.navigateByUrl('/AjwCityForm');
  };

  delete(id): void {
    var ctyInfo = this.cityInfo.filter(cty => cty.id === id)
    if (ctyInfo && ctyInfo.length > 0) {
      const dialogRef = this.openDialogBoxService.openDialog("Are you sure want to delete?");
      dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
          ctyInfo[0].updatedBy = this.authService.userName;
          this.cityService.deleteCityDetail(ctyInfo[0]).subscribe(
            res => {
              this.fetchAllRecords();
              this.openDialogBoxService.openSnackBar("Deleted successfully", "");
            },
            err => {
              throw err;
            });
        }
      },
        err => {
          throw err;
        });
    }
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    let temp1: City[] = this.temp.filter(function (d) {
      return (d.cityCode.toLowerCase().indexOf(val) !== -1 || !val) ||
        (d.cityName.toLowerCase().indexOf(val) !== -1 || !val) ||
        (d.stateName.toLowerCase().indexOf(val) !== -1 || !val) ||
        (d.officeType.toLowerCase().indexOf(val) !== -1 || !val) ||
        (d.officeCode.toLowerCase().indexOf(val) !== -1 || !val) ||
        (d.transType.toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.cityInfo = temp1;
  }

  exportXlsx() {
    var data: any[] = [];
    var i = 1;
    this.temp.forEach(element => {
      var val = {
        "": i,
        "City Code": element.cityCode,
        "City Name": element.cityName,
        "State": element.stateName,
        "Via Office Type": element.officeType,
        "Via Office Name": element.officeCode,
        "Transaction Type": element.transType
      }
      data.push(val);
      i = i + 1;
    });
    this.xlsxService.saveAsExcelFile(data, this.globals.role);
  }

}

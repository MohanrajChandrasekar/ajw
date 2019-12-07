import { Component, OnInit } from '@angular/core';
import { Company } from '../company';
import { CompanyService } from '../../../services/Master/companyService/company.service';
import { Router } from '@angular/router';
import { Globals } from '../../../global';
import { XlsxService } from '../../../services/sharedServices/xlsxService/xlsx.service';
import { OpenDialogBoxService } from '../../../services/sharedServices/openDialogBoxService/open-dialog-box.service';
import { AuthService } from '../../../login/auth.service';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss']
})
export class CompanyListComponent implements OnInit {

  constructor(private companyService: CompanyService,
    private router: Router,
    private globals: Globals,
    private authService: AuthService,
    private xlsxService: XlsxService,
    private openDialogBoxService: OpenDialogBoxService) { }

  temp = [];
  companyInfo: any = [];
  company: Company = new Company();

  ngOnInit() {
    this.globals.role = 'Company Master';
    this.fetchAllRecords();
  }

  btnClick = function () {
    this.router.navigateByUrl('/companyForm');
  };

  fetchAllRecords(): void {
    this.companyService.getCompanyDetails().then((res) => {
      this.companyInfo = res;
      this.temp = res;
      console.log(res);
    }, err => { throw err; });
  }

  edit(id): void {
    this.router.navigate(['/companyForm'], { queryParams: { Id: id } });
  }

  delete(id): void {
    var compInfo = this.companyInfo.filter(comp => comp.id === id)
    if (compInfo && compInfo.length > 0) {
      const dialogRef = this.openDialogBoxService.openDialog("Are you sure want to delete?");
      dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
          this.companyService.deleteCompanyDetail(compInfo[0]).subscribe(
            res => {
              compInfo[0].updatedBy = this.authService.userName;
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
    let temp1: Company[] = this.temp.filter(function (d) {
      return d.companyName.toLowerCase().indexOf(val) !== -1 || !val ||
        d.companyAddress1.toLowerCase().indexOf(val) !== -1 || !val ||
        d.companyAddress2.toLowerCase().indexOf(val) !== -1 || !val ||
        d.companyCity.toLowerCase().indexOf(val) !== -1 || !val ||
        d.companyPhone.toLowerCase().indexOf(val) !== -1 || !val ||
        d.companyFax.toLowerCase().indexOf(val) !== -1 || !val ||
        d.companyEmail.toLowerCase().indexOf(val) !== -1 || !val ||
        d.companyWeb.toLowerCase().indexOf(val) !== -1 || !val ||
        d.companyPan.toLowerCase().indexOf(val) !== -1 || !val ||
        d.companyStNo.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.companyInfo = temp1;
  }

  exportXlsx() {
    var data: any[] = [];
    var i =1;
    this.temp.forEach(element => {
      var val = {
        "":i,
        "Company Name": element.companyName,
        "Address 1": element.companyAddress1,
        "Address 2": element.companyAddress2,
        "City": element.companyCity,
        "Phone Number": element.companyPhone,
        "Fax Number": element.companyFax,
        "Email Id": element.companyEmail,
        "Website": element.companyWeb,
        "Pan Number": element.companyPan,
        "Service Tax Number": element.companyStNo
      }
      data.push(val);
      i=i+1;
    });
    this.xlsxService.saveAsExcelFile(data, this.globals.role);
  }

}


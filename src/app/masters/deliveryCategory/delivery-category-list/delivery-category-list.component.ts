import { Component, OnInit } from '@angular/core';
import { DeliveryCategoryService } from '../../../services/Master/deliveryCategoryService/delivery-category.service';
import { DeliveryCategory } from '../deliveryCategory';
import { Router } from '@angular/router';
import { Globals } from '../../../global';
import { XlsxService } from '../../../services/sharedServices/xlsxService/xlsx.service';
import { OpenDialogBoxService } from '../../../services/sharedServices/openDialogBoxService/open-dialog-box.service';
import { AuthService } from '../../../login/auth.service';

@Component({
  selector: 'app-delivery-category-list',
  templateUrl: './delivery-category-list.component.html',
  styleUrls: ['./delivery-category-list.component.scss']
})
export class DeliveryCategoryListComponent implements OnInit {

  temp = [];
  deliveryCategoryInfo: any = [];
  deliveryCategory: DeliveryCategory = new DeliveryCategory();

  constructor(private deliveryCategoryService: DeliveryCategoryService,
    private router: Router,
    private globals: Globals,
    private authService: AuthService,
    private xlsxService: XlsxService,
    private openDialogBoxService: OpenDialogBoxService) { }

  ngOnInit() {
    this.globals.role = "Delivery Category Master";
    this.fetchAllRecords();
  }

  btnClick = function () {
    this.router.navigateByUrl('/deliveryCategoryForm');
  };

  fetchAllRecords(): void {
    this.deliveryCategoryService.getDeliveryCategoryDetails().then((res) => {
      this.deliveryCategoryInfo = res;
      this.temp = res;
      console.log(res);
    }, err => { throw err; });
  }

  edit(id): void {
    this.router.navigate(['/deliveryCategoryForm'], { queryParams: { id: id } });
  }

  delete(id): void {
    var deliveryInfo = this.deliveryCategoryInfo.filter(delivery => delivery.id === id)
    if (deliveryInfo && deliveryInfo.length > 0) {
      const dialogRef = this.openDialogBoxService.openDialog("Are you sure want to delete?");
      dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
          deliveryInfo[0].updatedBy = this.authService.userName;
          this.deliveryCategoryService.deleteDeliveryCategoryDetails(deliveryInfo[0]).subscribe(
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
    let temp1: DeliveryCategory[] = this.temp.filter(function (d) {
      return (d.code.toLowerCase().indexOf(val) !== -1 || !val) ||
      (d.description.toLowerCase().indexOf(val) !== -1 || !val)
    });
    this.deliveryCategoryInfo = temp1;
  }

  exportXlsx() {
    var data: any[] = [];
    var i=1;
    this.temp.forEach(element => {
      var val = {
        "":i,
        "Code": element.code,
        "Description": element.description
      }
      data.push(val);
      i=i+1;
    });
    this.xlsxService.saveAsExcelFile(data, this.globals.role);
  }

}


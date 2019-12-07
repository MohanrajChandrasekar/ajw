import { Component, OnInit } from '@angular/core';
import { Shipper } from '../shipper';
import { Router } from '@angular/router';
import { ShipperService } from '../../../services/Master/shipperService/shipper.service';
import { Globals } from '../../../global';
import { OpenDialogBoxService } from '../../../services/sharedServices/openDialogBoxService/open-dialog-box.service';
import { XlsxService } from '../../../services/sharedServices/xlsxService/xlsx.service';
import { AuthService } from '../../../login/auth.service';

@Component({
  selector: 'app-shipper-list',
  templateUrl: './shipper-list.component.html',
  styleUrls: ['./shipper-list.component.scss']
})

export class ShipperListComponent implements OnInit {

  temp = [];
  shipper: Shipper = new Shipper();
  shipperInfo: any[];

  constructor(private shipperService: ShipperService,
    private xlsxService: XlsxService,
    private router: Router,
    private globals: Globals,
    private authService: AuthService,
    private openDialogBoxService: OpenDialogBoxService) { }

  ngOnInit() {
    this.globals.role = "Shipper Master";
    this.fetchAllRecords();
  }

  fetchAllRecords(): void {
    this.shipperService.getShipperDetails().then((res) => {
      this.shipperInfo = res;
      this.temp = res;
      console.log(res);
    }, err => { throw err; });
  }

  btnClick = function () {
    this.router.navigateByUrl('/ShipperForm');
  };

  save(): void {
    if (this.shipper.id !== undefined && this.shipper.id > 0) {
      this.shipperService.updateShipperDetails(this.shipper)
        .subscribe(res => {
          this.fetchAllRecords();
        },
        err => {
          throw err;
        });
    }
    else {
      this.shipperService.addShipperDetails(this.shipper)
        .subscribe(res => {
          this.fetchAllRecords();
        },
        err => {
          throw err;
        });
    }
  }

  edit(id): void {
    this.router.navigate(['/ShipperForm'], { queryParams: { id: id } });
  };

  delete(id): void {
    var shipInfo = this.shipperInfo.filter(ship => ship.id === id)
    if (shipInfo && shipInfo.length > 0) {
      const dialogRef = this.openDialogBoxService.openDialog("Are you sure want to delete?");
      dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
          shipInfo[0].updatedBy =this.authService.userName;
          this.shipperService.deleteShipperDetail(shipInfo[0]).subscribe(
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
    let temp1: Shipper[] = this.temp.filter(function (d) {
      return d.shipperCode.toLowerCase().indexOf(val) !== -1 || !val ||
        d.shipperName.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.shipperInfo = temp1;
  }

  exportXlsx() {
    var data: any[] = [];
    var i=1;
    this.temp.forEach(element => {
      var val = {
        "":i,
        "Shipper Code": element.shipperCode,
        "Shipper Name": element.shipperName
      }
      data.push(val);
      i=i+1;
    });
    this.xlsxService.saveAsExcelFile(data, this.globals.role);
  }

}


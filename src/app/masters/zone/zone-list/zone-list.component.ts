import { Component, OnInit, ViewChild } from '@angular/core';
import { Zone } from '../zone';
import { Router } from '@angular/router';
import { ZoneService } from '../../../services/Master/zoneService/zone.service';
import { Globals } from '../../../global';
import { OpenDialogBoxService } from '../../../services/sharedServices/openDialogBoxService/open-dialog-box.service';
import { XlsxService } from '../../../services/sharedServices/xlsxService/xlsx.service';

@Component({
  selector: 'app-zone-list',
  templateUrl: './zone-list.component.html',
  styleUrls: ['./zone-list.component.scss']
})

export class ZoneListComponent implements OnInit {
  @ViewChild('datatable') datatable: any;

  temp = [];
  zone: Zone = new Zone();
  zoneInfo: any[];

  constructor(private zoneService: ZoneService,
    private router: Router,
    private globals: Globals,
    private xlsxService: XlsxService,
    private openDialogBoxService: OpenDialogBoxService) { }

  ngOnInit() {
    this.globals.role = "Zone";
    this.fetchAllRecords();
  }

  fetchAllRecords(): void {
    this.zoneService.getZoneDetails().then((res) => {
      this.zoneInfo = res;
      this.temp = res;
      console.log(res);
    }, err => { throw err; });
  }

  save(): void {
    if (this.zone.id !== undefined && this.zone.id > 0) {
      this.zoneService.updateZoneDetails(this.zone)
        .subscribe(res => {
          this.fetchAllRecords();
        },
        err => {
          throw err;
        });
    }
    else {
      this.zoneService.addZoneDetails(this.zone)
        .subscribe(res => {
          this.fetchAllRecords();
        },
        err => {
          throw err;
        });
    }
  }

  edit(id): void {
    this.router.navigate(['/ZoneForm'], { queryParams: { id: id } });
  };

  delete(id): void {
    var zonInfo = this.zoneInfo.filter(zon => zon.id === id)
    if (zonInfo && zonInfo.length > 0) {
      const dialogRef = this.openDialogBoxService.openDialog("Are you sure want to delete?");
      dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
          this.zoneService.deleteZoneDetail(zonInfo[0]).subscribe(
            res => {
              this.fetchAllRecords();
              this.openDialogBoxService.openSnackBar("Deleted zone successfully", "");
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

  btnClick = function () {
    this.router.navigateByUrl('/ZoneForm');
  };

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    let temp1: Zone[] = this.temp.filter(function (d) {
      return d.zoneCode.toLowerCase().indexOf(val) !== -1 || !val ||
        d.zoneName.toLowerCase().indexOf(val) !== -1 || !val;
      //d.zoneIncharge.toLowerCase().indexOf(val) !== -1 || !val ;
    });
    this.zoneInfo = temp1;
  }

  exportXlsx() {
    var data: any[] = [];
    this.temp.forEach(element => {
      var val = {
        "Zone Code": element.zoneCode,
        "Zone Name": element.zoneName,
        "Incharge": element.zoneIncharge
      }
      data.push(val);
    });
    this.xlsxService.saveAsExcelFile(data, this.globals.role);
  }

}





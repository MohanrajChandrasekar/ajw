import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DtpBindFormatService {

  constructor() { }

  // Date Reverse to ISO Formate 
  reConstructDate(date: any) {
    var dd = date.day;
    var mm = date.month;
    var yyyy = date.year;
    return moment(mm + '/' + dd + '/' + yyyy).toDate();
  }

  // Date Convert to JSON format
  jsonDate(getDate: any) {
    var day = moment(getDate).toDate().getDate();
    var month = moment(getDate).toDate().getMonth();
    var year = moment(getDate).toDate().getFullYear();
    return { 'year': year, 'month': month + 1, 'day': day };
  }

  // Remove Time Zone
  convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  //datetoISO
  dateISO(getDate) {
    var day = moment(getDate).toDate().getDate();
    var month = moment(getDate).toDate().getMonth();
    var year = moment(getDate).toDate().getFullYear();
    var dobj = new Date(year, month - 1, day);
    // Date {Fri Jan 29 2016 00:00:00 GMT+0530(utopia standard time)
    console.log(dobj.toISOString());
    return dobj.toISOString();
  }

  timeConvert(time: any) {
    console.log(time);
    let hh = time.hour;
    let mm = time.minute;
    let ss = time.second;

    return hh + ':' + mm + ':' + ss;
  }


}

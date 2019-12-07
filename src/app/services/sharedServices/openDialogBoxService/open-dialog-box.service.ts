import { Injectable } from '@angular/core';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { MatDialog, MatSnackBar, MatDialogConfig } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class OpenDialogBoxService {

  constructor(private dialog: MatDialog,
    private snackBar: MatSnackBar) { }

  openSnackBar(message: string, action: string) {
    if (action == "") {
      this.snackBar.open(message, action, {
        duration: 2000,
        panelClass: ['background-green']
      });
    } else {
      this.snackBar.open(message, action, {
        duration: 2000,
        panelClass: ['background-red']
      });
    }
  }

  openDialog(title: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: title
    };
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);
    return dialogRef;
  }

  openDialogCancel(title: string) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: title
    };

    let dialogRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);
    return dialogRef;
  }
}
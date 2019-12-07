import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgSelectModule } from '@ng-select/ng-select';
import 'hammerjs';
import {
MatAutocompleteModule,
MatButtonModule,
MatButtonToggleModule,
MatCheckboxModule, 
MatToolbarModule,
MatTooltipModule,
MatCardModule,
MatChipsModule,
MatDatepickerModule,
MatDialogModule,
MatExpansionModule,
MatFormFieldModule,
MatGridListModule,
MatIconModule,
MatInputModule,
MatListModule,
MatMenuModule,
MatNativeDateModule,
MatPaginatorModule,
MatProgressBarModule,
MatProgressSpinnerModule,
MatRadioModule,
MatRippleModule,
MatSelectModule,
MatSidenavModule,
MatSliderModule,
MatSlideToggleModule,
MatSnackBarModule,
MatSortModule,
MatTableModule,
MatTabsModule,
MatStepperModule

} from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { BoxDetailDialogComponent } from './box-detail-dialog/box-detail-dialog.component';

@NgModule({
imports: [
MatAutocompleteModule,
MatButtonModule,
MatButtonToggleModule,
MatCardModule,
MatCheckboxModule,
MatChipsModule,
MatDialogModule,
MatExpansionModule,
MatFormFieldModule,
MatGridListModule,
MatDatepickerModule,
MatIconModule,
MatInputModule,
MatListModule,
MatMenuModule,
MatNativeDateModule,
MatPaginatorModule,
MatProgressBarModule,
MatProgressSpinnerModule,
MatRadioModule,
MatRippleModule,
MatSelectModule,
MatSidenavModule,
MatSliderModule,
MatSlideToggleModule,
MatSnackBarModule,
MatStepperModule,
MatSortModule,
MatTableModule,
MatTabsModule,
MatToolbarModule,
MatTooltipModule,
CdkTableModule,
FlexLayoutModule,
NgSelectModule
],

exports: [
MatAutocompleteModule,
MatButtonModule,
MatButtonToggleModule,
MatCardModule,
MatCheckboxModule,
MatChipsModule,
MatDialogModule,
MatDatepickerModule,
MatExpansionModule,
MatGridListModule,
MatIconModule,
MatInputModule,
MatListModule,
MatMenuModule,
MatNativeDateModule,
MatPaginatorModule,
MatProgressBarModule,
MatProgressSpinnerModule,
MatRadioModule,
MatRippleModule,
MatSelectModule,
MatSidenavModule,
MatSliderModule,
MatSlideToggleModule,
MatSnackBarModule,
MatStepperModule,
MatSortModule,
MatTableModule,
MatTabsModule,
MatToolbarModule,
MatTooltipModule,
CdkTableModule,
FlexLayoutModule,
NgSelectModule
],

declarations: [ConfirmationDialogComponent, BoxDetailDialogComponent]
})

export class MaterialModule{}
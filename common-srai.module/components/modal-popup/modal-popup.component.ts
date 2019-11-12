import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ModalType } from '../../models';

export interface IDialogData { value: string; mode: ModalType; }

@Component({
  selector: 'srai-modal-popup',
  templateUrl: './modal-popup.component.html',
  styleUrls: ['./modal-popup.component.css']
})
export class ModalPopupComponent implements OnInit {

  public closeKey = 'close';
  constructor(
    public dialogRef: MatDialogRef<ModalPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDialogData,
  ) { }

  public ngOnInit() {
  }

  public onNoClick(): void {
    this.dialogRef.close();
  }

}

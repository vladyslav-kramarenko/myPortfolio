import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Image} from "../models/IImage";

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.scss']
})
export class ImageModalComponent {

  folder = "../../../assets/"
  constructor(
    public dialogRef: MatDialogRef<ImageModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { image: Image }
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  onBackdropClick(): void {
    this.close();
  }

  onContentClick(): void {
    this.close();
  }
}

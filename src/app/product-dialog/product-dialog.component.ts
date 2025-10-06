import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Product } from '../models/products';

@Component({
    selector: 'app-product-dialog',
    standalone: true,
    imports: [FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
    template: `
    <h1 mat-dialog-title>Produto</h1>
    <div mat-dialog-content>
      <mat-form-field style="width:100%">
        <mat-label>Nome</mat-label>
        <input matInput [(ngModel)]="data.product.name">
      </mat-form-field>

      <mat-form-field style="width:100%">
        <mat-label>Descrição</mat-label>
        <input matInput [(ngModel)]="data.product.description">
      </mat-form-field>

      <mat-form-field style="width:100%">
        <mat-label>Preço</mat-label>
        <input matInput type="number" [(ngModel)]="data.product.price">
      </mat-form-field>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-button color="primary" (click)="onSave()">Salvar</button>
    </div>
  `
})
export class ProductDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<ProductDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { product: Product }
    ) { }

    onCancel(): void {
        this.dialogRef.close();
    }

    onSave(): void {
        this.dialogRef.close(this.data.product);
    }
}

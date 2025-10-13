import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SupabaseService } from '../services/supabase.service';
import { Product } from '../models/products';
import { ProductDialogComponent } from '../product-dialog/product-dialog.component';

@Component({
    selector: 'app-products',
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatTableModule, MatDialogModule],
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
    displayedColumns: string[] = ['image', 'name', 'price', 'actions'];
    supabaseService = inject(SupabaseService);
    dialog = inject(MatDialog);

    ngOnInit() {
        this.supabaseService.loadProducts();
    }

    get products(): Product[] {
        return this.supabaseService.products();
    }

    openDialog(product?: Product) {
        const dialogRef = this.dialog.open(ProductDialogComponent, {
            width: '400px',
            data: { product: product ? { ...product } : { name: '', description: '', price: 0 } }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                if (product?.id) {
                    console.log('Updating product:', product.id, result);
                    this.supabaseService.updateProduct(product.id, result);
                } else {
                    this.supabaseService.addProduct({
                        ...result,
                        created_at: new Date().toISOString()
                    });
                }
            }
        });
    }

    deleteProduct(id: number) {
        this.supabaseService.deleteProduct(id);
    }
}

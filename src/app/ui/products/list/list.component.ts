import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../shared/services/product.service';
import { product_model } from '../../shared/models/product.model';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Router } from '@angular/router';
import { DeleteComponent } from '../delete/delete.component';
@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatSnackBarModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
})
export class ListComponent implements OnInit {
  public isMobileView: boolean = false;
  displayedColumns: string[] = [
    'id',
    'name',
    'description',
    'price',
    'isAvailable',
    'actions',
  ];
  dataSource: MatTableDataSource<product_model> =
    new MatTableDataSource<product_model>([]);

  constructor(
    private productService: ProductService,
    private breakpointObserver: BreakpointObserver,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}
  products: product_model[] = [];
  ngOnInit(): void {
    this.productService
      .getAllProducts()
      .then((products) => (this.products = products));
    this._getProducts();
    this._canUseResponsiveMode();
  }

  private _canUseResponsiveMode(): void {
    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.TabletPortrait])
      .subscribe((result) => {
        this.isMobileView = result.matches;
      });
  }

  private _getProducts(): void {
    this.productService.getAllProducts().then((products) => {
      this.products = products;
      this.dataSource.data = products;
    });
  }

  goToCreateProductLink(): void {
    this.router.navigate(['/products/create']);
  }

  goToEditProductLink(id: number): void {
    this.router.navigate(['/products/edit', id]);
  }

  deleteProduct(productId: number): void {
    const dialogData: any = {
      title: 'Confirmar Borrado de Item',
      message: '¿Estás seguro de eliminar este producto?',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    };

    const dialogRef = this.dialog.open(DeleteComponent, {
      width: '400px',
      data: dialogData,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.productService
          .delete(productId)
          .then(() => {
            this.snackBar.open('Producto eliminado correctamente', 'Cerrar', {
              duration: 3000,
              panelClass: ['snackbar-success'],
            });
            this._getProducts();
          })
          .catch((error) => {
            this.snackBar.open('Ha ocurrido un error interno al eliminar el producto', 'Cerrar', {
              duration: 3000,
              panelClass: ['snackbar-error'],
            });
          });
      }
    });
  }
}

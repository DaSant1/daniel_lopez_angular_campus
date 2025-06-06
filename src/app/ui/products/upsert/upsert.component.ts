import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCard, MatCardModule } from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DbProductService } from '../../../core/service/db-product.service';
import { ProductService } from '../../shared/services/product.service';
import { CommonModule } from '@angular/common';
import { MatPseudoCheckboxModule } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { query } from '@angular/animations';
import { product_model } from '../../shared/models/product.model';
@Component({
  selector: 'app-upsert',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatIconModule,
    MatCardModule,
    CommonModule,
    MatCheckboxModule
  ],
  templateUrl: './upsert.component.html',
  styleUrl: './upsert.component.css'
})
export class UpsertComponent implements OnInit{
  productForm!:FormGroup;
  idParam:string | null=null;
  contextName:string="";
  contextAction:string="Create";
  isEditingMode:boolean=false;
  product:product_model | null = null;
  constructor(private snackBar: MatSnackBar,
              private fb: FormBuilder,
              private productService:ProductService,
              private activeRoute: ActivatedRoute,
              private router:Router
  ) {}

  ngOnInit(): void {
    this._initForm();
    this._getContextCallingLink();
  }

  private _getContextCallingLink():void{
    this.activeRoute.paramMap.subscribe(params=>{
      this.contextAction=params.get('action') !;
      this.isEditingMode = this.contextAction === 'edit';

    });
    this.activeRoute.queryParamMap.subscribe(queryParam=>{
      this.idParam = this.activeRoute.snapshot.paramMap.get('id');
    });
    if(this.isEditingMode && this.idParam){
      this.contextName="Editar"
      this._getProductById(this.idParam);
    }else{
      this.contextName="Crear";
    }
  }

  private _getProductById(id:string):void{
    this.productService.getProductById(Number(id))
    .then(product => {
      this.product = product!;
      this.productForm.patchValue({
        id: this.product.id,
        name: this.product.name,
        description: this.product.description,
        price: this.product.price,
        isAvailable: this.product.isAvailable
      });
    },(error)=>{
      this.snackBar.open('Error al obtener el producto', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    })
  }

  private _initForm():void{
       this.productForm = this.fb.group({
      id: [],
      name: ['',[Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: [''],
      price: [0,[Validators.required,Validators.min(0.01)]],
      isAvailable: [true]
    });
  }

  coordinateUpsert():void{
    if(this.isEditingMode){
      this._updateProduct();
    }else{
      this._createProduct();
    }
  }


  private _createProduct():void{
    if(this.productForm.valid){
      const newProduct: product_model = {...this.productForm.value};
      this.productService.addProduct(newProduct).then(()=>{
        this.snackBar.open('Producto creado exitosamente.', 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.productForm.reset();
        this.productForm.patchValue({isAvailable: true});
      },(error)=>{
        this.snackBar.open('Error al crear el producto.', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      })
    }else{
      this.snackBar.open('Por favor, completa todos los campos requeridos.', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  }

  private _updateProduct():void{
    if(this.productForm.valid && this.product){
      const updatedProduct: product_model = {...this.productForm.value, id: this.product.id};
      this.productService.updateProduct(updatedProduct).then(()=>{
        this.snackBar.open('Producto actualizado exitosamente.', 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.productForm.reset();
      },(error)=>{
        this.snackBar.open('Error al actualizar el producto.', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      })
    }else{
      this.snackBar.open('Por favor, completa todos los campos requeridos.', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  }

  backToProductsList():void{
    this.router.navigate(['/products']);
  }

}

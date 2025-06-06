import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../shared/services/product.service';
import { product_model } from '../../shared/models/product.model';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit{

  constructor(private productService:ProductService){}
  products:product_model[] = [];
  ngOnInit(): void {
    this.productService.getAllProducts().then((products) => this.products = products);
  }

  


}

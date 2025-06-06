import { Injectable } from '@angular/core';
import { db, DbProductService } from '../../../core/service/db-product.service';
import { product_model } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor() { }
  private product_table=db.product_table;
   async getAllProducts(): Promise<product_model[]> {
    try{
      return await this.product_table.toArray(); //Devuelve todos los productos de la tabla 'products'
    }catch(error){
      return []
    }
  }
  async getProductById(id: number): Promise<product_model | undefined> {
    try{
      return await this.product_table.get(id); //Devuelve un producto de la tabla 'products' por su id
    }catch(error){
      return undefined; //Si hay un error, devuelve undefined
    }

  }
  async addProduct(product: product_model): Promise<number | null> {
    try{
      return await this.product_table.add(product); //Añade un producto a la tabla 'products' y devuelve su id
    }catch(error) {
      return null;
    }
  }

  async delete(id:number){
    await this.product_table.delete(id); //Elimina un producto de la tabla 'products' por su id 
  }
}

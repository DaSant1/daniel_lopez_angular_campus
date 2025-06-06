import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { dbSchema } from '../../../localdb/db-schema';
import { product_model } from '../../ui/shared/models/product.model';


@Injectable({
  providedIn: 'root'
})
export class DbProductService extends Dexie{
  public product_table:Dexie.Table<product_model,number>;

  constructor() {
    super('campusland_db'); //Se inicializa la base de datos con el nombre 'campusland_db'
    this.version(1).stores(dbSchema); //Se llama el DBSchema para indicar que se va a usar dicho esquema
    this.product_table = this.table('products'); //relaciono la base de datos con la tabla 'products'
  }
}
export const db = new DbProductService(); //Se crea una instancia de la base de datos para poder usarla en el resto de la aplicacion

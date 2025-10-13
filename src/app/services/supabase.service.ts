import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { Product } from '../models/products';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  supabase: SupabaseClient;
  products = signal<Product[]>([]);

  constructor() {
    this.supabase = createClient(environment.apiUrl, environment.apiKey);
  }

  async loadProducts() {
    const { data, error } = await this.supabase.from('products').select('*');
    if (error) throw error;
    this.products.set(data as Product[]);
  }

  getProducts(): Product[] {
    return this.products();
  }

  async addProduct(product: Product) {
    // remove o campo "file" da cópia
    const { file, ...productData } = product;

    // faz o insert e já retorna o registro novo
    const { data, error } = await this.supabase
      .from('products')
      .insert([productData])
      .select();

    if (error) throw error;

    const newProduct = data[0];

    if (file) {
      const imageUrl = await this.uploadImage(file, newProduct.id);
      console.log('Image URL:', imageUrl);
      console.log(newProduct.id);
      await this.updateProduct(newProduct.id, { image_url: imageUrl });
      newProduct.image_url = imageUrl;
    }

    await this.loadProducts();

    return newProduct;
  }

  async updateProduct(id: number, updates: Partial<Product>) {
    const { file, ...productData } = updates;
    // console.log(data);

    if (file) {
      await this.supabase.storage.from('produtos').list();
      console.log("Uploading new image...");
      console.log(id);

      const file = (updates as any).file;
      console.log(file);

      delete (updates as any).file;
      const imageUrl = await this.uploadImage(file, id);
      updates.image_url = imageUrl;
    }
    const { error } = await this.supabase.from('products').update(updates).eq('id', id);
    if (error) throw error;
    await this.loadProducts();
  }

  async deleteProduct(id: number) {

    await this.supabase.storage.from("produtos").remove([`${id}`]);
    const { error } = await this.supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    await this.loadProducts();
  }

  async login(email: string, password: string) {
    return await this.supabase.auth.signInWithPassword({ email, password });
  }

  async logout() {
    await this.supabase.auth.signOut();
  }

  async uploadImage(file: File, id: number) {
    // Dá um nome único pra evitar conflito
    console.log("Deletando imagem antiga se existir...");
    await this.supabase.storage.from("produtos").remove([`${id}`]);

    const fileName = `${id}`;

    // Faz o upload
    const { data, error } = await this.supabase.storage
      .from("produtos") // nome do bucket
      .upload(fileName, file);

    if (error) {
      console.error("Erro ao enviar imagem:", error.message);
      throw error;
    }


    // Agora, pega a URL pública
    const { data: publicUrlData } = this.supabase.storage
      .from("produtos")
      .getPublicUrl(fileName);


    return publicUrlData.publicUrl; // retorna a URL pública pra usar no app
  }
}
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../services/products.service';
import { product } from '../../models/object-model';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  all_product_data: product[] = [];
  addEditProductDForm: FormGroup;
  popup_header: string = '';
  isAddMode: boolean = true;
  edit_product_id: number | null = null;
  isLoading: boolean = false;
  currentSellerId: number | string | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService
  ) {
    this.addEditProductDForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      uploadPhoto: ['', [Validators.required, Validators.pattern('https?://.+')]],
      productDesc: ['', Validators.required],
      category: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.loadSellerId();
    this.loadProducts();
  }

  
  loadSellerId(): void {
    const sellerData = localStorage.getItem('seller');
    if (sellerData) {
      const seller = JSON.parse(sellerData);
      this.currentSellerId = seller.id;
    }
  }

  get f() {
    return this.addEditProductDForm.controls;
  }

 loadProducts(): void {
  this.isLoading = true;
  this.productService.allProduct(this.currentSellerId?.toString()).subscribe({
    next: (data: product[]) => {
      this.all_product_data = data;
      this.isLoading = false;
    },
    error: (error) => {
      console.error('Error loading products:', error);
      this.isLoading = false;
    }
  });
}

openProductModal(isAdd: boolean, id?: number): void {
  this.isAddMode = isAdd;
  this.popup_header = isAdd ? 'Add New Product' : 'Edit Product';
  this.addEditProductDForm.reset();

  if (!isAdd && id) {
    this.edit_product_id = id;
    this.productService.singleProduct(id, this.currentSellerId?.toString()).subscribe({
      next: (product: product) => {
        this.addEditProductDForm.patchValue({
          name: product.name,
          uploadPhoto: product.uploadPhoto,
          productDesc: product.productDesc,
          category: product.category,
          price: product.price
        });
      },
      error: (error) => {
        console.error('Error loading product:', error);
      }
    });
  }
}

  submitProduct(): void {
    if (this.addEditProductDForm.invalid) return;

   const productData: product = {
  ...this.addEditProductDForm.value,
      sellerId: this.currentSellerId,
  ...(!this.isAddMode && { id: this.edit_product_id })
};
    const operation = this.isAddMode 
      ? this.productService.addNewProduct(productData)
      : this.productService.updateProduct(this.edit_product_id!, productData);

    operation.subscribe({
      next: () => {
        this.loadProducts();
        document.getElementById('closeModalButton')?.click();
      },
      error: (error) => console.error('Operation failed:', error)
    });
  }

deleteProduct(id: number): void {
  if (confirm(`Are you sure you want to delete product #${id}?`)) {
    this.productService.singleProduct(id, this.currentSellerId?.toString()).subscribe({
      next: () => {
        this.productService.deleteProduct(id).subscribe({
          next: () => this.loadProducts(),
          error: (error) => console.error('Delete failed:', error)
        });
      },
      error: (error) => {
        console.error('Cannot delete product:', error);
      }
    });
  }
}

}
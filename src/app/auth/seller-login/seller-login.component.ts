import { afterNextRender, Component, DestroyRef, inject,viewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime} from 'rxjs';
import { SellerService } from '../../services/seller.service';
import { Login } from '../../models/data-model';

@Component({
  selector: 'app-seller-login',
  templateUrl: './seller-login.component.html',
  styleUrl: './seller-login.component.scss'
})
export class SellerLoginComponent {
  
  authError:String='';
  isLoading:boolean=false;
  errorMsg:string='';
  showPassword = false;

  private form = viewChild.required<NgForm>('form');
  private destroyRef = inject(DestroyRef);
  
  constructor(private _SellerService: SellerService, private _Router: Router) {
     window.localStorage.removeItem('saved-login-form');
     
    afterNextRender(() => {
      const savedForm = window.localStorage.getItem('saved-login-form');

      if (savedForm) {
        const loadedFormData = JSON.parse(savedForm);
        const savedEmail = loadedFormData.email;
        setTimeout(() => {
          this.form().controls['email'].setValue(savedEmail);
        }, 1);
      }
      
      const Subscription = this.form()
        .valueChanges?.pipe(debounceTime(500))
        .subscribe({
          next: (value) => 
            window.localStorage.setItem(
              'saved-login-form',
              JSON.stringify({ email: value.email })
            ),
        });

      this.destroyRef.onDestroy(() => Subscription?.unsubscribe());
    });
  }

onSubmit(formData: NgForm): void {
    if (formData.form.invalid) {
        Object.values(formData.form.controls).forEach(control => {
            control.markAsTouched();
            control.markAsDirty();
        });
        return;
    }

    this.isLoading = true;
    this.errorMsg = '';
    this.authError = '';

    const loginData: Login = {
        email: formData.form.value.email,
        password: formData.form.value.password
    };

    this._SellerService.userLogin(loginData);
    this._SellerService.isLoginError.subscribe((isError) => {
      this.isLoading = false;
      if (isError) {
        this.errorMsg = "Email or password is not correct";
      }
    });
}
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
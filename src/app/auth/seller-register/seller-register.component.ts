import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Register } from '../../models/data-model';
import { SellerService } from '../../services/seller.service';

function equalValues(controlName1: string, controlName2: string) {
  return (control: AbstractControl) => {
    const val1 = control.get(controlName1)?.value;
    const val2 = control.get(controlName2)?.value;

    if (val1 === val2) {
      return null;
    }

    return { valuesNotEqual: true };
  };
}

@Component({
  selector: 'app-seller-register',
  templateUrl: './seller-register.component.html',
  styleUrl: './seller-register.component.scss',
})
export class SellerRegisterComponent {
  constructor(private _SellerService: SellerService, private _Router: Router) {}

  isLoading:boolean=false;
  errorMsg:string='';
  showPassword = false;
  showConfirmPassword = false;
  
  registerForm = new FormGroup({
    name: new FormControl('', { validators: [Validators.required] }),
    email: new FormControl('', {
      validators: [Validators.email, Validators.required]
    }),
    password: new FormControl('', {
      validators: [Validators.required, Validators.minLength(6)]
    }),
    rePassword: new FormControl('', {
      validators: [Validators.required, Validators.minLength(6)]
    }),
    phone: new FormControl('', {
      validators: [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]
    })
  }, { validators: equalValues('password', 'rePassword') });


get name():FormControl{
  return this.registerForm.get('name') as FormControl
}

get email():FormControl{
  return this.registerForm.get('email') as FormControl
}

get password():FormControl{
  return this.registerForm.get('password') as FormControl
}

get rePassword():FormControl{
  return this.registerForm.get('rePassword') as FormControl
}

get phone():FormControl{
  return this.registerForm.get('phone') as FormControl
}

  onSubmit():void {

     if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading=true;
    this.errorMsg='';

    const registerData: Register = {
    name: this.registerForm.value.name!,
    email: this.registerForm.value.email!,
    password: this.registerForm.value.password!,
    rePassword: this.registerForm.value.rePassword!,
    phone: this.registerForm.value.phone!,
  };

  this._SellerService.userSignUp(registerData);
  this._SellerService.isLoginError.subscribe((isError) => {
    this.isLoading = false;
    if (isError) {
      this.errorMsg = 'Account already exists.';
    } else {
      this._Router.navigate(['/auth/seller-login']);
    }
  });
}

  onReset() {
    this.registerForm.reset();
  }
  
  togglePassword() {
    this.showPassword = !this.showPassword;
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
import { Component, OnInit } from '@angular/core';
import { Field } from 'src/app/utils/form/fieldInterface';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastController, LoadingController } from '@ionic/angular';
import { Button } from 'src/app/utils/form/buttonInterface';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit {
  fields: Field[];
  primary: Button;
  secondary:  Button;

  constructor(
    private auth: AngularFireAuth,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private router: Router
  ) { }

  ngOnInit () {
    // Setting this page buttons.
    this.primary = {text: 'Create Account'};
    this.secondary = {
      text: 'Back',
      href: 'auth/login'
    };
    // Setting this page form fields.
    this.fields = [{
      icon: 'at',
      type: 'email',
      color: 'light',
      formControlName: 'registerEmail',
      placeholder: 'Email',
      required: true,
      maxlength: 100
    }, {
      icon: 'lock',
      type: 'password',
      color: 'light',
      formControlName: 'registerPassword',
      placeholder: 'Password',
      required: true,
      minlength: 6
    }, {
      icon: 'lock',
      type: 'password',
      color: 'light',
      formControlName: 'registerConfirmPassword',
      placeholder: 'Confirm Password',
      required: true,
      minlength: 6
    }];
  }

  async submit (form: FormGroup) {
    /*
      A constant error object created outstide of any
      scope since its used at this entire method.
    */
    const error = {
      message: 'Error!',
      color: 'danger',
      showCloseButton: false,
      position: 'top' as 'top',
      duration: 2000
    };

    if (!form || form.status === 'INVALID') {
      // Invalid form
      error.message = 'Fill the fields correctly!';
      const toast = await this.toastController.create(error);
      toast.present();
    } else if (form.controls.registerPassword.value !== form.controls.registerConfirmPassword.value) {
      // Form is valid but the supplied passwords do not match
      error.message = 'Informed passwords are different!';
      const toast = await this.toastController.create(error);
      toast.present();
    } else {
      // Form was filled correctly
      const loading = await this.loadingController.create({
        keyboardClose: true,
        translucent: true
      });
      await loading.present();
      try {
        // Registration attempt
        await this.auth.auth.createUserWithEmailAndPassword(
          form.controls.registerEmail.value,
          form.controls.registerPassword.value
        );
        // Registration Success
        await loading.dismiss();
        const toast = await this.toastController.create({
          message: 'Account created! Check your email : )',
          color: 'success',
          showCloseButton: false,
          position: 'top' as 'top',
          duration: 2000
        });
        toast.present();
        // Redirec to the login page passing the newly created email as an arg.
        this.router.navigate(['auth/login'] , {
          queryParams: { email: form.controls.registerEmail.value }
        });
      } catch (e) {
        // Registration Error
        if (e.message) {
          error.message = e.message;
        }
        const toast = await this.toastController.create(error);
        toast.present();
        await loading.dismiss();
      }
    }
  }
}

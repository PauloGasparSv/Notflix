import { Component, OnInit } from '@angular/core';
import { Field } from 'src/app/utils/form/fieldInterface';
import { Button } from 'src/app/utils/form/buttonInterface';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastController, LoadingController } from '@ionic/angular';
import { FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  fields:  Field[];
  primary: Button;
  secondary: Button;

  constructor(
    private auth: AngularFireAuth,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private storage: Storage
  ) { }

  ngOnInit () {
    /*
      Checking if there is an email in the route query, if there is then
      fill the email field with it.
    */
    const email = this.activatedRoute.snapshot.queryParamMap.get('email');
    // Setting up this page buttons
    this.primary = {text: 'Login'};
    this.secondary = {
      text: 'Signup',
      href: 'auth/register'
    };
    // Setting up this page form fields
    this.fields = [{
      icon: 'at',
      type: 'email',
      color: 'light',
      formControlName: 'loginEmail',
      placeholder: 'Email',
      required: true,
      value: email,
      minlength: 4,
      maxlength: 100,
      autofocus: true
    }, {
      icon: 'lock',
      type: 'password',
      color: 'light',
      formControlName: 'loginPassword',
      placeholder: 'Email',
      required: true,
      minlength: 3,
      maxlength: 100
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
    } else {
      // Form was filled correctly
      const loading = await this.loadingController.create({
        keyboardClose: true,
        translucent: true
      });
      await loading.present();
      try {
        // Login attempt
        const login = await this.auth.auth.signInWithEmailAndPassword(
          form.controls.loginEmail.value,
          form.controls.loginPassword.value
        );
        if (!login || !login.user) {
          throw new Error('Auth error');
        }
        const user = {
          email: login.user.email,
          emailVerified: login.user.emailVerified,
          refreshToken: login.user.refreshToken,
          uid: login.user.uid
        };
        // Storing user data locally. Used to login auto, retrieve data from firestore and more.
        await this.storage.set('user', user);
        // Login success, redirect ot home
        await loading.dismiss();
        this.router.navigate(['home'], {
          queryParams: { emailVerified: user.emailVerified }
        });
      } catch (e) {
        // Login failure
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

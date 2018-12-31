import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { FormComponent } from 'src/app/utils/form/form.component';
import { IonicStorageModule } from '@ionic/storage';
import { IonicModule } from '@ionic/angular';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FIREBASE_CREDENTIALS } from 'src/app/firebase.credentials';
import { ActivatedRoute } from '@angular/router';
import { ActivatedRouteStub } from 'src/app/testing/ActivatedRouteStub';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  let activatedRouteStub: ActivatedRouteStub;

  beforeEach(async(() => {
    activatedRouteStub = new ActivatedRouteStub();

    TestBed.configureTestingModule({
      declarations: [ LoginComponent, FormComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub }
      ],
      imports: [
        AngularFireModule.initializeApp(FIREBASE_CREDENTIALS),
        AngularFireAuthModule,
        AngularFirestoreModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule.forRoot(),
        IonicStorageModule.forRoot()
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should create the login form.', () => {
    const html = fixture.nativeElement;
    const form = html.querySelector('form');
    expect(form).toBeTruthy('Did not find the login form.');
    const loginEmail = html.querySelector('ion-input[ng-reflect-name="loginEmail"]');
    expect(loginEmail).toBeTruthy('Did not find the login email field.');
    const loginPassword = html.querySelector('ion-input[ng-reflect-name="loginPassword"]');
    expect(loginPassword).toBeTruthy('Did not find the login password field.');
  });

  it('should create with the email field filled', () => {
    const email = 'testuser@email.com';
    activatedRouteStub.setQueryParam('email', email);
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const html = fixture.nativeElement;
    const form = html.querySelector('form');
    expect(form).toBeTruthy('Did not find the login form.');
    const loginEmail = html.querySelector('ion-input[ng-reflect-name="loginEmail"]');
    expect(loginEmail).toBeTruthy();
    expect(loginEmail.value).toEqual(email);
  });



});

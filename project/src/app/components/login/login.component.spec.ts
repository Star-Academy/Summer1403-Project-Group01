import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import {provideHttpClient} from "@angular/common/http";
import {By} from "@angular/platform-browser";
import {ReactiveFormsModule} from "@angular/forms";
import {UserService} from "../../services/user/user.service";

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let userService: UserService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [provideHttpClient(), UserService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should render a login form when ever", () => {
    const formElement = fixture.debugElement.query(By.css('form'));
    expect(formElement).toBeTruthy();
  });

  it('should change the eyeclose and inputType attributes when clicked on the eye icon', () => {
    expect(component.eyeclose).withContext('Initial value of eyeclose is false').toEqual(false);
    expect(component.inputType).withContext('Initial value of inputType is password').toEqual('password');
    const spyOnChangeFunction = spyOn(component, 'changeEyes').and.callThrough();

    const eyeIconSlash = fixture.debugElement.query(By.css('ng-icon[name="heroEyeSlash"]'));
    eyeIconSlash.triggerEventHandler('click');
    fixture.detectChanges();

    expect(spyOnChangeFunction).toHaveBeenCalled();
    expect(fixture.componentInstance.eyeclose).withContext('Emitted value of eyeclose is true').toEqual(true);
    expect(fixture.componentInstance.inputType).withContext('Emitted value of inputType is text').toEqual("text");

    const eyeIcon = fixture.debugElement.query(By.css('ng-icon[name="heroEye"]'));
    eyeIcon.triggerEventHandler('click');
    fixture.detectChanges();

    expect(spyOnChangeFunction).toHaveBeenCalledTimes(2);
    expect(fixture.componentInstance.eyeclose).withContext('Emitted value of eyeclose is false').toEqual(false);
    expect(fixture.componentInstance.inputType).withContext('Emitted value of inputType is password').toEqual("password");
  });

  it('should change the value of FormControls for the FormGroup when input changes, also the form submission must be working when ever.',
    () => {
    const identifierInputElement: HTMLInputElement = fixture.nativeElement.querySelector('input[formControlName="identifier"]');
    const passwordInputElement: HTMLInputElement = fixture.nativeElement.querySelector('input[formControlName="password"]');

    identifierInputElement.value = "test";
    identifierInputElement.dispatchEvent(new Event('input'));

    passwordInputElement.value = "test";
    passwordInputElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    expect(component.formGroup.get('identifier')?.value).withContext('Identifier must equal to test').toEqual("test");
    expect(component.formGroup.get('password')?.value).withContext('Password must equal to test').toEqual("test");

    const buttonElement = fixture.nativeElement.querySelector('button[type="submit"]');
    const submitFunctionSpy = spyOn(component, 'onSubmit').and.callThrough();

    buttonElement.click();

    fixture.detectChanges();

    expect(submitFunctionSpy).withContext("The button must trigger the submit event and the onSubmit method must have been called.").toHaveBeenCalled();
  });
});

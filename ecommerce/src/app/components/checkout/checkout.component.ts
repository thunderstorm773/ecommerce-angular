import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NomenclatureFormService } from '../../services/nomenclature-form.service';
import { Country } from '../../common/country';
import { State } from '../../common/state';
import { CheckoutValidator } from '../../validators/checkout-validator';

@Component({
  selector: 'app-checkout',
  standalone: false,
  
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit{

  checkoutFormGroup!: FormGroup;

  totalPrice: number = 0.00;
  totalQuantity: number = 0;
  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(private formBuilder: FormBuilder,
              private nomenclatureFormService: NomenclatureFormService) {}

  ngOnInit(): void {
    this.createCheckoutFormGroup();

    // populate credit card months
    const startMonth = new Date().getMonth() + 1;
    this.subscribeToCreditCardMonths(startMonth);

    // populate credit card years
    this.subscribeToCreditCardYears();

    this.populateCountries();
  }

  createCheckoutFormGroup() {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), CheckoutValidator.checkNotOnlyWhitespace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), CheckoutValidator.checkNotOnlyWhitespace]),
        email: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])
      }),
      shippingAddress: this.formBuilder.group({
        country: [''],
        street: [''],
        city: [''],
        state: [''],
        zipCode: ['']
      }),
      billingAddress: this.formBuilder.group({
        country: [''],
        street: [''],
        city: [''],
        state: [''],
        zipCode: ['']
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: ['']
      })
    });
  }



  onSubmitPurchaseBtn() {
    console.log('Handling the submit purchase button');
    //console.log(this.checkoutFormGroup.get('creditCard')?.value);

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
    }
  }

  copyShippingToBillingAddress(event: Event) {
    const checkboxInput = event.target as HTMLInputElement;
    const billingAddressGroup = this.checkoutFormGroup.controls['billingAddress'];

    if (checkboxInput.checked) {
      const shippingAddressGroup = this.checkoutFormGroup.controls['shippingAddress'];
      billingAddressGroup.setValue(shippingAddressGroup.value);

      this.billingAddressStates = this.shippingAddressStates;
    }else {
      billingAddressGroup.reset();
      this.billingAddressStates = [];
    }
  }

  subscribeToCreditCardMonths(startMonth: number) {
    this.nomenclatureFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        //console.log(`Retrieved credit card months: ` + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );
  }

  subscribeToCreditCardYears() {
    this.nomenclatureFormService.getCreditCardYears().subscribe(
      data => {
        //console.log(`Retrieved credit card years: ` + JSON.stringify(data));
        this.creditCardYears = data;
      }
    );
  }

  handleChangeCreditCardYear() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear = Number(creditCardFormGroup?.value.expirationYear);

    // startMonth equals to 1
    let startMonth: number = 1;

    // startMonth equals to current month if current year is same as selected year
    if(currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    }

    this.subscribeToCreditCardMonths(startMonth);
    creditCardFormGroup?.get('expirationMonth')?.setValue(startMonth);
  }

  populateCountries() {
    this.nomenclatureFormService.getCountries().subscribe(
      data =>  {
        //console.log(`Countries: ${JSON.stringify(data)}`);
        this.countries = data;
      }
    );
  }

  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup?.value.country.code;

    this.nomenclatureFormService.getStates(countryCode).subscribe(
      data => {
        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
        } else {
          this.billingAddressStates = data;
        }

        // set as default first state
        formGroup?.get('state')?.setValue(data[0]);
      }
    );
  }

  get firstName() {
    return this.checkoutFormGroup.get('customer.firstName');
  }

  get lastName() {
    return this.checkoutFormGroup.get('customer.lastName');
  }

  get email() {
    return this.checkoutFormGroup.get('customer.email');
  }
}

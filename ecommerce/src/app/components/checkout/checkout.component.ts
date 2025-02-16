import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NomenclatureFormService } from '../../services/nomenclature-form.service';

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

  constructor(private formBuilder: FormBuilder,
              private nomenclatureFormService: NomenclatureFormService) {}

  ngOnInit(): void {
    this.createCheckoutFormGroup();

    // populate credit card months
    const startMonth = new Date().getMonth() + 1;
    this.subscribeToCreditCardMonths(startMonth);

    // populate credit card years
    this.subscribeToCreditCardYears();
  }

  createCheckoutFormGroup() {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
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
    console.log(this.checkoutFormGroup.get('creditCard')?.value);
  }

  copyShippingToBillingAddress(event: Event) {
    const checkboxInput = event.target as HTMLInputElement;
    const billingAddressGroup = this.checkoutFormGroup.controls['billingAddress'];

    if (checkboxInput.checked) {
      const shippingAddressGroup = this.checkoutFormGroup.controls['shippingAddress'];
      billingAddressGroup.setValue(shippingAddressGroup.value);
    }else {
      billingAddressGroup.reset();
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
}

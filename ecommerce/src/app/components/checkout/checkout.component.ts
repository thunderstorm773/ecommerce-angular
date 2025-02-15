import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  standalone: false,
  
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit{

  checkoutFormGroup!: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
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
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NomenclatureFormService } from '../../services/nomenclature-form.service';
import { Country } from '../../common/country';
import { State } from '../../common/state';
import { FormValidator } from '../../validators/form-validator';
import { CartService } from '../../services/cart.service';
import { CheckoutService } from '../../services/checkout.service';
import { Router } from '@angular/router';
import { Order } from '../../common/order';
import { OrderItem } from '../../common/order-item';
import { Address } from '../../common/address';
import { Customer } from '../../common/customer';
import { Purchase } from '../../common/purchase';
import { environment } from '../../../environments/environment';
import { PaymentInfo } from '../../common/payment-info';
import { ToastService } from '../../services/toast.service';

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

  storage: Storage = sessionStorage;

  stripe = Stripe(environment.stripePublishableKey);
  paymentInfo: PaymentInfo = new PaymentInfo();
  cardElement: any;
  displayError: any = "";
  isDisabled: boolean = false;

  constructor(private formBuilder: FormBuilder,
              private nomenclatureFormService: NomenclatureFormService,
              private cartService: CartService,
              private checkoutService: CheckoutService,
              private toastService: ToastService,
              private router: Router) {}

  ngOnInit(): void {

    this.setupStripePaymentForm();
    this.createCheckoutFormGroup();

    this.populateCountries();
    this.reviewCartDetails();
  }

  setupStripePaymentForm() {
    var elements = this.stripe.elements();
    this.cardElement = elements.create('card', {hidePostalCode: true});

    this.cardElement.mount('#card-element');
    this.cardElement.on('change', (event: any) => {

      this.displayError = document.getElementById('card-errors');
      if(event.complete) {
        this.displayError.textContent = '';
      } else if (event.error) { 
        this.displayError.textContent = event.error.message;
      }
    });
  }

  createCheckoutFormGroup() {
    const userEmail = JSON.parse(this.storage.getItem('userEmail')!);
    
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), FormValidator.checkNotOnlyWhitespace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), FormValidator.checkNotOnlyWhitespace]),
        email: new FormControl(userEmail, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])
      }),
      shippingAddress: this.formBuilder.group({
        country: new FormControl('', [Validators.required]),
        state: new FormControl('', [Validators.required]),
        street: new FormControl('', [Validators.required, Validators.minLength(2), FormValidator.checkNotOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), FormValidator.checkNotOnlyWhitespace]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), FormValidator.checkNotOnlyWhitespace])
      }),
      billingAddress: this.formBuilder.group({
        country: new FormControl('', [Validators.required]),
        state: new FormControl('', [Validators.required]),
        street: new FormControl('', [Validators.required, Validators.minLength(2), FormValidator.checkNotOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), FormValidator.checkNotOnlyWhitespace]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), FormValidator.checkNotOnlyWhitespace])
      }),
      creditCard: this.formBuilder.group({
        /*
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2), CheckoutValidator.checkNotOnlyWhitespace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: new FormControl('', [Validators.required]),
        expirationYear: new FormControl('', [Validators.required])
        */
      })
    });
  }

  onSubmitPurchaseBtn() {
    //console.log('Handling the submit purchase button');
    //console.log(this.checkoutFormGroup.get('creditCard')?.value);

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    // set up purchase and call REST API
    let order = this.createOrderObj();
    let orderItems = this.createOrderItemsObj();
    let shippingAddress = this.createAddressObj('shippingAddress');
    let billingAddress = this.createAddressObj('billingAddress');
    let customer = this.createCustomerObj();
    let purchase = this.createPurchaseObj(order, orderItems, shippingAddress, billingAddress, customer);

    // compute payment info
    this.paymentInfo.amount = Math.round(this.totalPrice * 100);
    this.paymentInfo.currency = 'USD';
    this.paymentInfo.receiptEmail = purchase.customer.email;

    // check if form checkout form is valid
    if (!this.checkoutFormGroup.invalid && this.displayError.textContent === '') {
      this.isDisabled = true;
      this.callStripePaymentIntent(purchase);
    } else {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
  }

  callStripePaymentIntent(purchase: Purchase) {
    this.checkoutService.createPaymentIntent(this.paymentInfo).subscribe(
      (paymentIntentRes) => {
        this.stripe.confirmCardPayment(paymentIntentRes.client_secret, 
        {
          payment_method: {
            card: this.cardElement,
            billing_details: {
              email: purchase.customer.email,
              name: `${purchase.customer.firstName} ${purchase.customer.lastName}`,
              address: {
                line1: purchase.billingAddress.street,
                city: purchase.billingAddress.city,
                state: purchase.billingAddress.state,
                postal_code: purchase.billingAddress.zipCode,
                country: this.billingAddressCountry?.value.code
              }
            }
          }
        }, {handleActions: false })
        .then((result: any) => {
          if (result.error) {
            // there is error
            this.toastService.show({message: `There was an error: ${result.error.message}`, className: 'bg-danger text-light' });
            this.isDisabled = false;
          } else {
            // call checkout REST API
            this.checkoutService.placeOrder(purchase).subscribe({
              next: (response: any) => {
                this.toastService.show({message: `Your order has been received`, 
                                        className: 'bg-success-toast text-light' });
                this.isDisabled = false;
                this.resetCart();
              },
              error: (err: any) => {
                this.toastService.show({message: `There was an error: ${err.message}`, className: 'bg-danger text-light' });
                this.isDisabled = false;
              }
            });
          }
        })
    });
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

  reviewCartDetails() {
    // subscribe to cartService totalPrice
    this.cartService.totalPrice.subscribe(
      data => {
        this.totalPrice = data
      }
    );


    // subscribe to cartService totalQuantity
    this.cartService.totalQuantity.subscribe(
      data => {
        this.totalQuantity = data;
      }
    );
  }

  createOrderObj(): Order {
    return new Order(this.totalQuantity, this.totalPrice);
  }

  createOrderItemsObj(): OrderItem[] {
    return this.cartService.cartItems.map(item => new OrderItem(item));
  }

  createAddressObj(formGroupControlName: string): Address {
    const formGroup = this.checkoutFormGroup.controls[formGroupControlName].value;
    const countryState: State = JSON.parse(JSON.stringify(formGroup.state));
    const country: Country = JSON.parse(JSON.stringify(formGroup.country));
    return new Address(formGroup.street, formGroup.city, country.name, countryState.name, formGroup.zipCode);
  }

  createCustomerObj(): Customer {
    const formGroup = this.checkoutFormGroup.controls['customer'].value;
    return new Customer(formGroup.firstName, formGroup.lastName, formGroup.email);
  }

  createPurchaseObj(order: Order, orderItems: OrderItem[], shippingAddress: Address,
                    billingAddress: Address, customer: Customer): Purchase {
    return new Purchase(customer, shippingAddress, billingAddress, order, orderItems);
  }

  resetCart() {
    // reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    this.cartService.persistCartItems();

    // reset the form
    this.checkoutFormGroup.reset();

    // navigate back to the products page
    this.router.navigateByUrl('/products');
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

  get shippingAddressStreet() {
    return this.checkoutFormGroup.get('shippingAddress.street');
  }

  get shippingAddressCity() {
    return this.checkoutFormGroup.get('shippingAddress.city');
  }

  get shippingAddressZipCode() {
    return this.checkoutFormGroup.get('shippingAddress.zipCode');
  }

  get shippingAddressCountry() {
    return this.checkoutFormGroup.get('shippingAddress.country');
  }

  get shippingAddressState() {
    return this.checkoutFormGroup.get('shippingAddress.state');
  }

  get billingAddressStreet() {
    return this.checkoutFormGroup.get('billingAddress.street');
  }

  get billingAddressCity() {
    return this.checkoutFormGroup.get('billingAddress.city');
  }

  get billingAddressZipCode() {
    return this.checkoutFormGroup.get('billingAddress.zipCode');
  }

  get billingAddressCountry() {
    return this.checkoutFormGroup.get('billingAddress.country');
  }

  get billingAddressState() {
    return this.checkoutFormGroup.get('billingAddress.state');
  }
}
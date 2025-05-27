import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { Coupon } from '../../common/coupon';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CouponService } from '../../services/coupon.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-admin-coupons',
  standalone: false,
  
  templateUrl: './admin-coupons.component.html',
  styleUrl: './admin-coupons.component.css'
})
export class AdminCouponsComponent implements OnInit {

  coupons: Coupon[] = [];
  selectedCouponId?: number;
  modalService = inject(NgbModal);

  // pagination properties
  currentPageNumber: number = 1;
  pageSize: number = 20;
  totalElements: number = 0;

  constructor(private couponService: CouponService,
              private toastService: ToastService) { }

  ngOnInit(): void {
    this.listCoupons();
  }
  
  listCoupons() {
    this.couponService.getAllCouponsPaginate(this.currentPageNumber, this.pageSize)
                      .subscribe(data => this.processResult(data));
  }

  updatePageSize(pageSize: string) {
    this.pageSize = +pageSize;
    this.currentPageNumber = 1;
    this.listCoupons();
  }

  processResult(data: any) {
    this.coupons = data.content;
    this.currentPageNumber = data.number + 1;
    this.pageSize = data.size;
    this.totalElements = data.totalElements;
  }

  open(content: TemplateRef<any>, couponId: number) {
        this.selectedCouponId = couponId;
        this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true });
  }

  deleteCoupon(couponId?: number) {
    if (couponId) {
      this.modalService.dismissAll();
    }

    console.log('Deleting coupon with ID:', couponId);
  }
}

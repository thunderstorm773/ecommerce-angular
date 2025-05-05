import { Component, OnInit } from '@angular/core';
import { Coupon } from '../../common/coupon';
import { CouponService } from '../../services/coupon.service';

@Component({
  selector: 'app-members-page',
  standalone: false,
  
  templateUrl: './members-page.component.html',
  styleUrl: './members-page.component.css'
})
export class MembersPageComponent implements OnInit {

  activeCoupons: Coupon[] = [];

  // pagination properties
  currentPageNumber: number = 1;
  pageSize: number = 20;
  totalElements: number = 0;
  
  constructor(private couponService: CouponService) { }

  ngOnInit(): void {
    this.listActiveCoupons();
  }

  listActiveCoupons() {
    this.couponService.getActiveCouponsPaginate(this.currentPageNumber, this.pageSize)
                      .subscribe(data => this.processResult(data));
  }

  updatePageSize(pageSize: string) {
    this.pageSize = +pageSize;
    this.currentPageNumber = 1;
    this.listActiveCoupons();
  }

  processResult(data: any) {
    this.activeCoupons = data.content;
    this.currentPageNumber = data.number + 1;
    this.pageSize = data.size;
    this.totalElements = data.totalElements;
  }
}

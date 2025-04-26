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
  
  constructor(private couponService: CouponService) { }

  ngOnInit(): void {
    this.handleActiveCoupons();
  }

  handleActiveCoupons() {
    this.couponService.getActiveCoupons().subscribe(
      data => {
        this.activeCoupons = data.content
      }
    );
  }
}

import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { OrderHistory } from '../../common/order-history';
import { CurrencyService } from '../../services/currency.service';
import { OrderHistoryService } from '../../services/order-history.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-admin-orders',
  standalone: false,
  
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.css'
})
export class AdminOrdersComponent implements OnInit {

  ordersList: OrderHistory[] = [];
  selectedOrderId?: number;
  modalService = inject(NgbModal);
  
  // pagination properties
  currentPageNumber: number = 1;
  pageSize: number = 20;
  totalElements: number = 0;
  
  constructor(public currencyService: CurrencyService,
              private orderHistoryService: OrderHistoryService,
              private toastService: ToastService) { }
  
  ngOnInit(): void {
    this.listOrders();
  }
  
  listOrders() {
    this.orderHistoryService.getAllOrdersPaginate(this.currentPageNumber, this.pageSize)
                            .subscribe(data => this.processResult(data));
  }
  
  updatePageSize(pageSize: string) {
    this.pageSize = +pageSize;
    this.currentPageNumber = 1;
    this.listOrders();
  }
  
  processResult(data: any) {
    this.ordersList = data.content;
    this.currentPageNumber = data.number + 1;
    this.pageSize = data.size;
    this.totalElements = data.totalElements;
  }

  open(content: TemplateRef<any>, orderId: number) {
    this.selectedOrderId = orderId;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true });
  }
  
  processOrder(orderId?: number) {
    if (orderId) {
      this.modalService.dismissAll();
  
      this.orderHistoryService.processOrder(orderId).subscribe({
        next: (data) => {
          this.toastService.show({message: 'Order processed successfully', className: 'bg-success-toast text-light' });
      
          this.listOrders();
        },
        error: (err) => {
          this.toastService.show({message: `Error processing order: ${err.error.message}`,
                                  className: 'bg-danger text-light' });
        }
      });
    }
  }
  
  rejectOrder(orderId?: number) {
    if (orderId) {
      this.modalService.dismissAll();
  
      this.orderHistoryService.rejectOrder(orderId).subscribe({
          next: (data) => {
            this.toastService.show({message: 'Order rejected successfully', className: 'bg-success-toast text-light' });
      
            this.listOrders();
          },
          error: (err) => {
            this.toastService.show({message: `Error rejecting order: ${err.error.message}`, 
                                    className: 'bg-danger text-light' });
          }
        });
      }
    }
}

import { Component, inject, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../services/toast.service';
import { SystemParameterService } from '../../services/system-parameter.service';
import { SystemParameter } from '../../common/system-parameter';

@Component({
  selector: 'app-admin-system-parameters',
  standalone: false,
  
  templateUrl: './admin-system-parameters.component.html',
  styleUrl: './admin-system-parameters.component.css'
})
export class AdminSystemParametersComponent implements OnInit {

  systemParameters: SystemParameter[] = [];
  modalService = inject(NgbModal);

  // pagination properties
  currentPageNumber: number = 1;
  pageSize: number = 20;
  totalElements: number = 0;

  constructor(private systemParameterService: SystemParameterService) { }

  ngOnInit(): void {
    this.listSystemParameters();
  }

  listSystemParameters() {
    this.systemParameterService.getSystemParametersPaginate(this.currentPageNumber, this.pageSize)
                               .subscribe(data => this.processResult(data));
  }

  updatePageSize(pageSize: string) {
    this.pageSize = +pageSize;
    this.currentPageNumber = 1;
    this.listSystemParameters();
  }

  processResult(data: any) {
    this.systemParameters = data.content;
    this.currentPageNumber = data.number + 1;
    this.pageSize = data.size;
    this.totalElements = data.totalElements;
  }
}

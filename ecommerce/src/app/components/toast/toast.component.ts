import { Component, inject, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: false,
  
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent implements OnInit, OnDestroy {
	
	constructor(public toastService: ToastService) { }

	ngOnInit(): void {
	}

  ngOnDestroy(): void {
      this.toastService.clear();
  }
}

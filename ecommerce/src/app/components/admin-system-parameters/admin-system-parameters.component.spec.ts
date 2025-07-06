import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSystemParametersComponent } from './admin-system-parameters.component';

describe('AdminSystemParametersComponent', () => {
  let component: AdminSystemParametersComponent;
  let fixture: ComponentFixture<AdminSystemParametersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminSystemParametersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSystemParametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAddSystemParameterComponent } from './admin-add-system-parameter.component';

describe('AdminAddSystemParameterComponent', () => {
  let component: AdminAddSystemParameterComponent;
  let fixture: ComponentFixture<AdminAddSystemParameterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminAddSystemParameterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAddSystemParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEditSystemParameterComponent } from './admin-edit-system-parameter.component';

describe('AdminEditSystemParameterComponent', () => {
  let component: AdminEditSystemParameterComponent;
  let fixture: ComponentFixture<AdminEditSystemParameterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminEditSystemParameterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminEditSystemParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotaoCancelarComponent } from './botao-cancelar.component';

describe('BotaoCancelarComponent', () => {
  let component: BotaoCancelarComponent;
  let fixture: ComponentFixture<BotaoCancelarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotaoCancelarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BotaoCancelarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

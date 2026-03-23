import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotaoAprovarComponent } from './botao-aprovar.component';

describe('BotaoAprovarComponent', () => {
  let component: BotaoAprovarComponent;
  let fixture: ComponentFixture<BotaoAprovarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotaoAprovarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BotaoAprovarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

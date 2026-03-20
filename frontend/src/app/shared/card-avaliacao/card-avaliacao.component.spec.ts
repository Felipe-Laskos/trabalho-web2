import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardAvaliacaoComponent } from './card-avaliacao.component';

describe('CardAvaliacaoComponent', () => {
  let component: CardAvaliacaoComponent;
  let fixture: ComponentFixture<CardAvaliacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardAvaliacaoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardAvaliacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

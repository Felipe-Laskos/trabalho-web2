import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardVisualizacaoComponent } from './card-visualizacao.component';

describe('CardVisualizacaoComponent', () => {
  let component: CardVisualizacaoComponent;
  let fixture: ComponentFixture<CardVisualizacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardVisualizacaoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardVisualizacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

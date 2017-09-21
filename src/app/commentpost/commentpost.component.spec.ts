import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentpostComponent } from './commentpost.component';

describe('CommentpostComponent', () => {
  let component: CommentpostComponent;
  let fixture: ComponentFixture<CommentpostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommentpostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentpostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

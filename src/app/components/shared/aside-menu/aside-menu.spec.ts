import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AsideMenuComponent } from './aside-menu';

describe('AsideMenuComponent', () => {
	let component: AsideMenuComponent;
	let fixture: ComponentFixture<AsideMenuComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [AsideMenuComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(AsideMenuComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('aside', {
			id: 'main',
			title: 'Main',
			items: []
		} as any);
		fixture.componentRef.setInput('activeRoute', '/');
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

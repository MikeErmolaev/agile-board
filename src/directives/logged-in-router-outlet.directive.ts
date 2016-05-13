import { ElementRef, DynamicComponentLoader, AttributeMetadata, Directive, Attribute } from 'angular2/core';
import { Router, RouterOutlet, ComponentInstruction } from 'angular2/router';
import { AuthService } from '../services/auth.service';

@Directive({
	selector: 'logged-in-router-outlet'
})
export class LoggedInRouterOutlet extends RouterOutlet {
	publicRoutes: Array<string> = [
		'', 'welcome', 'auth', 'signup', 'login'
	];
	
	private router: Router;

	constructor(elementRef: ElementRef, loader: DynamicComponentLoader, parentRouter: Router, @Attribute('name') nameAttr: string, private authService: AuthService) {
		super(elementRef, loader, parentRouter, nameAttr);
	
		this.router = parentRouter;
	}

	activate(instruction: ComponentInstruction) {
		if (this.canActivate(instruction.urlPath)) {
			return super.activate(instruction);
		} else {
			this.router.navigate(['Welcome']);
		}
	}

	private canActivate(url) {
		return this.publicRoutes.indexOf(url) !== -1 || this.authService.isAuthorized();
	}

}
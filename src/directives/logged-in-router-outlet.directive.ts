import { ViewContainerRef, DynamicComponentLoader, AttributeMetadata, Directive, Attribute } from 'angular2/core';
import { Router, RouterOutlet, ComponentInstruction } from 'angular2/router';
import { AuthService } from '../services/auth.service';

@Directive({
	selector: 'logged-in-router-outlet'
})
export class LoggedInRouterOutlet extends RouterOutlet {
	publicRoutes: Array<string> = [
		'welcome', 'auth', 'signup', 'login'
	];
	
	private router: Router;

	constructor(containerRef: ViewContainerRef, loader: DynamicComponentLoader, parentRouter: Router, @Attribute('name') nameAttr: string, private authService: AuthService) {
		super(containerRef, loader, parentRouter, nameAttr);
	
		this.router = parentRouter;
	}

	activate(instruction: ComponentInstruction) {
		return this.canActivate(instruction.urlPath).then(res => {
			if (res) {
				return super.activate(instruction);
			} else {
				this.router.navigate(['Welcome']);
			}
		});
	}

	private canActivate(url) {
		return new Promise((resolve, reject) => {
			if (this.publicRoutes.indexOf(url) !== -1) {
				resolve(true);	
			} else {
				this.authService.isAuthorized().then(resolve);
			}
		});
	}

}
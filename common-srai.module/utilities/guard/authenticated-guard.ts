import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { UserResolver, ApplicationRoutes } from '@srai.cms25.core.module';

@Injectable()
export class AuthenticatedGuard implements CanActivate {

    constructor(
        private readonly _userService: UserResolver,
        private readonly _router: Router
    ) { }

    public canActivate(): boolean {
        // Check whether the authorization call finished or not.
        if (!this._userService.onReady.getValue()) {
            // Authorisation still in progress. We can't decide whether user is authorised to view the page or not.
            // Anyway, if user is not authorised, redirection to not-authorized view is handled in the app.component.
            return true;
        }
        // If authentication and authorization finished, now you can decide it.
        if (!this._userService.isAuthorized) {
            this._router.navigate([ApplicationRoutes.notAuthorized], { skipLocationChange: true });
            return false;
        }
        return true;
    }
}

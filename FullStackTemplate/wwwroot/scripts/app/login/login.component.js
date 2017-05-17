"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var material_1 = require("@angular/material");
var index_1 = require("../authentication/index");
var register_1 = require("../models/register");
//import { LoginDialog } from '../dialog/login-dialog'
//import { RegisterDialog } from '../dialog/register-dialog'
var LoginComponent = (function () {
    function LoginComponent(dialog, doc, authenticationService) {
        this.dialog = dialog;
        this.authenticationService = authenticationService;
        // Possible useful example for the open and closeAll events.
        // Adding a class to the body if a dialog opens and
        // removing it after all open dialogs are closed
        dialog.afterOpen.subscribe(function (ref) {
            if (!doc.body.classList.contains('no-scroll')) {
                doc.body.classList.add('no-scroll');
            }
        });
        dialog.afterAllClosed.subscribe(function () {
            doc.body.classList.remove('no-scroll');
        });
    }
    LoginComponent.prototype.ngOnInit = function () {
        console.log('OnInit');
        this.initLoggedInUser();
    };
    LoginComponent.prototype.openLoginDialog = function () {
        var _this = this;
        var dialogRef = this.dialog.open(LoginDialog);
        dialogRef.afterClosed().subscribe(function (result) {
            _this.initLoggedInUser();
            console.log('currentUser : ', _this.user);
        });
    };
    LoginComponent.prototype.initLoggedInUser = function () {
        this.user = this.authenticationService.getCurrentUser();
        if (this.user) {
            this.isLoggeIn = true;
        }
        else {
            this.isLoggeIn = false;
        }
    };
    LoginComponent.prototype.logout = function () {
        this.authenticationService.logout()
            .subscribe(function (data) {
            console.log('user is logged out');
        }, function (error) {
            console.log('logout failed');
        });
        this.isLoggeIn = false;
        this.user = null;
    };
    LoginComponent.prototype.openRegisterDialog = function () {
        var _this = this;
        var dialogRef = this.dialog.open(RegisterDialog);
        dialogRef.afterClosed().subscribe(function (result) {
            _this.initLoggedInUser();
            console.log('currentUser : ', _this.user);
        });
    };
    return LoginComponent;
}());
LoginComponent = __decorate([
    core_1.Component({
        selector: 'login-component',
        templateUrl: './templates/login/login-component.html'
    }),
    __param(1, core_1.Inject(platform_browser_1.DOCUMENT)),
    __metadata("design:paramtypes", [material_1.MdDialog, Object, index_1.AuthenticationService])
], LoginComponent);
exports.LoginComponent = LoginComponent;
var LoginDialog = (function () {
    function LoginDialog(dialogRef, authenticationService) {
        this.dialogRef = dialogRef;
        this.authenticationService = authenticationService;
        this.loading = false;
        this.model = {};
        this.loginError = '';
    }
    LoginDialog.prototype.login = function () {
        var _this = this;
        this.loading = true;
        this.authenticationService.login(this.model.email, this.model.password)
            .subscribe(function (data) {
            //this.router.navigate([this.returnUrl]);
            console.log('user is logged in');
            _this.dialogRef.close('Logged in');
        }, function (error) {
            console.log('login failed');
            _this.loginError = 'Login failed due to server error. Please try again.';
            _this.loading = false;
        });
    };
    return LoginDialog;
}());
LoginDialog = __decorate([
    core_1.Component({
        selector: 'login-control',
        templateUrl: './templates/dialog/login-dialog.html'
    }),
    __metadata("design:paramtypes", [material_1.MdDialogRef, index_1.AuthenticationService])
], LoginDialog);
exports.LoginDialog = LoginDialog;
var RegisterDialog = (function () {
    //model: Register;
    function RegisterDialog(dialogRef, authenticationService, model) {
        this.dialogRef = dialogRef;
        this.authenticationService = authenticationService;
        this.model = model;
        this.loading = false;
    }
    RegisterDialog.prototype.register = function () {
        var _this = this;
        this.loading = true;
        this.authenticationService.register(this.model)
            .subscribe(function (data) {
            //this.router.navigate([this.returnUrl]);
            console.log('user is logged in');
            _this.dialogRef.close('Logged in');
        }, function (error) {
            console.log('login failed');
            _this.loading = false;
        });
    };
    return RegisterDialog;
}());
RegisterDialog = __decorate([
    core_1.Component({
        selector: 'login-control',
        templateUrl: './templates/dialog/register-dialog.html',
    }),
    __metadata("design:paramtypes", [material_1.MdDialogRef, index_1.AuthenticationService, register_1.Register])
], RegisterDialog);
exports.RegisterDialog = RegisterDialog;
//# sourceMappingURL=login.component.js.map
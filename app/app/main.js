var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
System.register("app.component", ['angular2/core'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var core_1;
    var AppComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            AppComponent = (function () {
                function AppComponent() {
                }
                AppComponent = __decorate([
                    core_1.Component({
                        selector: 'my-app',
                        template: '<h1>My First Angular 2 App!!!1</h1>'
                    }), 
                    __metadata('design:paramtypes', [])
                ], AppComponent);
                return AppComponent;
            }());
            exports_1("AppComponent", AppComponent);
        }
    }
});
System.register("app.component.spec", ["app.component", 'angular2/testing', 'angular2/platform/browser'], function(exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var app_component_1, testing_1, browser_1;
    return {
        setters:[
            function (app_component_1_1) {
                app_component_1 = app_component_1_1;
            },
            function (testing_1_1) {
                testing_1 = testing_1_1;
            },
            function (browser_1_1) {
                browser_1 = browser_1_1;
            }],
        execute: function() {
            testing_1.describe('Smoke test', function () {
                testing_1.it('should run a passing test', function () {
                    testing_1.expect(true).toEqual(true, 'should pass');
                });
            });
            testing_1.describe('AppComponent with new', function () {
                testing_1.it('should instantiate component', function () {
                    testing_1.expect(new app_component_1.AppComponent()).toBeDefined('Whoopie!');
                });
            });
            testing_1.describe('AppComponent with TCB', function () {
                testing_1.it('should instantiate component', testing_1.async(testing_1.inject([testing_1.TestComponentBuilder], function (tcb) {
                    tcb.createAsync(app_component_1.AppComponent).then(function (fixture) {
                        testing_1.expect(fixture.componentInstance instanceof app_component_1.AppComponent).toBe(true, 'should create AppComponent');
                    });
                })));
                testing_1.it('should have expected <h1> text', testing_1.async(testing_1.inject([testing_1.TestComponentBuilder], function (tcb) {
                    tcb.createAsync(app_component_1.AppComponent).then(function (fixture) {
                        var h1 = fixture.debugElement.query(function (el) { return el.name === 'h1'; }).nativeElement;
                        h1 = fixture.debugElement.query(browser_1.By.css('h1')).nativeElement;
                        testing_1.expect(h1.innerText).toMatch(/angular 2 app/i, '<h1> should say something about "Angular 2 App"');
                    });
                })));
            });
        }
    }
});
System.register("main", ['angular2/platform/browser', "app.component"], function(exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    var browser_2, app_component_2;
    return {
        setters:[
            function (browser_2_1) {
                browser_2 = browser_2_1;
            },
            function (app_component_2_1) {
                app_component_2 = app_component_2_1;
            }],
        execute: function() {
            browser_2.bootstrap(app_component_2.AppComponent);
        }
    }
});

//# sourceMappingURL=main.js.map

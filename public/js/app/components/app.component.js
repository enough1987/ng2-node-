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
var core_1 = require('@angular/core');
var storage_service_1 = require("../services/storage.service");
var objectToArray_pipe_1 = require("../pipes/objectToArray.pipe");
var AppComponent = (function () {
    function AppComponent(storageService) {
        this.storageService = storageService;
        this.new_component = this.init_new_component();
        this.components = [];
        this.field_editable = [];
    }
    AppComponent.prototype.ngOnInit = function () {
        console.log('ngOnInit');
        this.get_all_components();
    };
    ;
    AppComponent.prototype.init_new_component = function (mutability) {
        if (mutability === void 0) { mutability = ''; }
        return {
            mutability: mutability
        };
    };
    ;
    AppComponent.prototype.set_new_component_mutability = function (mutability) {
        this.new_component = this.init_new_component(mutability);
    };
    ;
    AppComponent.prototype.get_all_components = function () {
        var _this = this;
        this.storageService.select('/api/components').
            subscribe(function (res) {
            console.log('get - ', res);
            if (!res.error)
                _this.components = res.components;
        });
    };
    ;
    AppComponent.prototype.create_component = function () {
        var _this = this;
        console.log(this.components);
        if (!this.new_component.name) {
            console.log(' no name was provided ');
            return;
        }
        if (this.exist_component_whith_this_name()) {
            console.log(' component with such name exists ');
            return;
        }
        this.storageService.insert('/api/components', {
            name: this.new_component.name,
            group: this.new_component.group || '',
            mutability: this.new_component.mutability,
            body: []
        }).
            subscribe(function (res) {
            console.log('post - ', res);
            console.log(res.msg);
            if (!res.error) {
                _this.components = res.components;
                _this.new_component = _this.init_new_component(_this.new_component.mutability);
            }
        });
    };
    ;
    AppComponent.prototype.change_component = function (component) {
        var _this = this;
        if (!component.new_name) {
            console.log('no name was provided ');
            return;
        }
        if (this.exist_component_whith_this_name(component.new_name)) {
            console.log(' component with such name exists ');
            return;
        }
        this.storageService.update('/api/components', {
            id: component._id,
            name: component.new_name,
            group: component.group,
            mutability: this.new_component.mutability,
            body: component.body
        }).
            subscribe(function (res) {
            console.log('put - ', res);
            if (!res.error)
                _this.components = res.components;
        });
    };
    ;
    AppComponent.prototype.copy_component = function (component) {
        var _this = this;
        if (!component.new_name) {
            console.log('no name was provided ');
            return;
        }
        if (this.exist_component_whith_this_name(component.new_name)) {
            console.log(' component with such name exists ');
            return;
        }
        this.storageService.insert('/api/components', {
            name: component.new_name,
            group: component.group,
            mutability: component.mutability,
            body: component.body
        }).
            subscribe(function (res) {
            console.log('post - ', res);
            console.log(res.msg);
            if (!res.error)
                _this.components = res.components;
        });
    };
    ;
    AppComponent.prototype.delete_component = function (id) {
        var _this = this;
        if (!id) {
            console.log('no id was provided ');
            return;
        }
        this.storageService.delete('/api/components', id).
            subscribe(function (res) {
            console.log('delete - ', res);
            if (!res.error)
                _this.components = res.components;
        });
    };
    ;
    AppComponent.prototype.exist_component_whith_this_name = function (name) {
        if (name === void 0) { name = this.new_component.name; }
        if (this.components.find(function (el) { return el.name === name ? true : false; }))
            return true;
        return false;
    };
    ;
    AppComponent.prototype.edit_fields_component = function (component) {
        this.field_editable = component;
    };
    ;
    AppComponent.prototype.show_fields_component = function (component) {
        console.log(this.field_editable, component);
        if (this.field_editable &&
            this.field_editable._id === component._id)
            return true;
    };
    ;
    // return unique id
    AppComponent.prototype.create_guid = function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    };
    ;
    //  Returns a deep copy of the object
    AppComponent.prototype.deepCopy = function (oldObj) {
        var newObj = oldObj;
        if (oldObj && typeof oldObj === "object") {
            newObj = Object.prototype.toString.call(oldObj) === "[object Array]" ? [] : {};
            for (var i in oldObj) {
                newObj[i] = this.deepCopy(oldObj[i]);
            }
        }
        return newObj;
    };
    ;
    AppComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'my-app',
            templateUrl: 'app.template.html',
            styleUrls: ['app.style.css'],
            providers: [storage_service_1.StorageService],
            pipes: [objectToArray_pipe_1.ObjectToArrayPipe]
        }), 
        __metadata('design:paramtypes', [storage_service_1.StorageService])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvYXBwLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEscUJBQTBCLGVBQWUsQ0FBQyxDQUFBO0FBRTFDLGdDQUE2Qiw2QkFBNkIsQ0FBQyxDQUFBO0FBQzNELG1DQUFnQyw2QkFBNkIsQ0FBQyxDQUFBO0FBVTlEO0lBS0ksc0JBQW1CLGNBQThCO1FBQTlCLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQUoxQyxrQkFBYSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBQzFDLGVBQVUsR0FBRyxFQUFFLENBQUM7UUFDaEIsbUJBQWMsR0FBRyxFQUFFLENBQUM7SUFFeUIsQ0FBQztJQUVyRCwrQkFBUSxHQUFSO1FBQ0ksT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN4QixJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztJQUM5QixDQUFDOztJQUVELHlDQUFrQixHQUFsQixVQUFtQixVQUFlO1FBQWYsMEJBQWUsR0FBZixlQUFlO1FBQzlCLE1BQU0sQ0FBQztZQUNILFVBQVUsRUFBRyxVQUFVO1NBQzFCLENBQUM7SUFDTixDQUFDOztJQUVELG1EQUE0QixHQUE1QixVQUE2QixVQUFVO1FBQ25DLElBQUksQ0FBQyxhQUFhLEdBQUksSUFBSSxDQUFDLGtCQUFrQixDQUFFLFVBQVUsQ0FBRSxDQUFDO0lBQ2hFLENBQUM7O0lBR0QseUNBQWtCLEdBQWxCO1FBQUEsaUJBTUM7UUFMRyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBRTtZQUMxQyxTQUFTLENBQUUsVUFBQSxHQUFHO1lBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBRSxRQUFRLEVBQUcsR0FBRyxDQUFFLENBQUM7WUFDOUIsRUFBRSxDQUFBLENBQUUsQ0FBQyxHQUFHLENBQUMsS0FBTSxDQUFDO2dCQUFDLEtBQUksQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQztRQUN0RCxD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b21wb25lbnRzL2FwcC5jb21wb25lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbmltcG9ydCB7U3RvcmFnZVNlcnZpY2V9IGZyb20gXCIuLi9zZXJ2aWNlcy9zdG9yYWdlLnNlcnZpY2VcIjtcclxuaW1wb3J0IHtPYmplY3RUb0FycmF5UGlwZX0gZnJvbSBcIi4uL3BpcGVzL29iamVjdFRvQXJyYXkucGlwZVwiO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgICBtb2R1bGVJZDogbW9kdWxlLmlkLCBcclxuICAgIHNlbGVjdG9yOiAnbXktYXBwJyxcclxuICAgIHRlbXBsYXRlVXJsOiAnYXBwLnRlbXBsYXRlLmh0bWwnLFxyXG4gICAgc3R5bGVVcmxzOiBbJ2FwcC5zdHlsZS5jc3MnXSxcclxuICAgIHByb3ZpZGVyczogW1N0b3JhZ2VTZXJ2aWNlXSxcclxuICAgIHBpcGVzOiBbT2JqZWN0VG9BcnJheVBpcGVdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBBcHBDb21wb25lbnQge1xyXG4gICAgcHVibGljIG5ld19jb21wb25lbnQgPSB0aGlzLmluaXRfbmV3X2NvbXBvbmVudCgpO1xyXG4gICAgcHVibGljIGNvbXBvbmVudHMgPSBbXTtcclxuICAgIHB1YmxpYyBmaWVsZF9lZGl0YWJsZSA9IFtdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBzdG9yYWdlU2VydmljZTogU3RvcmFnZVNlcnZpY2UpIHt9XHJcblxyXG4gICAgbmdPbkluaXQoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ25nT25Jbml0Jyk7XHJcbiAgICAgICAgdGhpcy5nZXRfYWxsX2NvbXBvbmVudHMoKTtcclxuICAgIH07XHJcblxyXG4gICAgaW5pdF9uZXdfY29tcG9uZW50KG11dGFiaWxpdHkgPSAnJyl7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbXV0YWJpbGl0eSA6IG11dGFiaWxpdHlcclxuICAgICAgICB9O1xyXG4gICAgfTtcclxuXHJcbiAgICBzZXRfbmV3X2NvbXBvbmVudF9tdXRhYmlsaXR5KG11dGFiaWxpdHkpe1xyXG4gICAgICAgIHRoaXMubmV3X2NvbXBvbmVudCA9ICB0aGlzLmluaXRfbmV3X2NvbXBvbmVudCggbXV0YWJpbGl0eSApO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgZ2V0X2FsbF9jb21wb25lbnRzKCkge1xyXG4gICAgICAgIHRoaXMuc3RvcmFnZVNlcnZpY2Uuc2VsZWN0KCcvYXBpL2NvbXBvbmVudHMnICkuXHJcbiAgICAgICAgICAgIHN1YnNjcmliZSggcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAnZ2V0IC0gJyAsIHJlcyApO1xyXG4gICAgICAgICAgICAgICAgaWYoICFyZXMuZXJyb3IgKSB0aGlzLmNvbXBvbmVudHMgPSByZXMuY29tcG9uZW50cztcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGNyZWF0ZV9jb21wb25lbnQoKXtcclxuICAgICAgICBjb25zb2xlLmxvZyggdGhpcy5jb21wb25lbnRzICk7XHJcbiAgICAgICAgaWYgKCAhdGhpcy5uZXdfY29tcG9uZW50Lm5hbWUgKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCAnIG5vIG5hbWUgd2FzIHByb3ZpZGVkICcpO1xyXG4gICAgICAgICAgICByZXR1cm4gO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIHRoaXMuZXhpc3RfY29tcG9uZW50X3doaXRoX3RoaXNfbmFtZSgpICkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyggJyBjb21wb25lbnQgd2l0aCBzdWNoIG5hbWUgZXhpc3RzICcgKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnN0b3JhZ2VTZXJ2aWNlLmluc2VydCgnL2FwaS9jb21wb25lbnRzJywge1xyXG4gICAgICAgICAgICBuYW1lIDogdGhpcy5uZXdfY29tcG9uZW50Lm5hbWUsXHJcbiAgICAgICAgICAgIGdyb3VwIDogdGhpcy5uZXdfY29tcG9uZW50Lmdyb3VwIHx8ICcnLFxyXG4gICAgICAgICAgICBtdXRhYmlsaXR5IDogdGhpcy5uZXdfY29tcG9uZW50Lm11dGFiaWxpdHksXHJcbiAgICAgICAgICAgIGJvZHkgOiBbXVxyXG4gICAgICAgICB9KS5cclxuICAgICAgICAgICAgc3Vic2NyaWJlKCByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coICdwb3N0IC0gJyAsIHJlcyApO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coIHJlcy5tc2cgKTtcclxuICAgICAgICAgICAgICAgIGlmICggIXJlcy5lcnJvciApIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbXBvbmVudHMgPSByZXMuY29tcG9uZW50cztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5ld19jb21wb25lbnQgPSB0aGlzLmluaXRfbmV3X2NvbXBvbmVudCh0aGlzLm5ld19jb21wb25lbnQubXV0YWJpbGl0eSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBjaGFuZ2VfY29tcG9uZW50KGNvbXBvbmVudCl7XHJcbiAgICAgICAgaWYgKCAhY29tcG9uZW50Lm5ld19uYW1lICkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnbm8gbmFtZSB3YXMgcHJvdmlkZWQgJyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoIHRoaXMuZXhpc3RfY29tcG9uZW50X3doaXRoX3RoaXNfbmFtZShjb21wb25lbnQubmV3X25hbWUpICl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCAnIGNvbXBvbmVudCB3aXRoIHN1Y2ggbmFtZSBleGlzdHMgJyApO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc3RvcmFnZVNlcnZpY2UudXBkYXRlKCcvYXBpL2NvbXBvbmVudHMnLHtcclxuICAgICAgICAgICAgaWQgOiBjb21wb25lbnQuX2lkLFxyXG4gICAgICAgICAgICBuYW1lIDogY29tcG9uZW50Lm5ld19uYW1lLFxyXG4gICAgICAgICAgICBncm91cCA6IGNvbXBvbmVudC5ncm91cCxcclxuICAgICAgICAgICAgbXV0YWJpbGl0eSA6IHRoaXMubmV3X2NvbXBvbmVudC5tdXRhYmlsaXR5LFxyXG4gICAgICAgICAgICBib2R5IDogY29tcG9uZW50LmJvZHlcclxuICAgICAgICB9KS5cclxuICAgICAgICAgICAgc3Vic2NyaWJlKCByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coICdwdXQgLSAnICwgcmVzICk7XHJcbiAgICAgICAgICAgICAgICBpZiAoICFyZXMuZXJyb3IgKSB0aGlzLmNvbXBvbmVudHMgPSByZXMuY29tcG9uZW50cztcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgY29weV9jb21wb25lbnQoY29tcG9uZW50KSB7XHJcbiAgICAgICAgaWYgKCAhY29tcG9uZW50Lm5ld19uYW1lICkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyggJ25vIG5hbWUgd2FzIHByb3ZpZGVkICcgKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiggdGhpcy5leGlzdF9jb21wb25lbnRfd2hpdGhfdGhpc19uYW1lKGNvbXBvbmVudC5uZXdfbmFtZSkgKXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coICcgY29tcG9uZW50IHdpdGggc3VjaCBuYW1lIGV4aXN0cyAnICk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zdG9yYWdlU2VydmljZS5pbnNlcnQoJy9hcGkvY29tcG9uZW50cycsIHtcclxuICAgICAgICAgICAgbmFtZSA6IGNvbXBvbmVudC5uZXdfbmFtZSxcclxuICAgICAgICAgICAgZ3JvdXAgOiBjb21wb25lbnQuZ3JvdXAsXHJcbiAgICAgICAgICAgIG11dGFiaWxpdHkgOiBjb21wb25lbnQubXV0YWJpbGl0eSxcclxuICAgICAgICAgICAgYm9keSA6IGNvbXBvbmVudC5ib2R5XHJcbiAgICAgICAgIH0pLlxyXG4gICAgICAgICAgICBzdWJzY3JpYmUoIHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJ3Bvc3QgLSAnICwgcmVzICk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggcmVzLm1zZyApO1xyXG4gICAgICAgICAgICAgICAgaWYgKCAhcmVzLmVycm9yICkgdGhpcy5jb21wb25lbnRzID0gcmVzLmNvbXBvbmVudHM7XHJcbiAgICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBkZWxldGVfY29tcG9uZW50KGlkKSB7XHJcbiAgICAgICAgaWYgKCAhaWQgKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdubyBpZCB3YXMgcHJvdmlkZWQgJyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zdG9yYWdlU2VydmljZS5kZWxldGUoJy9hcGkvY29tcG9uZW50cycsIGlkKS5cclxuICAgICAgICAgICAgc3Vic2NyaWJlKCByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coICdkZWxldGUgLSAnICwgcmVzICk7XHJcbiAgICAgICAgICAgICAgICBpZiAoICFyZXMuZXJyb3IgKSB0aGlzLmNvbXBvbmVudHMgPSByZXMuY29tcG9uZW50cztcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGV4aXN0X2NvbXBvbmVudF93aGl0aF90aGlzX25hbWUobmFtZSA9IHRoaXMubmV3X2NvbXBvbmVudC5uYW1lKXtcclxuICAgICAgICBpZihcclxuICAgICAgICAgICAgdGhpcy5jb21wb25lbnRzLmZpbmQoZWwgPT4geyByZXR1cm4gZWwubmFtZSA9PT0gbmFtZSA/IHRydWUgOiBmYWxzZSB9KVxyXG4gICAgICAgICAgICApIHJldHVybiB0cnVlO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH07XHJcblxyXG4gICAgZWRpdF9maWVsZHNfY29tcG9uZW50KGNvbXBvbmVudCl7XHJcbiAgICAgICAgdGhpcy5maWVsZF9lZGl0YWJsZSA9IGNvbXBvbmVudDtcclxuICAgIH07XHJcblxyXG4gICAgc2hvd19maWVsZHNfY29tcG9uZW50KGNvbXBvbmVudCl7XHJcbiAgICAgICAgY29uc29sZS5sb2coIHRoaXMuZmllbGRfZWRpdGFibGUgLCBjb21wb25lbnQgKTtcclxuICAgICAgICBpZiAoICB0aGlzLmZpZWxkX2VkaXRhYmxlICYmXHJcbiAgICAgICAgICAgICAgdGhpcy5maWVsZF9lZGl0YWJsZS5faWQgPT09IGNvbXBvbmVudC5faWQgXHJcbiAgICAgICAgKSByZXR1cm4gdHJ1ZTtcclxuICAgIH07IFxyXG5cclxuXHJcbiAgICBcclxuXHJcbiAgICAvLyByZXR1cm4gdW5pcXVlIGlkXHJcbiAgICBjcmVhdGVfZ3VpZCgpIHtcclxuICAgICAgICBmdW5jdGlvbiBzNCgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoKDEgKyBNYXRoLnJhbmRvbSgpKSAqIDB4MTAwMDApXHJcbiAgICAgICAgICAgICAgICAudG9TdHJpbmcoMTYpXHJcbiAgICAgICAgICAgICAgICAuc3Vic3RyaW5nKDEpO1xyXG4gICAgICAgIH1cclxuIFx0ICAgIHJldHVybiBzNCgpICsgczQoKSArICctJyArIHM0KCkgKyAnLScgKyBzNCgpICsgJy0nICtcclxuICAgICAgICAgICAgICAgczQoKSArICctJyArIHM0KCkgKyBzNCgpICsgczQoKTtcclxuICAgIH07XHJcblxyXG4gICAgLy8gIFJldHVybnMgYSBkZWVwIGNvcHkgb2YgdGhlIG9iamVjdFxyXG4gICAgZGVlcENvcHkob2xkT2JqOiBhbnkpIHtcclxuICAgICAgICBsZXQgbmV3T2JqID0gb2xkT2JqO1xyXG4gICAgICAgIGlmIChvbGRPYmogJiYgdHlwZW9mIG9sZE9iaiA9PT0gXCJvYmplY3RcIikge1xyXG4gICAgICAgICAgICBuZXdPYmogPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2xkT2JqKSA9PT0gXCJbb2JqZWN0IEFycmF5XVwiID8gW10gOiB7fTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBvbGRPYmopIHtcclxuICAgICAgICAgICAgICAgIG5ld09ialtpXSA9IHRoaXMuZGVlcENvcHkob2xkT2JqW2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3T2JqO1xyXG4gICAgfTtcclxuXHJcblxyXG5cclxuXHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9

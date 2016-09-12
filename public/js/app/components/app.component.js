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
        this.component_editable = [];
        this.new_field = { type: "string" };
        this.new_group = [];
    }
    AppComponent.prototype.ngOnInit = function () {
        console.log('ngOnInit');
        this.get_all_components();
    };
    ;
    AppComponent.prototype.set_current_view = function (view) {
        this.current_view = view;
    };
    ;
    AppComponent.prototype.set_components_current_view = function (view) {
        this.components_current_view = view;
        console.log(' item ', view);
    };
    ;
    AppComponent.prototype.choosen_menu = function (a, b) {
        if (a == b)
            return true;
    };
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
        this.new_field = { type: "string" };
        console.log(this.component_editable, component);
        if (this.component_editable._id != component._id) {
            this.component_editable = component;
        }
        else {
            this.component_editable = [];
        }
    };
    ;
    AppComponent.prototype.show_fields_component = function (component) {
        if (this.component_editable &&
            this.component_editable._id === component._id)
            return true;
    };
    ;
    AppComponent.prototype.add_field = function (component, new_field) {
        var _this = this;
        if (new_field === void 0) { new_field = {}; }
        //console.log( component, new_field );
        if (!new_field.name)
            return;
        if (this.exist_field_with_this_name(component, new_field.name))
            return;
        this.new_field = { type: "string" };
        new_field._id = this.create_guid();
        component.body = component.body.concat([new_field]);
        //console.log( component.body );
        this.storageService.update('/api/components', {
            id: component._id,
            name: component.name,
            group: component.group,
            mutability: component.mutability,
            body: component.body
        }).
            subscribe(function (res) {
            console.log('put - ', res);
            if (!res.error)
                _this.components = res.components;
        });
    };
    ;
    AppComponent.prototype.if_number_field = function (val) {
        val = Number(val);
        return val ? val : 0;
    };
    ;
    AppComponent.prototype.if_component_field = function (component, val) {
        var res = [];
        //console.log(component, val);
        this.components.find(function (el) {
            //console.log( el.name );
            if (el.name === val &&
                component.name !== val) {
                //console.log( 'res ', el );
                res = el;
            }
            //console.log( ' //////////////// ');                
        });
        return res;
    };
    ;
    AppComponent.prototype.change_field = function (settings) {
        var _this = this;
        if (settings === void 0) { settings = {}; }
        var component = settings.component;
        var field = settings.field;
        //console.log(component, field);
        if (this.exist_field_with_this_name(component, field.edit_name, field._id))
            return;
        if (settings.type == 'number') {
            field.edit_value = this.if_number_field(field.edit_value_name);
        }
        if (settings.type == 'component') {
            field.component_value = this.if_component_field(component, field.edit_value);
        }
        field.name = field.edit_name || field.name;
        field.value = field.edit_value;
        delete field.edit_name;
        delete field.edit_value;
        delete field.assignment;
        this.storageService.update('/api/components', {
            id: component._id,
            name: component.name,
            group: component.group,
            mutability: component.mutability,
            body: component.body
        }).
            subscribe(function (res) {
            console.log('put - ', res);
            if (!res.error)
                _this.components = res.components;
        });
    };
    ;
    AppComponent.prototype.copy_field = function (settings) {
        var _this = this;
        if (settings === void 0) { settings = {}; }
        var component = settings.component;
        var field = settings.field;
        console.log(component, field);
        if (!field.edit_name)
            return;
        if (this.exist_field_with_this_name(component, field.edit_name, field._id))
            return;
        var new_field = this.deepCopy(field);
        new_field._id = this.create_guid();
        new_field.name = new_field.edit_name;
        new_field.value = '';
        if (settings.type == 'number') {
            new_field.value = this.if_number_field(new_field.value);
        }
        if (settings.type == 'component') {
            this.if_component_field(component, new_field.value);
        }
        delete new_field.edit_name;
        delete new_field.edit_value;
        delete new_field.assignment;
        component.body = component.body.concat([new_field]);
        //console.log( new_field );
        this.storageService.update('/api/components', {
            id: component._id,
            name: component.name,
            group: component.group,
            mutability: component.mutability,
            body: component.body
        }).
            subscribe(function (res) {
            console.log('put - ', res);
            if (!res.error)
                _this.components = res.components;
        });
    };
    ;
    AppComponent.prototype.delete_field = function (settings) {
        var _this = this;
        if (settings === void 0) { settings = {}; }
        var component = settings.component;
        var field = settings.field;
        //console.log(component, field);
        if (!component || !field) {
            console.log('no component or field');
            return;
        }
        component.body.forEach(function (el, idx, arr) {
            if (el._id === field._id) {
                arr.splice(idx, 1);
            }
        });
        this.storageService.update('/api/components', {
            id: component._id,
            name: component.name,
            group: component.group,
            mutability: component.mutability,
            body: component.body
        }).
            subscribe(function (res) {
            console.log('put - ', res);
            if (!res.error)
                _this.components = res.components;
        });
    };
    ;
    AppComponent.prototype.value_assignment = function (field) {
        if (!field.assignment) {
            if (field.type == 'component') {
                field.component_value = field.component_value || [];
            }
            field.edit_value = field.value;
            field.assignment = true;
        }
        return true;
    };
    ;
    AppComponent.prototype.exist_field_with_this_name = function (component, field_name, field_id) {
        if (!component ||
            !component.body) {
            console.log(' fields was not provided ');
            return true;
        }
        if (component.body.find(function (el) {
            return (el.name === field_name &&
                el._id !== field_id) ? true : false;
        })) {
            console.log(' field with such name exists ');
            return true;
        }
        return false;
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvYXBwLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEscUJBQTBCLGVBQWUsQ0FBQyxDQUFBO0FBRTFDLGdDQUE2Qiw2QkFBNkIsQ0FBQyxDQUFBO0FBQzNELG1DQUFnQyw2QkFBNkIsQ0FBQyxDQUFBO0FBVTlEO0lBT0ksc0JBQW1CLGNBQThCO1FBQTlCLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQU4xQyxrQkFBYSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBQzFDLGVBQVUsR0FBRyxFQUFFLENBQUM7UUFDaEIsdUJBQWtCLEdBQUcsRUFBRSxDQUFDO1FBQ3hCLGNBQVMsR0FBRyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsQ0FBQztRQUMvQixjQUFTLEdBQUcsRUFBRSxDQUFDO0lBRThCLENBQUM7SUFFckQsK0JBQVEsR0FBUjtRQUNJLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDeEIsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7SUFDOUIsQ0FBQzs7SUFFRCx1Q0FBZ0IsR0FBaEIsVUFBa0IsSUFBSTtRQUNsQixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztJQUM3QixDQUFDOztJQUNELGtEQUEyQixHQUEzQixVQUE2QixJQUFJO1FBQzdCLElBQUksQ0FBQyx1QkFBdUIsR0FBRyxJQUFJLENBQUM7UUFDcEMsT0FBTyxDQUFDLEdBQUcsQ0FBRSxRQUFRLEVBQUUsSUFBSSxDQUFFLENBQUM7SUFDbEMsQ0FBQzs7SUFFRCxtQ0FBWSxHQUFaLFVBQWMsQ0FBQyxFQUFFLENBQUM7UUFDZCxFQUFFLENBQUMsQ0FBRSxDQUFDLElBQUksQ0FBRSxDQUFDO1lBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztJQUM5QixDQUFDO0lBRUQseUNBQWtCLEdBQWxCLFVBQW1CLFVBQWU7UUFBZiwwQkFBZSxHQUFmLGVBQWU7UUFDOUIsTUFBTSxDQUFDO1lBQ0gs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bXBvbmVudHMvYXBwLmNvbXBvbmVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuaW1wb3J0IHtTdG9yYWdlU2VydmljZX0gZnJvbSBcIi4uL3NlcnZpY2VzL3N0b3JhZ2Uuc2VydmljZVwiO1xyXG5pbXBvcnQge09iamVjdFRvQXJyYXlQaXBlfSBmcm9tIFwiLi4vcGlwZXMvb2JqZWN0VG9BcnJheS5waXBlXCI7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICAgIG1vZHVsZUlkOiBtb2R1bGUuaWQsIFxyXG4gICAgc2VsZWN0b3I6ICdteS1hcHAnLFxyXG4gICAgdGVtcGxhdGVVcmw6ICdhcHAudGVtcGxhdGUuaHRtbCcsXHJcbiAgICBzdHlsZVVybHM6IFsnYXBwLnN0eWxlLmNzcyddLFxyXG4gICAgcHJvdmlkZXJzOiBbU3RvcmFnZVNlcnZpY2VdLFxyXG4gICAgcGlwZXM6IFtPYmplY3RUb0FycmF5UGlwZV1cclxufSlcclxuZXhwb3J0IGNsYXNzIEFwcENvbXBvbmVudCB7XHJcbiAgICBwdWJsaWMgbmV3X2NvbXBvbmVudCA9IHRoaXMuaW5pdF9uZXdfY29tcG9uZW50KCk7XHJcbiAgICBwdWJsaWMgY29tcG9uZW50cyA9IFtdO1xyXG4gICAgcHVibGljIGNvbXBvbmVudF9lZGl0YWJsZSA9IFtdO1xyXG4gICAgcHVibGljIG5ld19maWVsZCA9IHsgdHlwZTogXCJzdHJpbmdcIiB9OyAgIFxyXG4gICAgcHVibGljIG5ld19ncm91cCA9IFtdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBzdG9yYWdlU2VydmljZTogU3RvcmFnZVNlcnZpY2UpIHt9XHJcblxyXG4gICAgbmdPbkluaXQoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ25nT25Jbml0Jyk7XHJcbiAgICAgICAgdGhpcy5nZXRfYWxsX2NvbXBvbmVudHMoKTtcclxuICAgIH07XHJcblxyXG4gICAgc2V0X2N1cnJlbnRfdmlldyggdmlldyApe1xyXG4gICAgICAgIHRoaXMuY3VycmVudF92aWV3ID0gdmlldztcclxuICAgIH07XHJcbiAgICBzZXRfY29tcG9uZW50c19jdXJyZW50X3ZpZXcoIHZpZXcgKSB7XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRzX2N1cnJlbnRfdmlldyA9IHZpZXc7XHJcbiAgICAgICAgY29uc29sZS5sb2coICcgaXRlbSAnLCB2aWV3ICk7XHJcbiAgICB9O1xyXG5cclxuICAgIGNob29zZW5fbWVudSggYSwgYiApe1xyXG4gICAgICAgIGlmICggYSA9PSBiICkgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdF9uZXdfY29tcG9uZW50KG11dGFiaWxpdHkgPSAnJyl7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbXV0YWJpbGl0eSA6IG11dGFiaWxpdHlcclxuICAgICAgICB9O1xyXG4gICAgfTtcclxuXHJcbiAgICBzZXRfbmV3X2NvbXBvbmVudF9tdXRhYmlsaXR5KG11dGFiaWxpdHkpe1xyXG4gICAgICAgIHRoaXMubmV3X2NvbXBvbmVudCA9ICB0aGlzLmluaXRfbmV3X2NvbXBvbmVudCggbXV0YWJpbGl0eSApO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgZ2V0X2FsbF9jb21wb25lbnRzKCkge1xyXG4gICAgICAgIHRoaXMuc3RvcmFnZVNlcnZpY2Uuc2VsZWN0KCcvYXBpL2NvbXBvbmVudHMnICkuXHJcbiAgICAgICAgICAgIHN1YnNjcmliZSggcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAnZ2V0IC0gJyAsIHJlcyApO1xyXG4gICAgICAgICAgICAgICAgaWYoICFyZXMuZXJyb3IgKSB0aGlzLmNvbXBvbmVudHMgPSByZXMuY29tcG9uZW50cztcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGNyZWF0ZV9jb21wb25lbnQoKXtcclxuICAgICAgICBjb25zb2xlLmxvZyggdGhpcy5jb21wb25lbnRzICk7XHJcbiAgICAgICAgaWYgKCAhdGhpcy5uZXdfY29tcG9uZW50Lm5hbWUgKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCAnIG5vIG5hbWUgd2FzIHByb3ZpZGVkICcpO1xyXG4gICAgICAgICAgICByZXR1cm4gO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIHRoaXMuZXhpc3RfY29tcG9uZW50X3doaXRoX3RoaXNfbmFtZSgpICkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyggJyBjb21wb25lbnQgd2l0aCBzdWNoIG5hbWUgZXhpc3RzICcgKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnN0b3JhZ2VTZXJ2aWNlLmluc2VydCgnL2FwaS9jb21wb25lbnRzJywge1xyXG4gICAgICAgICAgICBuYW1lIDogdGhpcy5uZXdfY29tcG9uZW50Lm5hbWUsXHJcbiAgICAgICAgICAgIGdyb3VwIDogdGhpcy5uZXdfY29tcG9uZW50Lmdyb3VwIHx8ICcnLFxyXG4gICAgICAgICAgICBtdXRhYmlsaXR5IDogdGhpcy5uZXdfY29tcG9uZW50Lm11dGFiaWxpdHksXHJcbiAgICAgICAgICAgIGJvZHkgOiBbXVxyXG4gICAgICAgICB9KS5cclxuICAgICAgICAgICAgc3Vic2NyaWJlKCByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coICdwb3N0IC0gJyAsIHJlcyApO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coIHJlcy5tc2cgKTtcclxuICAgICAgICAgICAgICAgIGlmICggIXJlcy5lcnJvciApIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbXBvbmVudHMgPSByZXMuY29tcG9uZW50cztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5ld19jb21wb25lbnQgPSB0aGlzLmluaXRfbmV3X2NvbXBvbmVudCh0aGlzLm5ld19jb21wb25lbnQubXV0YWJpbGl0eSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBjaGFuZ2VfY29tcG9uZW50KGNvbXBvbmVudCl7XHJcbiAgICAgICAgaWYgKCAhY29tcG9uZW50Lm5ld19uYW1lICkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnbm8gbmFtZSB3YXMgcHJvdmlkZWQgJyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoIHRoaXMuZXhpc3RfY29tcG9uZW50X3doaXRoX3RoaXNfbmFtZShjb21wb25lbnQubmV3X25hbWUpICl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCAnIGNvbXBvbmVudCB3aXRoIHN1Y2ggbmFtZSBleGlzdHMgJyApO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc3RvcmFnZVNlcnZpY2UudXBkYXRlKCcvYXBpL2NvbXBvbmVudHMnLHtcclxuICAgICAgICAgICAgaWQgOiBjb21wb25lbnQuX2lkLFxyXG4gICAgICAgICAgICBuYW1lIDogY29tcG9uZW50Lm5ld19uYW1lLFxyXG4gICAgICAgICAgICBncm91cCA6IGNvbXBvbmVudC5ncm91cCxcclxuICAgICAgICAgICAgbXV0YWJpbGl0eSA6IHRoaXMubmV3X2NvbXBvbmVudC5tdXRhYmlsaXR5LFxyXG4gICAgICAgICAgICBib2R5IDogY29tcG9uZW50LmJvZHlcclxuICAgICAgICB9KS5cclxuICAgICAgICAgICAgc3Vic2NyaWJlKCByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coICdwdXQgLSAnICwgcmVzICk7XHJcbiAgICAgICAgICAgICAgICBpZiAoICFyZXMuZXJyb3IgKSB0aGlzLmNvbXBvbmVudHMgPSByZXMuY29tcG9uZW50cztcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgY29weV9jb21wb25lbnQoY29tcG9uZW50KSB7XHJcbiAgICAgICAgaWYgKCAhY29tcG9uZW50Lm5ld19uYW1lICkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyggJ25vIG5hbWUgd2FzIHByb3ZpZGVkICcgKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiggdGhpcy5leGlzdF9jb21wb25lbnRfd2hpdGhfdGhpc19uYW1lKGNvbXBvbmVudC5uZXdfbmFtZSkgKXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coICcgY29tcG9uZW50IHdpdGggc3VjaCBuYW1lIGV4aXN0cyAnICk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zdG9yYWdlU2VydmljZS5pbnNlcnQoJy9hcGkvY29tcG9uZW50cycsIHtcclxuICAgICAgICAgICAgbmFtZSA6IGNvbXBvbmVudC5uZXdfbmFtZSxcclxuICAgICAgICAgICAgZ3JvdXAgOiBjb21wb25lbnQuZ3JvdXAsXHJcbiAgICAgICAgICAgIG11dGFiaWxpdHkgOiBjb21wb25lbnQubXV0YWJpbGl0eSxcclxuICAgICAgICAgICAgYm9keSA6IGNvbXBvbmVudC5ib2R5XHJcbiAgICAgICAgIH0pLlxyXG4gICAgICAgICAgICBzdWJzY3JpYmUoIHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJ3Bvc3QgLSAnICwgcmVzICk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggcmVzLm1zZyApO1xyXG4gICAgICAgICAgICAgICAgaWYgKCAhcmVzLmVycm9yICkgdGhpcy5jb21wb25lbnRzID0gcmVzLmNvbXBvbmVudHM7XHJcbiAgICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBkZWxldGVfY29tcG9uZW50KGlkKSB7XHJcbiAgICAgICAgaWYgKCAhaWQgKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdubyBpZCB3YXMgcHJvdmlkZWQgJyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zdG9yYWdlU2VydmljZS5kZWxldGUoJy9hcGkvY29tcG9uZW50cycsIGlkKS5cclxuICAgICAgICAgICAgc3Vic2NyaWJlKCByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coICdkZWxldGUgLSAnICwgcmVzICk7XHJcbiAgICAgICAgICAgICAgICBpZiAoICFyZXMuZXJyb3IgKSB0aGlzLmNvbXBvbmVudHMgPSByZXMuY29tcG9uZW50cztcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGV4aXN0X2NvbXBvbmVudF93aGl0aF90aGlzX25hbWUobmFtZSA9IHRoaXMubmV3X2NvbXBvbmVudC5uYW1lKXtcclxuICAgICAgICBpZihcclxuICAgICAgICAgICAgdGhpcy5jb21wb25lbnRzLmZpbmQoZWwgPT4geyByZXR1cm4gZWwubmFtZSA9PT0gbmFtZSA/IHRydWUgOiBmYWxzZSB9KVxyXG4gICAgICAgICAgICApIHJldHVybiB0cnVlO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH07XHJcblxyXG4gICAgZWRpdF9maWVsZHNfY29tcG9uZW50KGNvbXBvbmVudCl7XHJcbiAgICAgICAgdGhpcy5uZXdfZmllbGQgPSB7IHR5cGU6IFwic3RyaW5nXCIgfTsgXHJcbiAgICAgICAgY29uc29sZS5sb2coIHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLCBjb21wb25lbnQgKTtcclxuICAgICAgICBpZiAoIHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLl9pZCAhPSBjb21wb25lbnQuX2lkKSAgeyBcclxuICAgICAgICAgICAgdGhpcy5jb21wb25lbnRfZWRpdGFibGUgPSBjb21wb25lbnQ7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jb21wb25lbnRfZWRpdGFibGUgPSBbXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBzaG93X2ZpZWxkc19jb21wb25lbnQoY29tcG9uZW50KXtcclxuICAgICAgICBpZiAoICB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZSAmJlxyXG4gICAgICAgICAgICAgIHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLl9pZCA9PT0gY29tcG9uZW50Ll9pZCBcclxuICAgICAgICApIHJldHVybiB0cnVlO1xyXG4gICAgfTsgXHJcblxyXG4gICAgYWRkX2ZpZWxkKCBjb21wb25lbnQsIG5ld19maWVsZCA9IHt9ICl7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyggY29tcG9uZW50LCBuZXdfZmllbGQgKTtcclxuICAgICAgICBpZiAoICFuZXdfZmllbGQubmFtZSApIHJldHVybjtcclxuICAgICAgICBpZiAoIHRoaXMuZXhpc3RfZmllbGRfd2l0aF90aGlzX25hbWUoY29tcG9uZW50LCBuZXdfZmllbGQubmFtZSkgKSByZXR1cm4gO1xyXG4gICAgICAgIHRoaXMubmV3X2ZpZWxkID0geyB0eXBlOiBcInN0cmluZ1wiIH07IFxyXG4gICAgICAgIG5ld19maWVsZC5faWQgPSB0aGlzLmNyZWF0ZV9ndWlkKCk7ICAgICAgICBcclxuICAgICAgICBjb21wb25lbnQuYm9keSA9IFsgLi4uIGNvbXBvbmVudC5ib2R5ICwgbmV3X2ZpZWxkIF07XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyggY29tcG9uZW50LmJvZHkgKTtcclxuICAgICAgICB0aGlzLnN0b3JhZ2VTZXJ2aWNlLnVwZGF0ZSgnL2FwaS9jb21wb25lbnRzJyx7XHJcbiAgICAgICAgICAgIGlkIDogY29tcG9uZW50Ll9pZCxcclxuICAgICAgICAgICAgbmFtZSA6IGNvbXBvbmVudC5uYW1lLFxyXG4gICAgICAgICAgICBncm91cCA6IGNvbXBvbmVudC5ncm91cCxcclxuICAgICAgICAgICAgbXV0YWJpbGl0eSA6IGNvbXBvbmVudC5tdXRhYmlsaXR5LFxyXG4gICAgICAgICAgICBib2R5IDogY29tcG9uZW50LmJvZHlcclxuICAgICAgICB9KS5cclxuICAgICAgICAgICAgc3Vic2NyaWJlKCByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coICdwdXQgLSAnICwgcmVzICk7XHJcbiAgICAgICAgICAgICAgICBpZiAoICFyZXMuZXJyb3IgKSB0aGlzLmNvbXBvbmVudHMgPSByZXMuY29tcG9uZW50cztcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIGlmX251bWJlcl9maWVsZCh2YWwpe1xyXG4gICAgICAgIHZhbCA9IE51bWJlcih2YWwpO1xyXG4gICAgICAgIHJldHVybiB2YWwgPyB2YWwgOiAwIDtcclxuICAgIH07XHJcblxyXG4gICAgaWZfY29tcG9uZW50X2ZpZWxkKGNvbXBvbmVudCwgdmFsKXtcclxuICAgICAgICBsZXQgcmVzID0gW107XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhjb21wb25lbnQsIHZhbCk7XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRzLmZpbmQoZWwgPT4geyBcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyggZWwubmFtZSApO1xyXG4gICAgICAgICAgICBpZiAoIGVsLm5hbWUgPT09IHZhbCAmJlxyXG4gICAgICAgICAgICAgICBjb21wb25lbnQubmFtZSAhPT0gdmFsICkge1xyXG4gICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyggJ3JlcyAnLCBlbCApO1xyXG4gICAgICAgICAgICAgICAgICAgcmVzID0gIGVsO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coICcgLy8vLy8vLy8vLy8vLy8vLyAnKTsgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgfSlcclxuICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgfTtcclxuXHJcbiAgICBjaGFuZ2VfZmllbGQoIHNldHRpbmdzID0ge30gKXtcclxuICAgICAgICBsZXQgY29tcG9uZW50ID0gc2V0dGluZ3MuY29tcG9uZW50O1xyXG4gICAgICAgIGxldCBmaWVsZCA9IHNldHRpbmdzLmZpZWxkO1xyXG5cclxuICAgICAgICAvL2NvbnNvbGUubG9nKGNvbXBvbmVudCwgZmllbGQpO1xyXG4gICAgICAgIGlmICggdGhpcy5leGlzdF9maWVsZF93aXRoX3RoaXNfbmFtZShjb21wb25lbnQsIGZpZWxkLmVkaXRfbmFtZSwgZmllbGQuX2lkICkgKSByZXR1cm47XHJcbiAgICAgICAgaWYgKCBzZXR0aW5ncy50eXBlID09ICdudW1iZXInICkge1xyXG4gICAgICAgICAgICBmaWVsZC5lZGl0X3ZhbHVlID0gdGhpcy5pZl9udW1iZXJfZmllbGQoZmllbGQuZWRpdF92YWx1ZV9uYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCBzZXR0aW5ncy50eXBlID09ICdjb21wb25lbnQnICkge1xyXG4gICAgICAgICAgICBmaWVsZC5jb21wb25lbnRfdmFsdWUgPSB0aGlzLmlmX2NvbXBvbmVudF9maWVsZChjb21wb25lbnQsIGZpZWxkLmVkaXRfdmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmaWVsZC5uYW1lID0gZmllbGQuZWRpdF9uYW1lIHx8IGZpZWxkLm5hbWU7XHJcbiAgICAgICAgZmllbGQudmFsdWUgPSBmaWVsZC5lZGl0X3ZhbHVlO1xyXG4gICAgICAgIGRlbGV0ZSBmaWVsZC5lZGl0X25hbWU7XHJcbiAgICAgICAgZGVsZXRlIGZpZWxkLmVkaXRfdmFsdWU7XHJcbiAgICAgICAgZGVsZXRlIGZpZWxkLmFzc2lnbm1lbnQ7XHJcblxyXG4gICAgICAgIHRoaXMuc3RvcmFnZVNlcnZpY2UudXBkYXRlKCcvYXBpL2NvbXBvbmVudHMnLHtcclxuICAgICAgICAgICAgaWQgOiBjb21wb25lbnQuX2lkLFxyXG4gICAgICAgICAgICBuYW1lIDogY29tcG9uZW50Lm5hbWUsXHJcbiAgICAgICAgICAgIGdyb3VwIDogY29tcG9uZW50Lmdyb3VwLFxyXG4gICAgICAgICAgICBtdXRhYmlsaXR5IDogY29tcG9uZW50Lm11dGFiaWxpdHksXHJcbiAgICAgICAgICAgIGJvZHkgOiBjb21wb25lbnQuYm9keVxyXG4gICAgICAgIH0pLlxyXG4gICAgICAgICAgICBzdWJzY3JpYmUoIHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJ3B1dCAtICcgLCByZXMgKTtcclxuICAgICAgICAgICAgICAgIGlmICggIXJlcy5lcnJvciApIHRoaXMuY29tcG9uZW50cyA9IHJlcy5jb21wb25lbnRzO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgfTtcclxuXHJcbiAgICBjb3B5X2ZpZWxkKCBzZXR0aW5ncyA9IHt9ICl7XHJcbiAgICAgICAgbGV0IGNvbXBvbmVudCA9IHNldHRpbmdzLmNvbXBvbmVudDtcclxuICAgICAgICBsZXQgZmllbGQgPSBzZXR0aW5ncy5maWVsZDtcclxuICAgICAgICBjb25zb2xlLmxvZyhjb21wb25lbnQsIGZpZWxkKTtcclxuICAgICAgICBpZiAoICFmaWVsZC5lZGl0X25hbWUgKSByZXR1cm47XHJcbiAgICAgICAgaWYgKCB0aGlzLmV4aXN0X2ZpZWxkX3dpdGhfdGhpc19uYW1lKGNvbXBvbmVudCwgZmllbGQuZWRpdF9uYW1lLCBmaWVsZC5faWQgKSApIHJldHVybjtcclxuICAgICAgICBsZXQgbmV3X2ZpZWxkID0gdGhpcy5kZWVwQ29weShmaWVsZCk7XHJcbiAgICAgICAgbmV3X2ZpZWxkLl9pZCA9IHRoaXMuY3JlYXRlX2d1aWQoKTtcclxuICAgICAgICBuZXdfZmllbGQubmFtZSA9IG5ld19maWVsZC5lZGl0X25hbWU7XHJcbiAgICAgICAgbmV3X2ZpZWxkLnZhbHVlID0gJyc7XHJcbiAgICAgICAgaWYgKCBzZXR0aW5ncy50eXBlID09ICdudW1iZXInICkge1xyXG4gICAgICAgICAgICBuZXdfZmllbGQudmFsdWU9IHRoaXMuaWZfbnVtYmVyX2ZpZWxkKG5ld19maWVsZC52YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICggc2V0dGluZ3MudHlwZSA9PSAnY29tcG9uZW50JyApIHtcclxuICAgICAgICAgICAgdGhpcy5pZl9jb21wb25lbnRfZmllbGQoY29tcG9uZW50LCBuZXdfZmllbGQudmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBkZWxldGUgbmV3X2ZpZWxkLmVkaXRfbmFtZTtcclxuICAgICAgICBkZWxldGUgbmV3X2ZpZWxkLmVkaXRfdmFsdWU7XHJcbiAgICAgICAgZGVsZXRlIG5ld19maWVsZC5hc3NpZ25tZW50O1xyXG4gICAgICAgIGNvbXBvbmVudC5ib2R5ID0gWyAuLi4gY29tcG9uZW50LmJvZHkgLCBuZXdfZmllbGQgXTtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKCBuZXdfZmllbGQgKTtcclxuICAgICAgICB0aGlzLnN0b3JhZ2VTZXJ2aWNlLnVwZGF0ZSgnL2FwaS9jb21wb25lbnRzJyx7XHJcbiAgICAgICAgICAgIGlkIDogY29tcG9uZW50Ll9pZCxcclxuICAgICAgICAgICAgbmFtZSA6IGNvbXBvbmVudC5uYW1lLFxyXG4gICAgICAgICAgICBncm91cCA6IGNvbXBvbmVudC5ncm91cCxcclxuICAgICAgICAgICAgbXV0YWJpbGl0eSA6IGNvbXBvbmVudC5tdXRhYmlsaXR5LFxyXG4gICAgICAgICAgICBib2R5IDogY29tcG9uZW50LmJvZHlcclxuICAgICAgICB9KS5cclxuICAgICAgICAgICAgc3Vic2NyaWJlKCByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coICdwdXQgLSAnICwgcmVzICk7XHJcbiAgICAgICAgICAgICAgICBpZiAoICFyZXMuZXJyb3IgKSB0aGlzLmNvbXBvbmVudHMgPSByZXMuY29tcG9uZW50cztcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgZGVsZXRlX2ZpZWxkKCBzZXR0aW5ncyA9IHt9ICl7XHJcbiAgICAgICAgbGV0IGNvbXBvbmVudCA9IHNldHRpbmdzLmNvbXBvbmVudDtcclxuICAgICAgICBsZXQgZmllbGQgPSBzZXR0aW5ncy5maWVsZDtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKGNvbXBvbmVudCwgZmllbGQpO1xyXG4gICAgICAgIGlmICggIWNvbXBvbmVudCB8fCAhZmllbGQgKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCAnbm8gY29tcG9uZW50IG9yIGZpZWxkJyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29tcG9uZW50LmJvZHkuZm9yRWFjaCggKGVsLCBpZHgsIGFycikgPT4geyBcclxuICAgICAgICAgICAgaWYoZWwuX2lkID09PSBmaWVsZC5faWQgKSB7XHJcbiAgICAgICAgICAgICAgICBhcnIuc3BsaWNlKGlkeCwgMSk7XHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCBhcnIsIGlkeCApO1xyXG4gICAgICAgICAgICB9IFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuc3RvcmFnZVNlcnZpY2UudXBkYXRlKCcvYXBpL2NvbXBvbmVudHMnLHtcclxuICAgICAgICAgICAgaWQgOiBjb21wb25lbnQuX2lkLFxyXG4gICAgICAgICAgICBuYW1lIDogY29tcG9uZW50Lm5hbWUsXHJcbiAgICAgICAgICAgIGdyb3VwIDogY29tcG9uZW50Lmdyb3VwLFxyXG4gICAgICAgICAgICBtdXRhYmlsaXR5IDogY29tcG9uZW50Lm11dGFiaWxpdHksXHJcbiAgICAgICAgICAgIGJvZHkgOiBjb21wb25lbnQuYm9keVxyXG4gICAgICAgIH0pLlxyXG4gICAgICAgICAgICBzdWJzY3JpYmUoIHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJ3B1dCAtICcgLCByZXMgKTtcclxuICAgICAgICAgICAgICAgIGlmICggIXJlcy5lcnJvciApIHRoaXMuY29tcG9uZW50cyA9IHJlcy5jb21wb25lbnRzO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgfTtcclxuXHJcbiAgICB2YWx1ZV9hc3NpZ25tZW50KGZpZWxkKXtcclxuICAgICAgICBpZiAoICAhZmllbGQuYXNzaWdubWVudCApe1xyXG4gICAgICAgICAgICBpZiAoIGZpZWxkLnR5cGUgPT0gJ2NvbXBvbmVudCcgKSB7XHJcbiAgICAgICAgICAgICAgICBmaWVsZC5jb21wb25lbnRfdmFsdWUgPSBmaWVsZC5jb21wb25lbnRfdmFsdWUgfHwgW107XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZmllbGQuZWRpdF92YWx1ZSA9IGZpZWxkLnZhbHVlO1xyXG4gICAgICAgICAgICBmaWVsZC5hc3NpZ25tZW50ID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9O1xyXG5cclxuICAgIGV4aXN0X2ZpZWxkX3dpdGhfdGhpc19uYW1lKGNvbXBvbmVudCwgZmllbGRfbmFtZSwgZmllbGRfaWQgKXtcclxuICAgICAgICBpZiAoICFjb21wb25lbnQgfHxcclxuICAgICAgICAgICAgICFjb21wb25lbnQuYm9keSBcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJyBmaWVsZHMgd2FzIG5vdCBwcm92aWRlZCAnKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKFxyXG4gICAgICAgICAgICBjb21wb25lbnQuYm9keS5maW5kKGVsID0+IHsgcmV0dXJuIChlbC5uYW1lID09PSBmaWVsZF9uYW1lICYmXHJcbiAgICAgICAgICAgICAgIGVsLl9pZCAhPT0gZmllbGRfaWQgKSA/IHRydWUgOiBmYWxzZSB9KVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyggICcgZmllbGQgd2l0aCBzdWNoIG5hbWUgZXhpc3RzICcgKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH07XHJcbiAgICBcclxuXHJcblxyXG4gICAgXHJcblxyXG4gICAgLy8gcmV0dXJuIHVuaXF1ZSBpZFxyXG4gICAgY3JlYXRlX2d1aWQoKSB7XHJcbiAgICAgICAgZnVuY3Rpb24gczQoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBNYXRoLmZsb29yKCgxICsgTWF0aC5yYW5kb20oKSkgKiAweDEwMDAwKVxyXG4gICAgICAgICAgICAgICAgLnRvU3RyaW5nKDE2KVxyXG4gICAgICAgICAgICAgICAgLnN1YnN0cmluZygxKTtcclxuICAgICAgICB9XHJcbiBcdCAgICByZXR1cm4gczQoKSArIHM0KCkgKyAnLScgKyBzNCgpICsgJy0nICsgczQoKSArICctJyArXHJcbiAgICAgICAgICAgICAgIHM0KCkgKyAnLScgKyBzNCgpICsgczQoKSArIHM0KCk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vICBSZXR1cm5zIGEgZGVlcCBjb3B5IG9mIHRoZSBvYmplY3RcclxuICAgIGRlZXBDb3B5KG9sZE9iajogYW55KSB7XHJcbiAgICAgICAgbGV0IG5ld09iaiA9IG9sZE9iajtcclxuICAgICAgICBpZiAob2xkT2JqICYmIHR5cGVvZiBvbGRPYmogPT09IFwib2JqZWN0XCIpIHtcclxuICAgICAgICAgICAgbmV3T2JqID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9sZE9iaikgPT09IFwiW29iamVjdCBBcnJheV1cIiA/IFtdIDoge307XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgaW4gb2xkT2JqKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdPYmpbaV0gPSB0aGlzLmRlZXBDb3B5KG9sZE9ialtpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ld09iajtcclxuICAgIH07XHJcblxyXG5cclxuXHJcblxyXG59XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==

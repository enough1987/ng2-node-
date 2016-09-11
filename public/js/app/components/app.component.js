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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvYXBwLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEscUJBQTBCLGVBQWUsQ0FBQyxDQUFBO0FBRTFDLGdDQUE2Qiw2QkFBNkIsQ0FBQyxDQUFBO0FBQzNELG1DQUFnQyw2QkFBNkIsQ0FBQyxDQUFBO0FBVTlEO0lBT0ksc0JBQW1CLGNBQThCO1FBQTlCLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQU4xQyxrQkFBYSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBQzFDLGVBQVUsR0FBRyxFQUFFLENBQUM7UUFDaEIsdUJBQWtCLEdBQUcsRUFBRSxDQUFDO1FBQ3hCLGNBQVMsR0FBRyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsQ0FBQztRQUMvQixjQUFTLEdBQUcsRUFBRSxDQUFDO0lBRThCLENBQUM7SUFFckQsK0JBQVEsR0FBUjtRQUNJLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDeEIsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7SUFDOUIsQ0FBQzs7SUFFRCx1Q0FBZ0IsR0FBaEIsVUFBa0IsSUFBSTtRQUNsQixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztJQUM3QixDQUFDOztJQUVELG1DQUFZLEdBQVosVUFBYyxDQUFDLEVBQUUsQ0FBQztRQUNkLEVBQUUsQ0FBQyxDQUFFLENBQUMsSUFBSSxDQUFFLENBQUM7WUFBQyxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQzlCLENBQUM7SUFFRCx5Q0FBa0IsR0FBbEIsVUFBbUIsVUFBZTtRQUFmLDBCQUFlLEdBQWYsZUFBZTtRQUM5QixNQUFNLENBQUM7WUFDSCxVQUFVLEVBQUcsVUFBVTtTQUMxQixDQUFDO0lBQ04sQ0FBQzs7SUFFRCxtREFBNEIsR0FBNUIsVUFBNkIsVUFBVTtRQUNuQyxJQUFJLENBQUMsYUFBYSxHQUFJLElBQUksQ0FBQyxrQkFBa0IsQ0FBRSxVQUFVLENBQUUsQ0FBQztJ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QUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQztJQUMzQyxDQUFDOztJQUVELHFDQUFxQztJQUNyQywrQkFBUSxHQUFSLFVBQVMsTUFBVztRQUNoQixJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDcEIsRUFBRSxDQUFDLENBQUMsTUFBTSxJQUFJLE9BQU8sTUFBTSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDdkMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxnQkFBZ0IsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDO1lBQy9FLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ25CLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pDLENBQUM7UUFDTCxDQUFDO1FBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUNsQixDQUFDOztJQXpWTDtRQUFDLGdCQUFTLENBQUM7WUFDUCxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDbkIsUUFBUSxFQUFFLFFBQVE7WUFDbEIsV0FBVyxFQUFFLG1CQUFtQjtZQUNoQyxTQUFTLEVBQUUsQ0FBQyxlQUFlLENBQUM7WUFDNUIsU0FBUyxFQUFFLENBQUMsZ0NBQWMsQ0FBQztZQUMzQixLQUFLLEVBQUUsQ0FBQyxzQ0FBaUIsQ0FBQztTQUM3QixDQUFDOztvQkFBQTtJQXVWRixtQkFBQztBQUFELENBdFZBLEFBc1ZDLElBQUE7QUF0Vlksb0JBQVksZUFzVnhCLENBQUEiLCJmaWxlIjoiY29tcG9uZW50cy9hcHAuY29tcG9uZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5pbXBvcnQge1N0b3JhZ2VTZXJ2aWNlfSBmcm9tIFwiLi4vc2VydmljZXMvc3RvcmFnZS5zZXJ2aWNlXCI7XHJcbmltcG9ydCB7T2JqZWN0VG9BcnJheVBpcGV9IGZyb20gXCIuLi9waXBlcy9vYmplY3RUb0FycmF5LnBpcGVcIjtcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gICAgbW9kdWxlSWQ6IG1vZHVsZS5pZCwgXHJcbiAgICBzZWxlY3RvcjogJ215LWFwcCcsXHJcbiAgICB0ZW1wbGF0ZVVybDogJ2FwcC50ZW1wbGF0ZS5odG1sJyxcclxuICAgIHN0eWxlVXJsczogWydhcHAuc3R5bGUuY3NzJ10sXHJcbiAgICBwcm92aWRlcnM6IFtTdG9yYWdlU2VydmljZV0sXHJcbiAgICBwaXBlczogW09iamVjdFRvQXJyYXlQaXBlXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgQXBwQ29tcG9uZW50IHtcclxuICAgIHB1YmxpYyBuZXdfY29tcG9uZW50ID0gdGhpcy5pbml0X25ld19jb21wb25lbnQoKTtcclxuICAgIHB1YmxpYyBjb21wb25lbnRzID0gW107XHJcbiAgICBwdWJsaWMgY29tcG9uZW50X2VkaXRhYmxlID0gW107XHJcbiAgICBwdWJsaWMgbmV3X2ZpZWxkID0geyB0eXBlOiBcInN0cmluZ1wiIH07ICAgXHJcbiAgICBwdWJsaWMgbmV3X2dyb3VwID0gW107XHJcblxyXG4gICAgY29uc3RydWN0b3IocHVibGljIHN0b3JhZ2VTZXJ2aWNlOiBTdG9yYWdlU2VydmljZSkge31cclxuXHJcbiAgICBuZ09uSW5pdCgpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnbmdPbkluaXQnKTtcclxuICAgICAgICB0aGlzLmdldF9hbGxfY29tcG9uZW50cygpO1xyXG4gICAgfTtcclxuXHJcbiAgICBzZXRfY3VycmVudF92aWV3KCB2aWV3ICl7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50X3ZpZXcgPSB2aWV3O1xyXG4gICAgfTtcclxuXHJcbiAgICBjaG9vc2VuX21lbnUoIGEsIGIgKXtcclxuICAgICAgICBpZiAoIGEgPT0gYiApIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXRfbmV3X2NvbXBvbmVudChtdXRhYmlsaXR5ID0gJycpe1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIG11dGFiaWxpdHkgOiBtdXRhYmlsaXR5XHJcbiAgICAgICAgfTtcclxuICAgIH07XHJcblxyXG4gICAgc2V0X25ld19jb21wb25lbnRfbXV0YWJpbGl0eShtdXRhYmlsaXR5KXtcclxuICAgICAgICB0aGlzLm5ld19jb21wb25lbnQgPSAgdGhpcy5pbml0X25ld19jb21wb25lbnQoIG11dGFiaWxpdHkgKTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIGdldF9hbGxfY29tcG9uZW50cygpIHtcclxuICAgICAgICB0aGlzLnN0b3JhZ2VTZXJ2aWNlLnNlbGVjdCgnL2FwaS9jb21wb25lbnRzJyApLlxyXG4gICAgICAgICAgICBzdWJzY3JpYmUoIHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJ2dldCAtICcgLCByZXMgKTtcclxuICAgICAgICAgICAgICAgIGlmKCAhcmVzLmVycm9yICkgdGhpcy5jb21wb25lbnRzID0gcmVzLmNvbXBvbmVudHM7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBjcmVhdGVfY29tcG9uZW50KCl7XHJcbiAgICAgICAgY29uc29sZS5sb2coIHRoaXMuY29tcG9uZW50cyApO1xyXG4gICAgICAgIGlmICggIXRoaXMubmV3X2NvbXBvbmVudC5uYW1lICkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyggJyBubyBuYW1lIHdhcyBwcm92aWRlZCAnKTtcclxuICAgICAgICAgICAgcmV0dXJuIDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCB0aGlzLmV4aXN0X2NvbXBvbmVudF93aGl0aF90aGlzX25hbWUoKSApIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coICcgY29tcG9uZW50IHdpdGggc3VjaCBuYW1lIGV4aXN0cyAnICk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zdG9yYWdlU2VydmljZS5pbnNlcnQoJy9hcGkvY29tcG9uZW50cycsIHtcclxuICAgICAgICAgICAgbmFtZSA6IHRoaXMubmV3X2NvbXBvbmVudC5uYW1lLFxyXG4gICAgICAgICAgICBncm91cCA6IHRoaXMubmV3X2NvbXBvbmVudC5ncm91cCB8fCAnJyxcclxuICAgICAgICAgICAgbXV0YWJpbGl0eSA6IHRoaXMubmV3X2NvbXBvbmVudC5tdXRhYmlsaXR5LFxyXG4gICAgICAgICAgICBib2R5IDogW11cclxuICAgICAgICAgfSkuXHJcbiAgICAgICAgICAgIHN1YnNjcmliZSggcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAncG9zdCAtICcgLCByZXMgKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCByZXMubXNnICk7XHJcbiAgICAgICAgICAgICAgICBpZiAoICFyZXMuZXJyb3IgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb21wb25lbnRzID0gcmVzLmNvbXBvbmVudHM7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXdfY29tcG9uZW50ID0gdGhpcy5pbml0X25ld19jb21wb25lbnQodGhpcy5uZXdfY29tcG9uZW50Lm11dGFiaWxpdHkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgY2hhbmdlX2NvbXBvbmVudChjb21wb25lbnQpe1xyXG4gICAgICAgIGlmICggIWNvbXBvbmVudC5uZXdfbmFtZSApIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ25vIG5hbWUgd2FzIHByb3ZpZGVkICcpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKCB0aGlzLmV4aXN0X2NvbXBvbmVudF93aGl0aF90aGlzX25hbWUoY29tcG9uZW50Lm5ld19uYW1lKSApe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyggJyBjb21wb25lbnQgd2l0aCBzdWNoIG5hbWUgZXhpc3RzICcgKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnN0b3JhZ2VTZXJ2aWNlLnVwZGF0ZSgnL2FwaS9jb21wb25lbnRzJyx7XHJcbiAgICAgICAgICAgIGlkIDogY29tcG9uZW50Ll9pZCxcclxuICAgICAgICAgICAgbmFtZSA6IGNvbXBvbmVudC5uZXdfbmFtZSxcclxuICAgICAgICAgICAgZ3JvdXAgOiBjb21wb25lbnQuZ3JvdXAsXHJcbiAgICAgICAgICAgIG11dGFiaWxpdHkgOiB0aGlzLm5ld19jb21wb25lbnQubXV0YWJpbGl0eSxcclxuICAgICAgICAgICAgYm9keSA6IGNvbXBvbmVudC5ib2R5XHJcbiAgICAgICAgfSkuXHJcbiAgICAgICAgICAgIHN1YnNjcmliZSggcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAncHV0IC0gJyAsIHJlcyApO1xyXG4gICAgICAgICAgICAgICAgaWYgKCAhcmVzLmVycm9yICkgdGhpcy5jb21wb25lbnRzID0gcmVzLmNvbXBvbmVudHM7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGNvcHlfY29tcG9uZW50KGNvbXBvbmVudCkge1xyXG4gICAgICAgIGlmICggIWNvbXBvbmVudC5uZXdfbmFtZSApIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coICdubyBuYW1lIHdhcyBwcm92aWRlZCAnICk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoIHRoaXMuZXhpc3RfY29tcG9uZW50X3doaXRoX3RoaXNfbmFtZShjb21wb25lbnQubmV3X25hbWUpICl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCAnIGNvbXBvbmVudCB3aXRoIHN1Y2ggbmFtZSBleGlzdHMgJyApO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc3RvcmFnZVNlcnZpY2UuaW5zZXJ0KCcvYXBpL2NvbXBvbmVudHMnLCB7XHJcbiAgICAgICAgICAgIG5hbWUgOiBjb21wb25lbnQubmV3X25hbWUsXHJcbiAgICAgICAgICAgIGdyb3VwIDogY29tcG9uZW50Lmdyb3VwLFxyXG4gICAgICAgICAgICBtdXRhYmlsaXR5IDogY29tcG9uZW50Lm11dGFiaWxpdHksXHJcbiAgICAgICAgICAgIGJvZHkgOiBjb21wb25lbnQuYm9keVxyXG4gICAgICAgICB9KS5cclxuICAgICAgICAgICAgc3Vic2NyaWJlKCByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coICdwb3N0IC0gJyAsIHJlcyApO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coIHJlcy5tc2cgKTtcclxuICAgICAgICAgICAgICAgIGlmICggIXJlcy5lcnJvciApIHRoaXMuY29tcG9uZW50cyA9IHJlcy5jb21wb25lbnRzO1xyXG4gICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgZGVsZXRlX2NvbXBvbmVudChpZCkge1xyXG4gICAgICAgIGlmICggIWlkICkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnbm8gaWQgd2FzIHByb3ZpZGVkICcpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc3RvcmFnZVNlcnZpY2UuZGVsZXRlKCcvYXBpL2NvbXBvbmVudHMnLCBpZCkuXHJcbiAgICAgICAgICAgIHN1YnNjcmliZSggcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAnZGVsZXRlIC0gJyAsIHJlcyApO1xyXG4gICAgICAgICAgICAgICAgaWYgKCAhcmVzLmVycm9yICkgdGhpcy5jb21wb25lbnRzID0gcmVzLmNvbXBvbmVudHM7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBleGlzdF9jb21wb25lbnRfd2hpdGhfdGhpc19uYW1lKG5hbWUgPSB0aGlzLm5ld19jb21wb25lbnQubmFtZSl7XHJcbiAgICAgICAgaWYoXHJcbiAgICAgICAgICAgIHRoaXMuY29tcG9uZW50cy5maW5kKGVsID0+IHsgcmV0dXJuIGVsLm5hbWUgPT09IG5hbWUgPyB0cnVlIDogZmFsc2UgfSlcclxuICAgICAgICAgICAgKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9O1xyXG5cclxuICAgIGVkaXRfZmllbGRzX2NvbXBvbmVudChjb21wb25lbnQpe1xyXG4gICAgICAgIHRoaXMubmV3X2ZpZWxkID0geyB0eXBlOiBcInN0cmluZ1wiIH07IFxyXG4gICAgICAgIGNvbnNvbGUubG9nKCB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZSwgY29tcG9uZW50ICk7XHJcbiAgICAgICAgaWYgKCB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5faWQgIT0gY29tcG9uZW50Ll9pZCkgIHsgXHJcbiAgICAgICAgICAgIHRoaXMuY29tcG9uZW50X2VkaXRhYmxlID0gY29tcG9uZW50O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29tcG9uZW50X2VkaXRhYmxlID0gW107XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgc2hvd19maWVsZHNfY29tcG9uZW50KGNvbXBvbmVudCl7XHJcbiAgICAgICAgaWYgKCAgdGhpcy5jb21wb25lbnRfZWRpdGFibGUgJiZcclxuICAgICAgICAgICAgICB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5faWQgPT09IGNvbXBvbmVudC5faWQgXHJcbiAgICAgICAgKSByZXR1cm4gdHJ1ZTtcclxuICAgIH07IFxyXG5cclxuICAgIGFkZF9maWVsZCggY29tcG9uZW50LCBuZXdfZmllbGQgPSB7fSApe1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coIGNvbXBvbmVudCwgbmV3X2ZpZWxkICk7XHJcbiAgICAgICAgaWYgKCAhbmV3X2ZpZWxkLm5hbWUgKSByZXR1cm47XHJcbiAgICAgICAgaWYgKCB0aGlzLmV4aXN0X2ZpZWxkX3dpdGhfdGhpc19uYW1lKGNvbXBvbmVudCwgbmV3X2ZpZWxkLm5hbWUpICkgcmV0dXJuIDtcclxuICAgICAgICB0aGlzLm5ld19maWVsZCA9IHsgdHlwZTogXCJzdHJpbmdcIiB9OyBcclxuICAgICAgICBuZXdfZmllbGQuX2lkID0gdGhpcy5jcmVhdGVfZ3VpZCgpOyAgICAgICAgXHJcbiAgICAgICAgY29tcG9uZW50LmJvZHkgPSBbIC4uLiBjb21wb25lbnQuYm9keSAsIG5ld19maWVsZCBdO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coIGNvbXBvbmVudC5ib2R5ICk7XHJcbiAgICAgICAgdGhpcy5zdG9yYWdlU2VydmljZS51cGRhdGUoJy9hcGkvY29tcG9uZW50cycse1xyXG4gICAgICAgICAgICBpZCA6IGNvbXBvbmVudC5faWQsXHJcbiAgICAgICAgICAgIG5hbWUgOiBjb21wb25lbnQubmFtZSxcclxuICAgICAgICAgICAgZ3JvdXAgOiBjb21wb25lbnQuZ3JvdXAsXHJcbiAgICAgICAgICAgIG11dGFiaWxpdHkgOiBjb21wb25lbnQubXV0YWJpbGl0eSxcclxuICAgICAgICAgICAgYm9keSA6IGNvbXBvbmVudC5ib2R5XHJcbiAgICAgICAgfSkuXHJcbiAgICAgICAgICAgIHN1YnNjcmliZSggcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAncHV0IC0gJyAsIHJlcyApO1xyXG4gICAgICAgICAgICAgICAgaWYgKCAhcmVzLmVycm9yICkgdGhpcy5jb21wb25lbnRzID0gcmVzLmNvbXBvbmVudHM7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBpZl9udW1iZXJfZmllbGQodmFsKXtcclxuICAgICAgICB2YWwgPSBOdW1iZXIodmFsKTtcclxuICAgICAgICByZXR1cm4gdmFsID8gdmFsIDogMCA7XHJcbiAgICB9O1xyXG5cclxuICAgIGlmX2NvbXBvbmVudF9maWVsZChjb21wb25lbnQsIHZhbCl7XHJcbiAgICAgICAgbGV0IHJlcyA9IFtdO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coY29tcG9uZW50LCB2YWwpO1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50cy5maW5kKGVsID0+IHsgXHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coIGVsLm5hbWUgKTtcclxuICAgICAgICAgICAgaWYgKCBlbC5uYW1lID09PSB2YWwgJiZcclxuICAgICAgICAgICAgICAgY29tcG9uZW50Lm5hbWUgIT09IHZhbCApIHtcclxuICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coICdyZXMgJywgZWwgKTtcclxuICAgICAgICAgICAgICAgICAgIHJlcyA9ICBlbDtcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCAnIC8vLy8vLy8vLy8vLy8vLy8gJyk7ICAgICAgICAgICAgICAgIFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgcmV0dXJuIHJlcztcclxuICAgIH07XHJcblxyXG4gICAgY2hhbmdlX2ZpZWxkKCBzZXR0aW5ncyA9IHt9ICl7XHJcbiAgICAgICAgbGV0IGNvbXBvbmVudCA9IHNldHRpbmdzLmNvbXBvbmVudDtcclxuICAgICAgICBsZXQgZmllbGQgPSBzZXR0aW5ncy5maWVsZDtcclxuXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhjb21wb25lbnQsIGZpZWxkKTtcclxuICAgICAgICBpZiAoIHRoaXMuZXhpc3RfZmllbGRfd2l0aF90aGlzX25hbWUoY29tcG9uZW50LCBmaWVsZC5lZGl0X25hbWUsIGZpZWxkLl9pZCApICkgcmV0dXJuO1xyXG4gICAgICAgIGlmICggc2V0dGluZ3MudHlwZSA9PSAnbnVtYmVyJyApIHtcclxuICAgICAgICAgICAgZmllbGQuZWRpdF92YWx1ZSA9IHRoaXMuaWZfbnVtYmVyX2ZpZWxkKGZpZWxkLmVkaXRfdmFsdWVfbmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICggc2V0dGluZ3MudHlwZSA9PSAnY29tcG9uZW50JyApIHtcclxuICAgICAgICAgICAgZmllbGQuY29tcG9uZW50X3ZhbHVlID0gdGhpcy5pZl9jb21wb25lbnRfZmllbGQoY29tcG9uZW50LCBmaWVsZC5lZGl0X3ZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmllbGQubmFtZSA9IGZpZWxkLmVkaXRfbmFtZSB8fCBmaWVsZC5uYW1lO1xyXG4gICAgICAgIGZpZWxkLnZhbHVlID0gZmllbGQuZWRpdF92YWx1ZTtcclxuICAgICAgICBkZWxldGUgZmllbGQuZWRpdF9uYW1lO1xyXG4gICAgICAgIGRlbGV0ZSBmaWVsZC5lZGl0X3ZhbHVlO1xyXG4gICAgICAgIGRlbGV0ZSBmaWVsZC5hc3NpZ25tZW50O1xyXG5cclxuICAgICAgICB0aGlzLnN0b3JhZ2VTZXJ2aWNlLnVwZGF0ZSgnL2FwaS9jb21wb25lbnRzJyx7XHJcbiAgICAgICAgICAgIGlkIDogY29tcG9uZW50Ll9pZCxcclxuICAgICAgICAgICAgbmFtZSA6IGNvbXBvbmVudC5uYW1lLFxyXG4gICAgICAgICAgICBncm91cCA6IGNvbXBvbmVudC5ncm91cCxcclxuICAgICAgICAgICAgbXV0YWJpbGl0eSA6IGNvbXBvbmVudC5tdXRhYmlsaXR5LFxyXG4gICAgICAgICAgICBib2R5IDogY29tcG9uZW50LmJvZHlcclxuICAgICAgICB9KS5cclxuICAgICAgICAgICAgc3Vic2NyaWJlKCByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coICdwdXQgLSAnICwgcmVzICk7XHJcbiAgICAgICAgICAgICAgICBpZiAoICFyZXMuZXJyb3IgKSB0aGlzLmNvbXBvbmVudHMgPSByZXMuY29tcG9uZW50cztcclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgIH07XHJcblxyXG4gICAgY29weV9maWVsZCggc2V0dGluZ3MgPSB7fSApe1xyXG4gICAgICAgIGxldCBjb21wb25lbnQgPSBzZXR0aW5ncy5jb21wb25lbnQ7XHJcbiAgICAgICAgbGV0IGZpZWxkID0gc2V0dGluZ3MuZmllbGQ7XHJcbiAgICAgICAgY29uc29sZS5sb2coY29tcG9uZW50LCBmaWVsZCk7XHJcbiAgICAgICAgaWYgKCAhZmllbGQuZWRpdF9uYW1lICkgcmV0dXJuO1xyXG4gICAgICAgIGlmICggdGhpcy5leGlzdF9maWVsZF93aXRoX3RoaXNfbmFtZShjb21wb25lbnQsIGZpZWxkLmVkaXRfbmFtZSwgZmllbGQuX2lkICkgKSByZXR1cm47XHJcbiAgICAgICAgbGV0IG5ld19maWVsZCA9IHRoaXMuZGVlcENvcHkoZmllbGQpO1xyXG4gICAgICAgIG5ld19maWVsZC5faWQgPSB0aGlzLmNyZWF0ZV9ndWlkKCk7XHJcbiAgICAgICAgbmV3X2ZpZWxkLm5hbWUgPSBuZXdfZmllbGQuZWRpdF9uYW1lO1xyXG4gICAgICAgIG5ld19maWVsZC52YWx1ZSA9ICcnO1xyXG4gICAgICAgIGlmICggc2V0dGluZ3MudHlwZSA9PSAnbnVtYmVyJyApIHtcclxuICAgICAgICAgICAgbmV3X2ZpZWxkLnZhbHVlPSB0aGlzLmlmX251bWJlcl9maWVsZChuZXdfZmllbGQudmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIHNldHRpbmdzLnR5cGUgPT0gJ2NvbXBvbmVudCcgKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaWZfY29tcG9uZW50X2ZpZWxkKGNvbXBvbmVudCwgbmV3X2ZpZWxkLnZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZGVsZXRlIG5ld19maWVsZC5lZGl0X25hbWU7XHJcbiAgICAgICAgZGVsZXRlIG5ld19maWVsZC5lZGl0X3ZhbHVlO1xyXG4gICAgICAgIGRlbGV0ZSBuZXdfZmllbGQuYXNzaWdubWVudDtcclxuICAgICAgICBjb21wb25lbnQuYm9keSA9IFsgLi4uIGNvbXBvbmVudC5ib2R5ICwgbmV3X2ZpZWxkIF07XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyggbmV3X2ZpZWxkICk7XHJcbiAgICAgICAgdGhpcy5zdG9yYWdlU2VydmljZS51cGRhdGUoJy9hcGkvY29tcG9uZW50cycse1xyXG4gICAgICAgICAgICBpZCA6IGNvbXBvbmVudC5faWQsXHJcbiAgICAgICAgICAgIG5hbWUgOiBjb21wb25lbnQubmFtZSxcclxuICAgICAgICAgICAgZ3JvdXAgOiBjb21wb25lbnQuZ3JvdXAsXHJcbiAgICAgICAgICAgIG11dGFiaWxpdHkgOiBjb21wb25lbnQubXV0YWJpbGl0eSxcclxuICAgICAgICAgICAgYm9keSA6IGNvbXBvbmVudC5ib2R5XHJcbiAgICAgICAgfSkuXHJcbiAgICAgICAgICAgIHN1YnNjcmliZSggcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAncHV0IC0gJyAsIHJlcyApO1xyXG4gICAgICAgICAgICAgICAgaWYgKCAhcmVzLmVycm9yICkgdGhpcy5jb21wb25lbnRzID0gcmVzLmNvbXBvbmVudHM7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGRlbGV0ZV9maWVsZCggc2V0dGluZ3MgPSB7fSApe1xyXG4gICAgICAgIGxldCBjb21wb25lbnQgPSBzZXR0aW5ncy5jb21wb25lbnQ7XHJcbiAgICAgICAgbGV0IGZpZWxkID0gc2V0dGluZ3MuZmllbGQ7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhjb21wb25lbnQsIGZpZWxkKTtcclxuICAgICAgICBpZiAoICFjb21wb25lbnQgfHwgIWZpZWxkICkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyggJ25vIGNvbXBvbmVudCBvciBmaWVsZCcpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbXBvbmVudC5ib2R5LmZvckVhY2goIChlbCwgaWR4LCBhcnIpID0+IHsgXHJcbiAgICAgICAgICAgIGlmKGVsLl9pZCA9PT0gZmllbGQuX2lkICkge1xyXG4gICAgICAgICAgICAgICAgYXJyLnNwbGljZShpZHgsIDEpO1xyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyggYXJyLCBpZHggKTtcclxuICAgICAgICAgICAgfSBcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnN0b3JhZ2VTZXJ2aWNlLnVwZGF0ZSgnL2FwaS9jb21wb25lbnRzJyx7XHJcbiAgICAgICAgICAgIGlkIDogY29tcG9uZW50Ll9pZCxcclxuICAgICAgICAgICAgbmFtZSA6IGNvbXBvbmVudC5uYW1lLFxyXG4gICAgICAgICAgICBncm91cCA6IGNvbXBvbmVudC5ncm91cCxcclxuICAgICAgICAgICAgbXV0YWJpbGl0eSA6IGNvbXBvbmVudC5tdXRhYmlsaXR5LFxyXG4gICAgICAgICAgICBib2R5IDogY29tcG9uZW50LmJvZHlcclxuICAgICAgICB9KS5cclxuICAgICAgICAgICAgc3Vic2NyaWJlKCByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coICdwdXQgLSAnICwgcmVzICk7XHJcbiAgICAgICAgICAgICAgICBpZiAoICFyZXMuZXJyb3IgKSB0aGlzLmNvbXBvbmVudHMgPSByZXMuY29tcG9uZW50cztcclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgIH07XHJcblxyXG4gICAgdmFsdWVfYXNzaWdubWVudChmaWVsZCl7XHJcbiAgICAgICAgaWYgKCAgIWZpZWxkLmFzc2lnbm1lbnQgKXtcclxuICAgICAgICAgICAgaWYgKCBmaWVsZC50eXBlID09ICdjb21wb25lbnQnICkge1xyXG4gICAgICAgICAgICAgICAgZmllbGQuY29tcG9uZW50X3ZhbHVlID0gZmllbGQuY29tcG9uZW50X3ZhbHVlIHx8IFtdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZpZWxkLmVkaXRfdmFsdWUgPSBmaWVsZC52YWx1ZTtcclxuICAgICAgICAgICAgZmllbGQuYXNzaWdubWVudCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfTtcclxuXHJcbiAgICBleGlzdF9maWVsZF93aXRoX3RoaXNfbmFtZShjb21wb25lbnQsIGZpZWxkX25hbWUsIGZpZWxkX2lkICl7XHJcbiAgICAgICAgaWYgKCAhY29tcG9uZW50IHx8XHJcbiAgICAgICAgICAgICAhY29tcG9uZW50LmJvZHkgXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCcgZmllbGRzIHdhcyBub3QgcHJvdmlkZWQgJyk7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihcclxuICAgICAgICAgICAgY29tcG9uZW50LmJvZHkuZmluZChlbCA9PiB7IHJldHVybiAoZWwubmFtZSA9PT0gZmllbGRfbmFtZSAmJlxyXG4gICAgICAgICAgICAgICBlbC5faWQgIT09IGZpZWxkX2lkICkgPyB0cnVlIDogZmFsc2UgfSlcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coICAnIGZpZWxkIHdpdGggc3VjaCBuYW1lIGV4aXN0cyAnICk7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9O1xyXG4gICAgXHJcblxyXG5cclxuICAgIFxyXG5cclxuICAgIC8vIHJldHVybiB1bmlxdWUgaWRcclxuICAgIGNyZWF0ZV9ndWlkKCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIHM0KCkge1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5mbG9vcigoMSArIE1hdGgucmFuZG9tKCkpICogMHgxMDAwMClcclxuICAgICAgICAgICAgICAgIC50b1N0cmluZygxNilcclxuICAgICAgICAgICAgICAgIC5zdWJzdHJpbmcoMSk7XHJcbiAgICAgICAgfVxyXG4gXHQgICAgcmV0dXJuIHM0KCkgKyBzNCgpICsgJy0nICsgczQoKSArICctJyArIHM0KCkgKyAnLScgK1xyXG4gICAgICAgICAgICAgICBzNCgpICsgJy0nICsgczQoKSArIHM0KCkgKyBzNCgpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyAgUmV0dXJucyBhIGRlZXAgY29weSBvZiB0aGUgb2JqZWN0XHJcbiAgICBkZWVwQ29weShvbGRPYmo6IGFueSkge1xyXG4gICAgICAgIGxldCBuZXdPYmogPSBvbGRPYmo7XHJcbiAgICAgICAgaWYgKG9sZE9iaiAmJiB0eXBlb2Ygb2xkT2JqID09PSBcIm9iamVjdFwiKSB7XHJcbiAgICAgICAgICAgIG5ld09iaiA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvbGRPYmopID09PSBcIltvYmplY3QgQXJyYXldXCIgPyBbXSA6IHt9O1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpIGluIG9sZE9iaikge1xyXG4gICAgICAgICAgICAgICAgbmV3T2JqW2ldID0gdGhpcy5kZWVwQ29weShvbGRPYmpbaV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXdPYmo7XHJcbiAgICB9O1xyXG5cclxuXHJcblxyXG5cclxufVxyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=

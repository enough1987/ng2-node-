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
        this.new_field = { type: "string" };
        this.component_editable = component;
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
    AppComponent.prototype.change_field = function (component, field) {
        var _this = this;
        if (field === void 0) { field = {}; }
        //console.log(component, field);
        if (this.exist_field_with_this_name(component, field.edit_name))
            return;
        field.name = field.edit_name;
        delete field.edit_name;
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
    AppComponent.prototype.copy_field = function (component, field) {
        //console.log(component, field);
        if (this.exist_field_with_this_name(component, field.edit_name))
            return;
        var new_field = this.deepCopy(field);
        new_field.name = new_field.edit_name;
        delete new_field.edit_name;
        console.log(new_field);
    };
    ;
    AppComponent.prototype.delete_field = function (component, field) {
        console.log(component, field);
    };
    ;
    AppComponent.prototype.exist_field_with_this_name = function (component, field_name) {
        if (!component ||
            !component.body ||
            !field_name) {
            console.log(' fields was not provided ');
            return true;
        }
        if (component.body.find(function (el) { return el.name === field_name ? true : false; })) {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvYXBwLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEscUJBQTBCLGVBQWUsQ0FBQyxDQUFBO0FBRTFDLGdDQUE2Qiw2QkFBNkIsQ0FBQyxDQUFBO0FBQzNELG1DQUFnQyw2QkFBNkIsQ0FBQyxDQUFBO0FBVTlEO0lBTUksc0JBQW1CLGNBQThCO1FBQTlCLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQUwxQyxrQkFBYSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBQzFDLGVBQVUsR0FBRyxFQUFFLENBQUM7UUFDaEIsdUJBQWtCLEdBQUcsRUFBRSxDQUFDO1FBQ3hCLGNBQVMsR0FBRyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsQ0FBQztJQUVjLENBQUM7SUFFckQsK0JBQVEsR0FBUjtRQUNJLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDeEIsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7SUFDOUIsQ0FBQzs7SUFFRCx5Q0FBa0IsR0FBbEIsVUFBbUIsVUFBZTtRQUFmLDBCQUFlLEdBQWYsZUFBZTtRQUM5QixNQUFNLENBQUM7WUFDSCxVQUFVLEVBQUcsVUFBVTtTQUMxQixDQUFDO0lBQ04sQ0FBQzs7SUFFRCxtREFBNEIsR0FBNUIsVUFBNkIsVUFBVTtRQUNuQyxJQUFJLENBQUMsYUFBYSxHQUFJLElBQUksQ0FBQyxrQkFBa0IsQ0FBRSxVQUFVLENBQUUsQ0FBQztJQUNoRSxDQUFDOztJQUdELHlDQUFrQixHQUFsQjtRQUFBLGlCQU1DO1FBTEcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUU7WUFDMUMsU0FBUyxDQUFFLFVBQUEsR0FBRztZQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUUsUUFBUSxFQUFHLEdBQUcsQ0FBRSxDQUFDO1lBQzlCLEVBQUUsQ0FBQSxDQUFFLENBQUMsR0FBRyxDQUFDLEtBQU0sQ0FBQztnQkFBQyxLQUFJLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUM7UUFDdEQsQ0FBQyxDQUFDLENBQUM7SUFDWCxDQUFDOztJQUVELHVDQUFnQixHQUFoQjtRQUFBLGlCQXlCQztRQXhCRyxPQUFPLENBQUMsR0FBRyxDQUFFLElBQUksQ0FBQyxVQUFVLENBQUUsQ0FBQztRQUMvQixFQUFFLENBQUMsQ0FBRSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSyxDQUFDLENBQUMsQ0FBQztZQUM3QixPQUFPLENBQUMsR0FBRyxDQUFFLHdCQUF3QixDQUFDLENBQUM7WUFDdkMsTUFBTSxDQUFFO1FBQ1osQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFFLElBQUksQ0FBQywrQkFBK0IsRUFBRyxDQUFDLENBQUMsQ0FBQztZQUMzQyxPQUFPLENBQUMsR0FBRyxDQUFFLG1DQUFtQyxDQUFFLENBQUM7WUFDbkQsTUFBTSxDQUFDO1FBQ1gsQ0FBQztRQUNELElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLGlCQUFpQixFQUFFO1lBQzFDLElBQUksRUFBRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUk7WUFDOUIsS0FBSyxFQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxJQUFJLEVBQUU7WUFDdEMsVUFBVSxFQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVTtZQUMxQyxJQUFJLEVBQUcsRUFBRTtTQUNYLENBQUM7WUFDQyxTQUFTLENBQUUsVUFBQSxHQUFHO1lBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBRSxTQUFTLEVBQUcsR0FBRyxDQUFFLENBQUM7WUFDL0IsT0FBTyxDQUFDLEdBQUcsQ0FBRSxHQUFHLENBQUMsR0FBRyxDQUFFLENBQUM7WUFDdkIsRUFBRSxDQUFDLENBQUUsQ0FBQyxHQUFHLENBQUMsS0FBTSxDQUFDLENBQUMsQ0FBQztnQkFDZixLQUFJLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUM7Z0JBQ2pDLEtBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSSxDQUFDLGtCQUFrQixDQUFDLEtBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDaEYsQ0FBQztRQUNULENBQUMsQ0FBQyxDQUFDO0lBRVAsQ0FBQzs7SUFFRCx1Q0FBZ0IsR0FBaEIsVUFBaUIsU0FBUztRQUExQixpQkFvQkM7UUFuQkcsRUFBRSxDQUFDLENBQUUsQ0FBQyxTQUFTLENBQUMsUUFBUyxDQUFDLENBQUMsQ0FBQztZQUN4QixPQUFPLENBQUMsR0FBRyxDQUFDLHVCQUF1QixDQUFDLENBQUM7WUFDckMsTUFBTSxDQUFDO1FBQ1gsQ0FBQztRQUNELEVBQUUsQ0FBQSxDQUFFLElBQUksQ0FBQywrQkFBK0IsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFFLENBQUMsQ0FBQSxDQUFDO1lBQzNELE9BQU8sQ0FBQyxHQUFHLENBQUUsbUNBQW1DLENBQUUsQ0FBQztZQUNuRCxNQUFNLENBQUM7UUFDWCxDQUFDO1FBQ0QsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLEVBQUM7WUFDekMsRUFBRSxFQUFHLFNBQVMsQ0FBQyxHQUFHO1lBQ2xCLElBQUksRUFBRyxTQUFTLENBQUMsUUFBUTtZQUN6QixLQUFLLEVBQUcsU0FBUyxDQUFDLEtBQUs7WUFDdkIsVUFBVSxFQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVTtZQUMxQyxJQUFJLEVBQUcsU0FBUyxDQUFDLElBQUk7U0FDeEIsQ0FBQztZQUNFLFNBQVMsQ0FBRSxVQUFBLEdBQUc7WUFDVixPQUFPLENBQUMsR0FBRyxDQUFFLFFBQVEsRUFBRyxHQUFHLENBQUUsQ0FBQztZQUM5QixFQUFFLENBQUMsQ0FBRSxDQUFDLEdBQUcsQ0FBQyxLQUFNLENBQUM7Z0JBQUMsS0FBSSxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDO1FBQzNELENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQzs7SUFFRCxxQ0FBYyxHQUFkLFVBQWUsU0FBUztRQUF4QixpQkFvQkM7UUFuQkcsRUFBRSxDQUFDLENBQUUsQ0FBQyxTQUFTLENBQUMsUUFBUyxDQUFDLENBQUMsQ0FBQztZQUN4QixPQUFPLENBQUMsR0FBRyxDQUFFLHVCQUF1QixDQUFFLENBQUM7WUFDdkMsTUFBTSxDQUFDO1FBQ1gsQ0FBQztRQUNELEVBQUUsQ0FBQSxDQUFFLElBQUksQ0FBQywrQkFBK0IsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFFLENBQUMsQ0FBQSxDQUFDO1lBQzNELE9BQU8sQ0FBQyxHQUFHLENBQUUsbUNBQW1DLENBQUUsQ0FBQztZQUNuRCxNQUFNLENBQUM7UUFDWCxDQUFDO1FBQ0QsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLEVBQUU7WUFDMUMsSUFBSSxFQUFHLFNBQVMsQ0FBQyxRQUFRO1lBQ3pCLEtBQUssRUFBRyxTQUFTLENBQUMsS0FBSztZQUN2QixVQUFVLEVBQUcsU0FBUyxDQUFDLFVBQVU7WUFDakMsSUFBSSxFQUFHLFNBQVMsQ0FBQyxJQUFJO1NBQ3ZCLENBQUM7WUFDQyxTQUFTLENBQUUsVUFBQSxHQUFHO1lBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBRSxTQUFTLEVBQUcsR0FBRyxDQUFFLENBQUM7WUFDL0IsT0FBTyxDQUFDLEdBQUcsQ0FBRSxHQUFHLENBQUMsR0FBRyxDQUFFLENBQUM7WUFDdkIsRUFBRSxDQUFDLENBQUUsQ0FBQyxHQUFHLENBQUMsS0FBTSxDQUFDO2dCQUFDLEtBQUksQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQztRQUMxRCxDQUFDLENBQUMsQ0FBQztJQUNSLENBQUM7O0lBRUQsdUNBQWdCLEdBQWhCLFVBQWlCLEVBQUU7UUFBbkIsaUJBVUM7UUFURyxFQUFFLENBQUMsQ0FBRSxDQUFDLEVBQUcsQ0FBQyxDQUFDLENBQUM7WUFDUixPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDLENBQUM7WUFDbkMsTUFBTSxDQUFDO1FBQ1gsQ0FBQztRQUNELElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLGlCQUFpQixFQUFFLEVBQUUsQ0FBQztZQUM3QyxTQUFTLENBQUUsVUFBQSxHQUFHO1lBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBRSxXQUFXLEVBQUcsR0FBRyxDQUFFLENBQUM7WUFDakMsRUFBRSxDQUFDLENBQUUsQ0FBQyxHQUFHLENBQUMsS0FBTSxDQUFDO2dCQUFDLEtBQUksQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQztRQUN2RCxDQUFDLENBQUMsQ0FBQztJQUNYLENBQUM7O0lBRUQsc0RBQStCLEdBQS9CLFVBQWdDLElBQThCO1FBQTlCLG9CQUE4QixHQUE5QixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSTtRQUMxRCxFQUFFLENBQUEsQ0FDRSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxVQUFBLEVBQUUsSUFBTSxNQUFNLENBQUMsRUFBRSxDQUFDLElBQUksS0FBSyxJQUFJLEdBQUcsSUFBSSxHQUFHLEtBQUssQ0FBQSxDQUFDLENBQUMsQ0FDckUsQ0FBQztZQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDbEIsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUNqQixDQUFDOztJQUVELDRDQUFxQixHQUFyQixVQUFzQixTQUFTO1FBQzNCLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLENBQUM7UUFDcEMsSUFBSSxDQUFDLGtCQUFrQixHQUFHLFNBQVMsQ0FBQztJQUN4QyxDQUFDOztJQUVELDRDQUFxQixHQUFyQixVQUFzQixTQUFTO1FBQzNCLEVBQUUsQ0FBQyxDQUFHLElBQUksQ0FBQyxrQkFBa0I7WUFDdkIsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsS0FBSyxTQUFTLENBQUMsR0FDaEQsQ0FBQztZQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDbEIsQ0FBQzs7SUFFRCxnQ0FBUyxHQUFULFVBQVcsU0FBUyxFQUFFLFNBQWM7UUFBcEMsaUJBbUJDO1FBbkJxQix5QkFBYyxHQUFkLGNBQWM7UUFDaEMsc0NBQXNDO1FBQ3RDLEVBQUUsQ0FBQyxDQUFFLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLElBQUksQ0FBRSxDQUFDO1lBQUMsTUFBTSxDQUFFO1FBQzFFLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLENBQUM7UUFDcEMsU0FBUyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDbkMsU0FBUyxDQUFDLElBQUksR0FBUyxTQUFTLENBQUMsSUFBSSxTQUFHLFNBQVMsRUFBRSxDQUFDO1FBQ3BELGdDQUFnQztRQUNoQyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsRUFBQztZQUN6QyxFQUFFLEVBQUcsU0FBUyxDQUFDLEdBQUc7WUFDbEIsSUFBSSxFQUFHLFNBQVMsQ0FBQyxJQUFJO1lBQ3JCLEtBQUssRUFBRyxTQUFTLENBQUMsS0FBSztZQUN2QixVQUFVLEVBQUcsU0FBUyxDQUFDLFVBQVU7WUFDakMsSUFBSSxFQUFHLFNBQVMsQ0FBQyxJQUFJO1NBQ3hCLENBQUM7WUFDRSxTQUFTLENBQUUsVUFBQSxHQUFHO1lBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBRSxRQUFRLEVBQUcsR0FBRyxDQUFFLENBQUM7WUFDOUIsRUFBRSxDQUFDLENBQUUsQ0FBQyxHQUFHLENBQUMsS0FBTSxDQUFDO2dCQUFDLEtBQUksQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQztRQUMzRCxDQUFDLENBQUMsQ0FBQztJQUVQLENBQUM7O0lBRUQsbUNBQVksR0FBWixVQUFjLFNBQVMsRUFBRSxLQUFVO1FBQW5DLGlCQWtCQztRQWxCd0IscUJBQVUsR0FBVixVQUFVO1FBQy9CLGdDQUFnQztRQUNoQyxFQUFFLENBQUMsQ0FBRSxJQUFJLENBQUMsMEJBQTBCLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUcsQ0FBQztZQUFDLE1BQU0sQ0FBQztRQUMzRSxLQUFLLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUM7UUFDN0IsT0FBTyxLQUFLLENBQUMsU0FBUyxDQUFDO1FBRXZCLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLGlCQUFpQixFQUFDO1lBQ3pDLEVBQUUsRUFBRyxTQUFTLENBQUMsR0FBRztZQUNsQixJQUFJLEVBQUcsU0FBUyxDQUFDLElBQUk7WUFDckIsS0FBSyxFQUFHLFNBQVMsQ0FBQyxLQUFLO1lBQ3ZCLFVBQVUsRUFBRyxTQUFTLENBQUMsVUFBVTtZQUNqQyxJQUFJLEVBQUcsU0FBUyxDQUFDLElBQUk7U0FDeEIsQ0FBQztZQUNFLFNBQVMsQ0FBRSxVQUFBLEdBQUc7WUFDVixPQUFPLENBQUMsR0FBRyxDQUFFLFFBQVEsRUFBRyxHQUFHLENBQUUsQ0FBQztZQUM5QixFQUFFLENBQUMsQ0FBRSxDQUFDLEdBQUcsQ0FBQyxLQUFNLENBQUM7Z0JBQUMsS0FBSSxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDO1FBQzNELENBQUMsQ0FBQyxDQUFDO0lBRVAsQ0FBQzs7SUFFRCxpQ0FBVSxHQUFWLFVBQVcsU0FBUyxFQUFFLEtBQUs7UUFDdkIsZ0NBQWdDO1FBQ2hDLEVBQUUsQ0FBQyxDQUFFLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBRyxDQUFDO1lBQUMsTUFBTSxDQUFDO1FBQzNFLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDckMsU0FBUyxDQUFDLElBQUksR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDO1FBQ3JDLE9BQU8sU0FBUyxDQUFDLFNBQVMsQ0FBQztRQUMzQixPQUFPLENBQUMsR0FBRyxDQUFFLFNBQVMsQ0FBRSxDQUFDO0lBQzdCLENBQUM7O0lBRUQsbUNBQVksR0FBWixVQUFhLFNBQVMsRUFBRSxLQUFLO1FBQ3pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ2xDLENBQUM7O0lBRUQsaURBQTBCLEdBQTFCLFVBQTJCLFNBQVMsRUFBRSxVQUFVO1FBQzVDLEVBQUUsQ0FBQyxDQUFFLENBQUMsU0FBUztZQUNWLENBQUMsU0FBUyxDQUFDLElBQUk7WUFDZixDQUFDLFVBQ04sQ0FBQyxDQUFDLENBQUM7WUFDQyxPQUFPLENBQUMsR0FBRyxDQUFDLDJCQUEyQixDQUFDLENBQUM7WUFDekMsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQixDQUFDO1FBQ0QsRUFBRSxDQUFBLENBQ0UsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBQSxFQUFFLElBQU0sTUFBTSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEtBQUssVUFBVSxHQUFHLElBQUksR0FBRyxLQUFLLENBQUEsQ0FBQyxDQUFDLENBQzlFLENBQUMsQ0FBQyxDQUFDO1lBQ0MsT0FBTyxDQUFDLEdBQUcsQ0FBRywrQkFBK0IsQ0FBRSxDQUFDO1lBQ2hELE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQztRQUNELE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDakIsQ0FBQzs7SUFNRCxtQkFBbUI7SUFDbkIsa0NBQVcsR0FBWDtRQUNJO1lBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDO2lCQUMzQyxRQUFRLENBQUMsRUFBRSxDQUFDO2lCQUNaLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixDQUFDO1FBQ0gsTUFBTSxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxHQUFHLEdBQUcsR0FBRyxFQUFFLEVBQUUsR0FBRyxHQUFHLEdBQUcsRUFBRSxFQUFFLEdBQUcsR0FBRztZQUN6QyxFQUFFLEVBQUUsR0FBRyxHQUFHLEdBQUcsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUM7SUFDM0MsQ0FBQzs7SUFFRCxxQ0FBcUM7SUFDckMsK0JBQVEsR0FBUixVQUFTLE1BQVc7UUFDaEIsSUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3BCLEVBQUUsQ0FBQyxDQUFDLE1BQU0sSUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ3ZDLE1BQU0sR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssZ0JBQWdCLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQztZQUMvRSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNuQixNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6QyxDQUFDO1FBQ0wsQ0FBQztRQUNELE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDbEIsQ0FBQzs7SUE3T0w7UUFBQyxnQkFBUyxDQUFDO1lBQ1AsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1lBQ25CLFFBQVEsRUFBRSxRQUFRO1lBQ2xCLFdBQVcsRUFBRSxtQkFBbUI7WUFDaEMsU0FBUyxFQUFFLENBQUMsZUFBZSxDQUFDO1lBQzVCLFNBQVMsRUFBRSxDQUFDLGdDQUFjLENBQUM7WUFDM0IsS0FBSyxFQUFFLENBQUMsc0NBQWlCLENBQUM7U0FDN0IsQ0FBQzs7b0JBQUE7SUEyT0YsbUJBQUM7QUFBRCxDQTFPQSxBQTBPQyxJQUFBO0FBMU9ZLG9CQUFZLGVBME94QixDQUFBIiwiZmlsZSI6ImNvbXBvbmVudHMvYXBwLmNvbXBvbmVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuaW1wb3J0IHtTdG9yYWdlU2VydmljZX0gZnJvbSBcIi4uL3NlcnZpY2VzL3N0b3JhZ2Uuc2VydmljZVwiO1xyXG5pbXBvcnQge09iamVjdFRvQXJyYXlQaXBlfSBmcm9tIFwiLi4vcGlwZXMvb2JqZWN0VG9BcnJheS5waXBlXCI7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICAgIG1vZHVsZUlkOiBtb2R1bGUuaWQsIFxyXG4gICAgc2VsZWN0b3I6ICdteS1hcHAnLFxyXG4gICAgdGVtcGxhdGVVcmw6ICdhcHAudGVtcGxhdGUuaHRtbCcsXHJcbiAgICBzdHlsZVVybHM6IFsnYXBwLnN0eWxlLmNzcyddLFxyXG4gICAgcHJvdmlkZXJzOiBbU3RvcmFnZVNlcnZpY2VdLFxyXG4gICAgcGlwZXM6IFtPYmplY3RUb0FycmF5UGlwZV1cclxufSlcclxuZXhwb3J0IGNsYXNzIEFwcENvbXBvbmVudCB7XHJcbiAgICBwdWJsaWMgbmV3X2NvbXBvbmVudCA9IHRoaXMuaW5pdF9uZXdfY29tcG9uZW50KCk7XHJcbiAgICBwdWJsaWMgY29tcG9uZW50cyA9IFtdO1xyXG4gICAgcHVibGljIGNvbXBvbmVudF9lZGl0YWJsZSA9IFtdO1xyXG4gICAgcHVibGljIG5ld19maWVsZCA9IHsgdHlwZTogXCJzdHJpbmdcIiB9OyAgICAgXHJcblxyXG4gICAgY29uc3RydWN0b3IocHVibGljIHN0b3JhZ2VTZXJ2aWNlOiBTdG9yYWdlU2VydmljZSkge31cclxuXHJcbiAgICBuZ09uSW5pdCgpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnbmdPbkluaXQnKTtcclxuICAgICAgICB0aGlzLmdldF9hbGxfY29tcG9uZW50cygpO1xyXG4gICAgfTtcclxuXHJcbiAgICBpbml0X25ld19jb21wb25lbnQobXV0YWJpbGl0eSA9ICcnKXtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBtdXRhYmlsaXR5IDogbXV0YWJpbGl0eVxyXG4gICAgICAgIH07XHJcbiAgICB9O1xyXG5cclxuICAgIHNldF9uZXdfY29tcG9uZW50X211dGFiaWxpdHkobXV0YWJpbGl0eSl7XHJcbiAgICAgICAgdGhpcy5uZXdfY29tcG9uZW50ID0gIHRoaXMuaW5pdF9uZXdfY29tcG9uZW50KCBtdXRhYmlsaXR5ICk7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICBnZXRfYWxsX2NvbXBvbmVudHMoKSB7XHJcbiAgICAgICAgdGhpcy5zdG9yYWdlU2VydmljZS5zZWxlY3QoJy9hcGkvY29tcG9uZW50cycgKS5cclxuICAgICAgICAgICAgc3Vic2NyaWJlKCByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coICdnZXQgLSAnICwgcmVzICk7XHJcbiAgICAgICAgICAgICAgICBpZiggIXJlcy5lcnJvciApIHRoaXMuY29tcG9uZW50cyA9IHJlcy5jb21wb25lbnRzO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgY3JlYXRlX2NvbXBvbmVudCgpe1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCB0aGlzLmNvbXBvbmVudHMgKTtcclxuICAgICAgICBpZiAoICF0aGlzLm5ld19jb21wb25lbnQubmFtZSApIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coICcgbm8gbmFtZSB3YXMgcHJvdmlkZWQgJyk7XHJcbiAgICAgICAgICAgIHJldHVybiA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICggdGhpcy5leGlzdF9jb21wb25lbnRfd2hpdGhfdGhpc19uYW1lKCkgKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCAnIGNvbXBvbmVudCB3aXRoIHN1Y2ggbmFtZSBleGlzdHMgJyApO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc3RvcmFnZVNlcnZpY2UuaW5zZXJ0KCcvYXBpL2NvbXBvbmVudHMnLCB7XHJcbiAgICAgICAgICAgIG5hbWUgOiB0aGlzLm5ld19jb21wb25lbnQubmFtZSxcclxuICAgICAgICAgICAgZ3JvdXAgOiB0aGlzLm5ld19jb21wb25lbnQuZ3JvdXAgfHwgJycsXHJcbiAgICAgICAgICAgIG11dGFiaWxpdHkgOiB0aGlzLm5ld19jb21wb25lbnQubXV0YWJpbGl0eSxcclxuICAgICAgICAgICAgYm9keSA6IFtdXHJcbiAgICAgICAgIH0pLlxyXG4gICAgICAgICAgICBzdWJzY3JpYmUoIHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJ3Bvc3QgLSAnICwgcmVzICk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggcmVzLm1zZyApO1xyXG4gICAgICAgICAgICAgICAgaWYgKCAhcmVzLmVycm9yICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29tcG9uZW50cyA9IHJlcy5jb21wb25lbnRzO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV3X2NvbXBvbmVudCA9IHRoaXMuaW5pdF9uZXdfY29tcG9uZW50KHRoaXMubmV3X2NvbXBvbmVudC5tdXRhYmlsaXR5KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIGNoYW5nZV9jb21wb25lbnQoY29tcG9uZW50KXtcclxuICAgICAgICBpZiAoICFjb21wb25lbnQubmV3X25hbWUgKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdubyBuYW1lIHdhcyBwcm92aWRlZCAnKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiggdGhpcy5leGlzdF9jb21wb25lbnRfd2hpdGhfdGhpc19uYW1lKGNvbXBvbmVudC5uZXdfbmFtZSkgKXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coICcgY29tcG9uZW50IHdpdGggc3VjaCBuYW1lIGV4aXN0cyAnICk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zdG9yYWdlU2VydmljZS51cGRhdGUoJy9hcGkvY29tcG9uZW50cycse1xyXG4gICAgICAgICAgICBpZCA6IGNvbXBvbmVudC5faWQsXHJcbiAgICAgICAgICAgIG5hbWUgOiBjb21wb25lbnQubmV3X25hbWUsXHJcbiAgICAgICAgICAgIGdyb3VwIDogY29tcG9uZW50Lmdyb3VwLFxyXG4gICAgICAgICAgICBtdXRhYmlsaXR5IDogdGhpcy5uZXdfY29tcG9uZW50Lm11dGFiaWxpdHksXHJcbiAgICAgICAgICAgIGJvZHkgOiBjb21wb25lbnQuYm9keVxyXG4gICAgICAgIH0pLlxyXG4gICAgICAgICAgICBzdWJzY3JpYmUoIHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJ3B1dCAtICcgLCByZXMgKTtcclxuICAgICAgICAgICAgICAgIGlmICggIXJlcy5lcnJvciApIHRoaXMuY29tcG9uZW50cyA9IHJlcy5jb21wb25lbnRzO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBjb3B5X2NvbXBvbmVudChjb21wb25lbnQpIHtcclxuICAgICAgICBpZiAoICFjb21wb25lbnQubmV3X25hbWUgKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCAnbm8gbmFtZSB3YXMgcHJvdmlkZWQgJyApO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKCB0aGlzLmV4aXN0X2NvbXBvbmVudF93aGl0aF90aGlzX25hbWUoY29tcG9uZW50Lm5ld19uYW1lKSApe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyggJyBjb21wb25lbnQgd2l0aCBzdWNoIG5hbWUgZXhpc3RzICcgKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnN0b3JhZ2VTZXJ2aWNlLmluc2VydCgnL2FwaS9jb21wb25lbnRzJywge1xyXG4gICAgICAgICAgICBuYW1lIDogY29tcG9uZW50Lm5ld19uYW1lLFxyXG4gICAgICAgICAgICBncm91cCA6IGNvbXBvbmVudC5ncm91cCxcclxuICAgICAgICAgICAgbXV0YWJpbGl0eSA6IGNvbXBvbmVudC5tdXRhYmlsaXR5LFxyXG4gICAgICAgICAgICBib2R5IDogY29tcG9uZW50LmJvZHlcclxuICAgICAgICAgfSkuXHJcbiAgICAgICAgICAgIHN1YnNjcmliZSggcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAncG9zdCAtICcgLCByZXMgKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCByZXMubXNnICk7XHJcbiAgICAgICAgICAgICAgICBpZiAoICFyZXMuZXJyb3IgKSB0aGlzLmNvbXBvbmVudHMgPSByZXMuY29tcG9uZW50cztcclxuICAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGRlbGV0ZV9jb21wb25lbnQoaWQpIHtcclxuICAgICAgICBpZiAoICFpZCApIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ25vIGlkIHdhcyBwcm92aWRlZCAnKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnN0b3JhZ2VTZXJ2aWNlLmRlbGV0ZSgnL2FwaS9jb21wb25lbnRzJywgaWQpLlxyXG4gICAgICAgICAgICBzdWJzY3JpYmUoIHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJ2RlbGV0ZSAtICcgLCByZXMgKTtcclxuICAgICAgICAgICAgICAgIGlmICggIXJlcy5lcnJvciApIHRoaXMuY29tcG9uZW50cyA9IHJlcy5jb21wb25lbnRzO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgZXhpc3RfY29tcG9uZW50X3doaXRoX3RoaXNfbmFtZShuYW1lID0gdGhpcy5uZXdfY29tcG9uZW50Lm5hbWUpe1xyXG4gICAgICAgIGlmKFxyXG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudHMuZmluZChlbCA9PiB7IHJldHVybiBlbC5uYW1lID09PSBuYW1lID8gdHJ1ZSA6IGZhbHNlIH0pXHJcbiAgICAgICAgICAgICkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfTtcclxuXHJcbiAgICBlZGl0X2ZpZWxkc19jb21wb25lbnQoY29tcG9uZW50KXtcclxuICAgICAgICB0aGlzLm5ld19maWVsZCA9IHsgdHlwZTogXCJzdHJpbmdcIiB9OyAgIFxyXG4gICAgICAgIHRoaXMuY29tcG9uZW50X2VkaXRhYmxlID0gY29tcG9uZW50O1xyXG4gICAgfTtcclxuXHJcbiAgICBzaG93X2ZpZWxkc19jb21wb25lbnQoY29tcG9uZW50KXtcclxuICAgICAgICBpZiAoICB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZSAmJlxyXG4gICAgICAgICAgICAgIHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLl9pZCA9PT0gY29tcG9uZW50Ll9pZCBcclxuICAgICAgICApIHJldHVybiB0cnVlO1xyXG4gICAgfTsgXHJcblxyXG4gICAgYWRkX2ZpZWxkKCBjb21wb25lbnQsIG5ld19maWVsZCA9IHt9ICl7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyggY29tcG9uZW50LCBuZXdfZmllbGQgKTtcclxuICAgICAgICBpZiAoIHRoaXMuZXhpc3RfZmllbGRfd2l0aF90aGlzX25hbWUoY29tcG9uZW50LCBuZXdfZmllbGQubmFtZSkgKSByZXR1cm4gO1xyXG4gICAgICAgIHRoaXMubmV3X2ZpZWxkID0geyB0eXBlOiBcInN0cmluZ1wiIH07IFxyXG4gICAgICAgIG5ld19maWVsZC5faWQgPSB0aGlzLmNyZWF0ZV9ndWlkKCk7XHJcbiAgICAgICAgY29tcG9uZW50LmJvZHkgPSBbIC4uLiBjb21wb25lbnQuYm9keSAsIG5ld19maWVsZCBdO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coIGNvbXBvbmVudC5ib2R5ICk7XHJcbiAgICAgICAgdGhpcy5zdG9yYWdlU2VydmljZS51cGRhdGUoJy9hcGkvY29tcG9uZW50cycse1xyXG4gICAgICAgICAgICBpZCA6IGNvbXBvbmVudC5faWQsXHJcbiAgICAgICAgICAgIG5hbWUgOiBjb21wb25lbnQubmFtZSxcclxuICAgICAgICAgICAgZ3JvdXAgOiBjb21wb25lbnQuZ3JvdXAsXHJcbiAgICAgICAgICAgIG11dGFiaWxpdHkgOiBjb21wb25lbnQubXV0YWJpbGl0eSxcclxuICAgICAgICAgICAgYm9keSA6IGNvbXBvbmVudC5ib2R5XHJcbiAgICAgICAgfSkuXHJcbiAgICAgICAgICAgIHN1YnNjcmliZSggcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAncHV0IC0gJyAsIHJlcyApO1xyXG4gICAgICAgICAgICAgICAgaWYgKCAhcmVzLmVycm9yICkgdGhpcy5jb21wb25lbnRzID0gcmVzLmNvbXBvbmVudHM7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBjaGFuZ2VfZmllbGQoIGNvbXBvbmVudCwgZmllbGQgPSB7fSApe1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coY29tcG9uZW50LCBmaWVsZCk7XHJcbiAgICAgICAgaWYgKCB0aGlzLmV4aXN0X2ZpZWxkX3dpdGhfdGhpc19uYW1lKGNvbXBvbmVudCwgZmllbGQuZWRpdF9uYW1lICkgKSByZXR1cm47XHJcbiAgICAgICAgZmllbGQubmFtZSA9IGZpZWxkLmVkaXRfbmFtZTtcclxuICAgICAgICBkZWxldGUgZmllbGQuZWRpdF9uYW1lO1xyXG5cclxuICAgICAgICB0aGlzLnN0b3JhZ2VTZXJ2aWNlLnVwZGF0ZSgnL2FwaS9jb21wb25lbnRzJyx7XHJcbiAgICAgICAgICAgIGlkIDogY29tcG9uZW50Ll9pZCxcclxuICAgICAgICAgICAgbmFtZSA6IGNvbXBvbmVudC5uYW1lLFxyXG4gICAgICAgICAgICBncm91cCA6IGNvbXBvbmVudC5ncm91cCxcclxuICAgICAgICAgICAgbXV0YWJpbGl0eSA6IGNvbXBvbmVudC5tdXRhYmlsaXR5LFxyXG4gICAgICAgICAgICBib2R5IDogY29tcG9uZW50LmJvZHlcclxuICAgICAgICB9KS5cclxuICAgICAgICAgICAgc3Vic2NyaWJlKCByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coICdwdXQgLSAnICwgcmVzICk7XHJcbiAgICAgICAgICAgICAgICBpZiAoICFyZXMuZXJyb3IgKSB0aGlzLmNvbXBvbmVudHMgPSByZXMuY29tcG9uZW50cztcclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgIH07XHJcblxyXG4gICAgY29weV9maWVsZChjb21wb25lbnQsIGZpZWxkKXtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKGNvbXBvbmVudCwgZmllbGQpO1xyXG4gICAgICAgIGlmICggdGhpcy5leGlzdF9maWVsZF93aXRoX3RoaXNfbmFtZShjb21wb25lbnQsIGZpZWxkLmVkaXRfbmFtZSApICkgcmV0dXJuO1xyXG4gICAgICAgIGxldCBuZXdfZmllbGQgPSB0aGlzLmRlZXBDb3B5KGZpZWxkKTtcclxuICAgICAgICBuZXdfZmllbGQubmFtZSA9IG5ld19maWVsZC5lZGl0X25hbWU7XHJcbiAgICAgICAgZGVsZXRlIG5ld19maWVsZC5lZGl0X25hbWU7XHJcbiAgICAgICAgY29uc29sZS5sb2coIG5ld19maWVsZCApO1xyXG4gICAgfTtcclxuXHJcbiAgICBkZWxldGVfZmllbGQoY29tcG9uZW50LCBmaWVsZCl7XHJcbiAgICAgICAgY29uc29sZS5sb2coY29tcG9uZW50LCBmaWVsZCk7XHJcbiAgICB9O1xyXG5cclxuICAgIGV4aXN0X2ZpZWxkX3dpdGhfdGhpc19uYW1lKGNvbXBvbmVudCwgZmllbGRfbmFtZSl7XHJcbiAgICAgICAgaWYgKCAhY29tcG9uZW50IHx8XHJcbiAgICAgICAgICAgICAhY29tcG9uZW50LmJvZHkgfHxcclxuICAgICAgICAgICAgICFmaWVsZF9uYW1lIFxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnIGZpZWxkcyB3YXMgbm90IHByb3ZpZGVkICcpO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoXHJcbiAgICAgICAgICAgIGNvbXBvbmVudC5ib2R5LmZpbmQoZWwgPT4geyByZXR1cm4gZWwubmFtZSA9PT0gZmllbGRfbmFtZSA/IHRydWUgOiBmYWxzZSB9KVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyggICcgZmllbGQgd2l0aCBzdWNoIG5hbWUgZXhpc3RzICcgKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH07XHJcbiAgICBcclxuXHJcblxyXG4gICAgXHJcblxyXG4gICAgLy8gcmV0dXJuIHVuaXF1ZSBpZFxyXG4gICAgY3JlYXRlX2d1aWQoKSB7XHJcbiAgICAgICAgZnVuY3Rpb24gczQoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBNYXRoLmZsb29yKCgxICsgTWF0aC5yYW5kb20oKSkgKiAweDEwMDAwKVxyXG4gICAgICAgICAgICAgICAgLnRvU3RyaW5nKDE2KVxyXG4gICAgICAgICAgICAgICAgLnN1YnN0cmluZygxKTtcclxuICAgICAgICB9XHJcbiBcdCAgICByZXR1cm4gczQoKSArIHM0KCkgKyAnLScgKyBzNCgpICsgJy0nICsgczQoKSArICctJyArXHJcbiAgICAgICAgICAgICAgIHM0KCkgKyAnLScgKyBzNCgpICsgczQoKSArIHM0KCk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vICBSZXR1cm5zIGEgZGVlcCBjb3B5IG9mIHRoZSBvYmplY3RcclxuICAgIGRlZXBDb3B5KG9sZE9iajogYW55KSB7XHJcbiAgICAgICAgbGV0IG5ld09iaiA9IG9sZE9iajtcclxuICAgICAgICBpZiAob2xkT2JqICYmIHR5cGVvZiBvbGRPYmogPT09IFwib2JqZWN0XCIpIHtcclxuICAgICAgICAgICAgbmV3T2JqID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9sZE9iaikgPT09IFwiW29iamVjdCBBcnJheV1cIiA/IFtdIDoge307XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgaW4gb2xkT2JqKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdPYmpbaV0gPSB0aGlzLmRlZXBDb3B5KG9sZE9ialtpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ld09iajtcclxuICAgIH07XHJcblxyXG5cclxuXHJcblxyXG59XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==

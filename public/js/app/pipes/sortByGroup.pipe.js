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
var sortByGroupPipe = (function () {
    function sortByGroupPipe() {
    }
    sortByGroupPipe.prototype.transform = function (value, args) {
        if (!args)
            return value;
        var arr = [];
        value.forEach(function (el) {
            if (el.group == args)
                arr = arr.concat([el]);
        });
        return arr;
    };
    sortByGroupPipe = __decorate([
        core_1.Pipe({ name: 'sortByGroup' }), 
        __metadata('design:paramtypes', [])
    ], sortByGroupPipe);
    return sortByGroupPipe;
}());
exports.sortByGroupPipe = sortByGroupPipe;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBpcGVzL3NvcnRCeUdyb3VwLnBpcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUNBLHFCQUFxQixlQUFlLENBQUMsQ0FBQTtBQUlyQztJQUFBO0lBV0EsQ0FBQztJQVZDLG1DQUFTLEdBQVQsVUFBVyxLQUFLLEVBQUUsSUFBSTtRQUVwQixFQUFFLENBQUMsQ0FBRSxDQUFDLElBQUssQ0FBQztZQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDMUIsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO1FBQ2IsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFTLEVBQUU7WUFDckIsRUFBRSxDQUFDLENBQUUsRUFBRSxDQUFDLEtBQUssSUFBSSxJQUFLLENBQUM7Z0JBQUMsR0FBRyxHQUFRLEdBQUcsU0FBRyxFQUFFLEVBQUUsQ0FBQztRQUNsRCxDQUFDLENBQUMsQ0FBQztRQUNILE1BQU0sQ0FBQyxHQUFHLENBQUM7SUFFYixDQUFDO0lBWEg7UUFBQyxXQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLENBQUM7O3VCQUFBO0lBWTlCLHNCQUFDO0FBQUQsQ0FYQSxBQVdDLElBQUE7QUFYWSx1QkFBZSxrQkFXM0IsQ0FBQSIsImZpbGUiOiJwaXBlcy9zb3J0QnlHcm91cC5waXBlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbmltcG9ydCB7IFBpcGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcblxyXG5AUGlwZSh7IG5hbWU6ICdzb3J0QnlHcm91cCcgfSlcclxuZXhwb3J0IGNsYXNzIHNvcnRCeUdyb3VwUGlwZSB7XHJcbiAgdHJhbnNmb3JtICh2YWx1ZSwgYXJncykge1xyXG5cclxuICAgIGlmICggIWFyZ3MgKSByZXR1cm4gdmFsdWU7XHJcbiAgICBsZXQgYXJyID0gW107XHJcbiAgICB2YWx1ZS5mb3JFYWNoKGZ1bmN0aW9uKGVsKXtcclxuICAgICAgICBpZiAoIGVsLmdyb3VwID09IGFyZ3MgKSBhcnIgPSBbIC4uLmFyciAsIGVsIF07XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBhcnI7XHJcbiAgICBcclxuICB9XHJcbn0iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=

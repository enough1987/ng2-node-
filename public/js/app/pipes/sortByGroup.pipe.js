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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBpcGVzL3NvcnRCeUdyb3VwLnBpcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUNBLHFCQUFxQixlQUFlLENBQUMsQ0FBQTtBQUlyQztJQUFBO0lBU0EsQ0FBQztJQVJDLG1DQUFTLEdBQVQsVUFBVyxLQUFLLEVBQUUsSUFBSTtRQUVwQixJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7UUFDYixLQUFLLENBQUMsT0FBTyxDQUFDLFVBQVMsRUFBRTtZQUNyQixFQUFFLENBQUMsQ0FBRSxFQUFFLENBQUMsS0FBSyxJQUFJLElBQUssQ0FBQztnQkFBQyxHQUFHLEdBQVEsR0FBRyxTQUFHLEVBQUUsRUFBRSxDQUFDO1FBQ2xELENBQUMsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxDQUFDLEdBQUcsQ0FBQztJQUNiLENBQUM7SUFUSDtRQUFDLFdBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsQ0FBQzs7dUJBQUE7SUFVOUIsc0JBQUM7QUFBRCxDQVRBLEFBU0MsSUFBQTtBQVRZLHVCQUFlLGtCQVMzQixDQUFBIiwiZmlsZSI6InBpcGVzL3NvcnRCeUdyb3VwLnBpcGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuaW1wb3J0IHsgUGlwZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuXHJcbkBQaXBlKHsgbmFtZTogJ3NvcnRCeUdyb3VwJyB9KVxyXG5leHBvcnQgY2xhc3Mgc29ydEJ5R3JvdXBQaXBlIHtcclxuICB0cmFuc2Zvcm0gKHZhbHVlLCBhcmdzKSB7XHJcblxyXG4gICAgbGV0IGFyciA9IFtdO1xyXG4gICAgdmFsdWUuZm9yRWFjaChmdW5jdGlvbihlbCl7XHJcbiAgICAgICAgaWYgKCBlbC5ncm91cCA9PSBhcmdzICkgYXJyID0gWyAuLi5hcnIgLCBlbCBdO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gYXJyO1xyXG4gIH1cclxufSJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==

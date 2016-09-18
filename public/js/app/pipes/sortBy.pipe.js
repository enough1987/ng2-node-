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
var sortByPipe = (function () {
    function sortByPipe() {
    }
    sortByPipe.prototype.transform = function (value, args) {
        var arr = [];
        console.log(value, args);
        return value;
    };
    sortByPipe = __decorate([
        core_1.Pipe({ name: 'sortBy' }), 
        __metadata('design:paramtypes', [])
    ], sortByPipe);
    return sortByPipe;
}());
exports.sortByPipe = sortByPipe;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBpcGVzL3NvcnRCeS5waXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFDQSxxQkFBcUIsZUFBZSxDQUFDLENBQUE7QUFJckM7SUFBQTtJQVFBLENBQUM7SUFQQyw4QkFBUyxHQUFULFVBQVcsS0FBSyxFQUFFLElBQUk7UUFDcEIsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO1FBRWIsT0FBTyxDQUFDLEdBQUcsQ0FBRSxLQUFLLEVBQUUsSUFBSSxDQUFFLENBQUM7UUFFM0IsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUNmLENBQUM7SUFSSDtRQUFDLFdBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsQ0FBQzs7a0JBQUE7SUFTekIsaUJBQUM7QUFBRCxDQVJBLEFBUUMsSUFBQTtBQVJZLGtCQUFVLGFBUXRCLENBQUEiLCJmaWxlIjoicGlwZXMvc29ydEJ5LnBpcGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuaW1wb3J0IHsgUGlwZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuXHJcbkBQaXBlKHsgbmFtZTogJ3NvcnRCeScgfSlcclxuZXhwb3J0IGNsYXNzIHNvcnRCeVBpcGUge1xyXG4gIHRyYW5zZm9ybSAodmFsdWUsIGFyZ3MpIHtcclxuICAgIHZhciBhcnIgPSBbXTtcclxuXHJcbiAgICBjb25zb2xlLmxvZyggdmFsdWUsIGFyZ3MgKTtcclxuXHJcbiAgICByZXR1cm4gdmFsdWU7XHJcbiAgfVxyXG59Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9

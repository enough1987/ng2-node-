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
var http_1 = require('@angular/http');
require('rxjs/add/operator/map');
require('rxjs/add/operator/catch');
var StorageService = (function () {
    function StorageService(http) {
        this.http = http;
    }
    StorageService.prototype.in_map_func = function (res) {
        return res.json() || {};
    };
    ;
    StorageService.prototype.select = function (url) {
        return this.http.get(url).
            map(this.in_map_func);
    };
    ;
    StorageService.prototype.insert = function (url, data) {
        if (data === void 0) { data = {}; }
        var stringified_data = JSON.stringify(data);
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post(url, stringified_data, { headers: headers }).
            map(this.in_map_func);
    };
    ;
    StorageService.prototype.update = function (url, data) {
        if (data === void 0) { data = {}; }
        var stringified_data = JSON.stringify(data);
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.put(url, stringified_data, { headers: headers }).
            map(this.in_map_func);
    };
    ;
    StorageService.prototype.delete = function (url, id) {
        var new_url = url + "?id=" + id;
        return this.http.delete(new_url).
            map(this.in_map_func);
    };
    ;
    StorageService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], StorageService);
    return StorageService;
}());
exports.StorageService = StorageService;
;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlcnZpY2VzL3N0b3JhZ2Uuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQ0EscUJBQTJCLGVBQWUsQ0FBQyxDQUFBO0FBQzNDLHFCQUE4QixlQUFlLENBQUMsQ0FBQTtBQUU5QyxRQUFPLHVCQUNQLENBQUMsQ0FENkI7QUFDOUIsUUFBTyx5QkFBeUIsQ0FBQyxDQUFBO0FBSWpDO0lBRUUsd0JBQW9CLElBQVU7UUFBVixTQUFJLEdBQUosSUFBSSxDQUFNO0lBQUcsQ0FBQztJQUUxQixvQ0FBVyxHQUFuQixVQUFvQixHQUFHO1FBQ25CLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFFO0lBQzdCLENBQUM7O0lBRUQsK0JBQU0sR0FBTixVQUFPLEdBQUc7UUFDUixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO1lBQ3ZCLEdBQUcsQ0FBRSxJQUFJLENBQUMsV0FBVyxDQUFFLENBQUM7SUFDNUIsQ0FBQzs7SUFFRCwrQkFBTSxHQUFOLFVBQU8sR0FBRyxFQUFFLElBQVM7UUFBVCxvQkFBUyxHQUFULFNBQVM7UUFDbkIsSUFBSSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzVDLElBQUksT0FBTyxHQUFHLElBQUksY0FBTyxFQUFFLENBQUM7UUFDNUIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztRQUNuRCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLGdCQUFnQixFQUFFLEVBQUMsU0FBQSxPQUFPLEVBQUMsQ0FBQztZQUNyRCxHQUFHLENBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBRSxDQUFDO0lBQzVCLENBQUM7O0lBRUQsK0JBQU0sR0FBTixVQUFPLEdBQUcsRUFBRSxJQUFTO1FBQVQsb0JBQVMsR0FBVCxTQUFTO1FBQ25CLElBQUksZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM1QyxJQUFJLE9BQU8sR0FBRyxJQUFJLGNBQU8sRUFBRSxDQUFDO1FBQzVCLE9BQU8sQ0FBQyxNQUFNLENBQUMsY0FBYyxFQUFFLGtCQUFrQixDQUFDLENBQUM7UUFDbkQsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxnQkFBZ0IsRUFBRSxFQUFDLFNBQUEsT0FBTyxFQUFDLENBQUM7WUFDcEQsR0FBRyxDQUFFLElBQUksQ0FBQyxXQUFXLENBQUUsQ0FBQztJQUM1QixDQUFDOztJQUVELCtCQUFNLEdBQU4sVUFBTyxHQUFHLEVBQUUsRUFBRTtRQUNaLElBQUksT0FBTyxHQUFNLEdBQUcsWUFBTyxFQUFJLENBQUM7UUFDaEMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQztZQUM5QixHQUFHLENBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBRSxDQUFDO0lBQzVCLENBQUM7O0lBbENIO1FBQUMsaUJBQVUsRUFBRTs7c0JBQUE7SUFxQ2IscUJBQUM7QUFBRCxDQXBDQSxBQW9DQyxJQUFBO0FBcENZLHNCQUFjLGlCQW9DMUIsQ0FBQTtBQUFBLENBQUMiLCJmaWxlIjoic2VydmljZXMvc3RvcmFnZS5zZXJ2aWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSGVhZGVycywgSHR0cCB9IGZyb20gJ0Bhbmd1bGFyL2h0dHAnO1xyXG5cclxuaW1wb3J0ICdyeGpzL2FkZC9vcGVyYXRvci9tYXAnXHJcbmltcG9ydCAncnhqcy9hZGQvb3BlcmF0b3IvY2F0Y2gnO1xyXG5cclxuXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFN0b3JhZ2VTZXJ2aWNlIHtcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwKSB7fVxyXG5cclxuICBwcml2YXRlIGluX21hcF9mdW5jKHJlcykge1xyXG4gICAgICByZXR1cm4gcmVzLmpzb24oKSB8fCB7fSA7XHJcbiAgfTtcclxuXHJcbiAgc2VsZWN0KHVybCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQodXJsKS5cclxuICAgICAgbWFwKCB0aGlzLmluX21hcF9mdW5jICk7XHJcbiAgfTsgXHJcblxyXG4gIGluc2VydCh1cmwsIGRhdGEgPSB7fSkge1xyXG4gICAgbGV0IHN0cmluZ2lmaWVkX2RhdGEgPSBKU09OLnN0cmluZ2lmeShkYXRhKTtcclxuICAgIGxldCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcclxuICAgIGhlYWRlcnMuYXBwZW5kKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KHVybCwgc3RyaW5naWZpZWRfZGF0YSwge2hlYWRlcnN9KS5cclxuICAgICAgbWFwKCB0aGlzLmluX21hcF9mdW5jICk7XHJcbiAgfTtcclxuICBcclxuICB1cGRhdGUodXJsLCBkYXRhID0ge30pIHtcclxuICAgIGxldCBzdHJpbmdpZmllZF9kYXRhID0gSlNPTi5zdHJpbmdpZnkoZGF0YSk7XHJcbiAgICBsZXQgaGVhZGVycyA9IG5ldyBIZWFkZXJzKCk7XHJcbiAgICBoZWFkZXJzLmFwcGVuZCgnQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcclxuICAgIHJldHVybiB0aGlzLmh0dHAucHV0KHVybCwgc3RyaW5naWZpZWRfZGF0YSwge2hlYWRlcnN9KS5cclxuICAgICAgbWFwKCB0aGlzLmluX21hcF9mdW5jICk7XHJcbiAgfTtcclxuXHJcbiAgZGVsZXRlKHVybCwgaWQpIHtcclxuICAgIGxldCBuZXdfdXJsID0gYCR7dXJsfT9pZD0ke2lkfWA7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShuZXdfdXJsKS5cclxuICAgICAgbWFwKCB0aGlzLmluX21hcF9mdW5jICk7ICAgIFxyXG4gIH07XHJcblxyXG5cclxufTtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9

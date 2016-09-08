import { ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Observable, EventEmitter } from '../../src/facade/async';
/**
 * The `async` pipe subscribes to an Observable or Promise and returns the latest value it has
 * emitted.
 * When a new value is emitted, the `async` pipe marks the component to be checked for changes.
 *
 * ### Example
 *
 * This example binds a `Promise` to the view. Clicking the `Resolve` button resolves the
 * promise.
 *
 * {@example core/pipes/ts/async_pipe/async_pipe_example.ts region='AsyncPipe'}
 *
 * It's also possible to use `async` with Observables. The example below binds the `time` Observable
 * to the view. Every 500ms, the `time` Observable updates the view with the current time.
 *
 * ```typescript
 * ```
 */
export declare class AsyncPipe implements OnDestroy {
    /** @internal */
    _latestValue: Object;
    /** @internal */
    _latestReturnedValue: Object;
    /** @internal */
    _subscription: Object;
    /** @internal */
    _obj: Observable<any> | Promise<any> | EventEmitter<any>;
    private _strategy;
    /** @internal */
    _ref: ChangeDetectorRef;
    constructor(_ref: ChangeDetectorRef);
    ngOnDestroy(): void;
    transform(obj: Observable<any> | Promise<any> | EventEmitter<any>): any;
    /** @internal */
    _subscribe(obj: Observable<any> | Promise<any> | EventEmitter<any>): void;
    /** @internal */
    _selectStrategy(obj: Observable<any> | Promise<any> | EventEmitter<any>): any;
    /** @internal */
    _dispose(): void;
    /** @internal */
    _updateLatestValue(async: any, value: Object): void;
}

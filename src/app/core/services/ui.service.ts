import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class UiService {
    scrollToIndex = 0;

    constructor() { }

    saveScrollOffset(x) {
        this.scrollToIndex = x;
    }
}
import { Component, ViewChild, ElementRef, OnInit, AfterViewInit, NgZone } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
    selector: 'app-header',
    templateUrl: './templates/header/header-template.html',
    styleUrls: ['styles/app/header/header-style.css']
})
export class HeaderComponent implements OnInit {
    @ViewChild('headerElem') header: ElementRef;
    searchActivatedClass: string = 'search-activated';
    
    constructor() { }
    
    ngOnInit() { }

    searchActivated(searchActivated: string) {
        //console.log('inside searchActivated. Param value is : ', searchActivated);
        this.header.nativeElement.classList.add(this.searchActivatedClass);
    }

    searchDeactivated(searchEvent: string) {
        //console.log('inside searchDeactivated. Param value is : ', searchEvent);
        this.header.nativeElement.classList.remove(this.searchActivatedClass);
    }
}
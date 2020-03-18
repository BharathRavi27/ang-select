import { Component, OnInit, TemplateRef, ViewContainerRef, EmbeddedViewRef, NgZone, ChangeDetectorRef, HostListener, Input, Output, HostBinding } from '@angular/core';
import Popper from 'popper.js';
import { fromEvent } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-custom-option',
  templateUrl: './custom-option.component.html',
  styleUrls: ['./custom-option.component.scss']
})
export class CustomOptionComponent implements OnInit {

  @HostListener("click") onClick() {

    this.selected.emit(this.value);
  }
  @Input() value;
  @Output() selected = new EventEmitter();
  @HostBinding('style.background-color') public color: string = 'lime';
  active: boolean = false;
  private view: EmbeddedViewRef<any>;
  private popperRef: Popper;
  constructor(private vcr: ViewContainerRef, private zone: NgZone, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  open(dropDownTemp: TemplateRef<any>, origin: HTMLElement) {
    this.view = this.vcr.createEmbeddedView(dropDownTemp);
    const dropdown = this.view.rootNodes[0];
    document.body.appendChild(dropdown);

    this.zone.runOutsideAngular(() => {
      this.popperRef = new Popper(origin, dropdown, {
        removeOnDestroy: true
      });
    });
    this.handleClickOutside()
  }

  private handleClickOutside() {
    fromEvent(document, 'click')
      .pipe(
        filter(({ target }) => {
          const origin = this.popperRef.reference as HTMLElement;
          return origin.contains(target as HTMLElement) === false;
        })
      )
      .subscribe(() => {
        this.close();
        this.cdr.detectChanges();
      });
  }

  close() {

    this.popperRef.destroy();
    this.view.destroy();

    this.view = null;
    this.popperRef = null;
  }

}

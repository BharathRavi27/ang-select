import { Component, OnInit, TemplateRef, ViewContainerRef, EmbeddedViewRef, NgZone, ChangeDetectorRef, HostListener, ContentChildren, QueryList } from '@angular/core';
import Popper from 'popper.js';
import { fromEvent } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { CustomOptionComponent } from '../custom-option/custom-option.component';

@Component({
  selector: 'app-custom-select',
  templateUrl: './custom-select.component.html',
  styleUrls: ['./custom-select.component.scss']
})
export class CustomSelectComponent implements OnInit {
  private view: EmbeddedViewRef<any>;
  private popperRef: Popper;


  @ContentChildren(CustomOptionComponent) childComponents: QueryList<CustomOptionComponent>;
  selected: any;

  ngAfterViewInit() {
    this.childComponents.forEach((childComponent: CustomOptionComponent, index) => {
      childComponent.selected.subscribe((item) => {
        this.updateParentValue(item);
        childComponent.active = false;
        childComponent.value === this.selected ? childComponent.active = true : null;
      });

    });
  }

  constructor(private vcr: ViewContainerRef, private zone: NgZone, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  updateParentValue(val) {

    this.selected = val;
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

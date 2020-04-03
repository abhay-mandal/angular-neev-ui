import { Directive, HostListener, OnInit, ElementRef } from '@angular/core';

@Directive({
  selector: "[clickStopPropagation]"
})

export class ClickEventDirective implements OnInit {

  @HostListener("click", ["$event"])
  public onClick(event: any): void {
    event.stopPropagation();
  }
  
  constructor(private el: ElementRef) {
  }

  ngOnInit(){
    this.el.nativeElement.textContent += ":)";
    console.log("In directive");
  }

}

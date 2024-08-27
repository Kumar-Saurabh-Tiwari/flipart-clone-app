import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { CartService } from 'src/app/service/cart.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  private currentIndex: number = 0;
  private intervalId: any;
  public productList : any ;
  public filterCategory : any
  searchKey:string ="";
  currentSlide = 0;
  slideInterval: any;
  constructor(private api : ApiService, private cartService : CartService) { }

  ngOnInit(): void {
    this.startAutoSlide();
    this.api.getProduct()
    .subscribe(res=>{
      this.productList = res;
      this.filterCategory = res;
      this.productList.forEach((a:any) => {
        if(a.category ==="women's clothing" || a.category ==="men's clothing"){
          a.category ="fashion"
        }
        Object.assign(a,{quantity:1,total:a.price});
      });
      console.log(this.productList)
    });

    this.cartService.search.subscribe((val:any)=>{
      this.searchKey = val;
    })
  }
  addtocart(item: any){
    this.cartService.addtoCart(item);
  }
  filter(category:string){
    this.filterCategory = this.productList
    .filter((a:any)=>{
      if(a.category == category || category==''){
        return a;
      }
    })
  }

  startAutoSlide() {
    const slider = document.getElementById('slider');
    this.intervalId = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % 4; // Assuming 4 images
      slider!.style.transform = `translateX(-${this.currentIndex * 100}%)`;
    }, 4000); // 4 seconds
  }

  stopAutoSlide() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }


  nextSlide(): void {
    const slider = document.getElementById('slider') as HTMLElement;
    this.currentSlide = (this.currentSlide + 1) % slider.children.length;
    this.updateSlider();
  }

  prevSlide(): void {
    const slider = document.getElementById('slider') as HTMLElement;
    this.currentSlide = (this.currentSlide - 1 + slider.children.length) % slider.children.length;
    this.updateSlider();
  }

  updateSlider(): void {
    const slider = document.getElementById('slider') as HTMLElement;
    const slideWidth = slider.clientWidth;
    slider.style.transform = `translateX(-${this.currentSlide * slideWidth}px)`;
  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }
}

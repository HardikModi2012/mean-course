import { Component, OnInit } from '@angular/core';
import { SubSink } from '../Core/Subsink';
import { CrudService } from '../services/crud.service';

@Component({
  selector: 'app-random-faq',
  templateUrl: './random-faq.component.html',
  styleUrls: ['./random-faq.component.css']
})
export class RandomFaqComponent implements OnInit {
  allFaq = [];

  private subSink = new SubSink();
  constructor(private crud: CrudService) { }

  ngOnInit() {
  }

  openFaqModal() {

  }

  ngOnDestroy() {
    this.subSink.unSubscribe();
  }

  getAllFAQs(){
    this.subSink.sink = this.crud.getById(1).subscribe({
      next: (res: any) => {
        this.allFaq = res;
      },
      error: (error: any) =>{
        console.log("error", error);

      }
    })
  }

  onSectionChange(id: number) {
    for (let index = 0; index < this.allFaq.length; index++) {
      let element = this.allFaq[index];

      // if (element.id == id) {
      //   element.active = !element.active;
      // }
      // else {
      //   element.active = false;
      // }

    }
  }

  onFaqEditCLick(id: any) {

  }

  onDelete(id: any) {

  }

}

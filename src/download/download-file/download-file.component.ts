import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../../core/services/api.service';
import {DesignService} from '../../core/services/design.service';

@Component({
  selector: 'app-download-file',
  templateUrl: './download-file.component.html',
  styleUrls: ['./download-file.component.scss']
})
export class DownloadFileComponent implements OnInit {
  value: string = '';
  fileData: string = '';

  constructor(private apiS: ApiService, private ds: DesignService, private activatedRoute: ActivatedRoute) {
    this.value = this.activatedRoute.snapshot.params?.['id'];
    this.onViewFile();
  }

  ngOnInit(): void {}

  onViewFile() {
    if (!!this.value) {
      this.apiS.getArrayBuffer('Common/DownloadFiles', {fileName: this.value}).subscribe({
        next: (success) => {
          const file = new Blob([success], {type: 'application/pdf'});
          this.fileData = window.URL.createObjectURL(file);

          const iframe = document.createElement('iframe');

          iframe.width = '100%';
          iframe.height = '100%';
          iframe.src = this.fileData;
          document.querySelector('#ViewFileContainerForExternalUse')?.appendChild(iframe);
        },
        error: (error) => {
          this.ds.showError(error);
        }
      });
    }
  }
}

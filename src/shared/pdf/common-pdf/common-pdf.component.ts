import { Component, OnInit } from '@angular/core';
import html2canvas from 'html2canvas';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

@Component({
  selector: 'app-common-pdf',
  templateUrl: './common-pdf.component.html',
  styleUrls: ['./common-pdf.component.css']
})
export class CommonPdfComponent implements OnInit {
  assessmentQuestionList: any = [];
  constructor() {
    // (window as any).pdfMake.vfs = pdfFonts.pdfMake.vfs;

  }

  tableLayoutHeader = {
    hLineWidth: function (i, node) {
      if (i === 0 || i === node.table.body.length) {
        return 0;
      }
      return (i === node.table.headerRows) ? 2 : 1;
    },
    vLineWidth: function (i) {
      return 0;
    },
    hLineColor: function (i) {
      return i === 1 ? 'black' : '#aaa';
    },
    paddingLeft: function (i) {
      return i === 0 ? 0 : 8;
    },
    paddingRight: function (i, node) {
      return (i === node.table.widths.length - 1) ? 0 : 8;
    }
  };

  tableLayoutCat = {
    hLineWidth: function (i, node) {
      if (i === 0 || i === node.table.body.length) {
        return 0;
      }
      return (i === node.table.headerRows) ? 2 : 1;
    },
    vLineWidth: function (i) {
      return 0;
    },
    hLineColor: function (i) {
      return i === 1 ? 'black' : '#aaa';
    },
    paddingLeft: function (i) {
      return i === 0 ? 0 : 8;
    },
    paddingRight: function (i, node) {
      return (i === node.table.widths.length - 1) ? 0 : 8;
    }
  };

  docDefinition: any = () => {
    return {
      pageSize: 'A4',
      content: [
        {
          columns: [
            {
              margin: [0, 0, 50, 0],
              stack: [

              ]
            }
          ]
        },

        ...this.tableData(),
        '\n',
        {
          pageBreak: 'before',
          pageSize: {
            width: 595
          },
          style: '',
          table: {
            body: [
              [{ text: 'Daily affirmations:', style: '' }],
              [{
                columns: [
                  {
                    margin: [20, 0, 0, 0],
                    stack: [
                      {
                        ol: [
                          "",
                          "",
                          "",
                          "",
                          "",
                          "",
                        ]
                      },
                      {
                        margin: [150, 0, 0, 0],
                        columns: [
                          { image: '' }]
                      }
                    ]
                  }
                ]
              }]
            ]
          }
        }
      ]
    }
  }

  ngOnInit() {
  }

  tableData(): Array<any> {
    let resultFormat: any[] = [];
    if (this.assessmentQuestionList.length > 0) {
      const headers = {
        layout: this.tableLayoutHeader,
        table: {
          headerRow: 1,
          widths: [290, 100, 100],
          body: [
            [
              {
                text: 'Question',
                color: 'black',
                fontSize: 10,
                height: 5,
                marginTop: 6
              },
              {
                text: 'Answer',
                color: 'black',
                fontSize: 10,
                marginTop: 6
              },
              {
                text: 'Units',
                color: 'black',
                fontSize: 10,
                marginTop: 6
              }
            ]
          ]
        }
      }
      resultFormat.push();
      this.assessmentQuestionList.forEach(element => {
        const headersCat = {
          layout: this.tableLayoutCat,
          table: {
            headerRow: 1,
            widths: [290, 100, 100],
            body: [
              [
                {
                  text: element.name,
                  color: 'black',
                  fontSize: 10,
                  height: 5,
                  fontWeight: 'bold'
                }
              ]
            ]
          }
        }
      });
      return resultFormat;
    }
    return resultFormat;
  }
}

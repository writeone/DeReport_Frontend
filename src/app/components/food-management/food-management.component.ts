import { Component, OnInit } from '@angular/core';
import { AppserverService } from '../../services/appserver.service';
import { element } from '@angular/core/src/render3/instructions';
declare const $;


@Component({
  selector: 'app-food-management',
  templateUrl: './food-management.component.html',
  styleUrls: ['./food-management.component.css']
})
export class FoodManagementComponent implements OnInit {


  public getfood;
  public getdatefood;
  public fileToUpload: File = null;
  public menuFiles = [];
  public sMsg = '';
  public detail: any;
  public datepicker;
  public newDate;
  public days = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
  // tslint:disable-next-line:max-line-length
  public months = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];

  constructor(private __Appserver: AppserverService) { }



  ngOnInit() {
    this.menuDateChange();
    this.getDetailMenu();
  }

  private menuDateChange() {
    let env = this;
    $.fn.datepicker.dates['en'] = {
      days: ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์'],
      daysShort: ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา'],
      daysMin: ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา'],
      // tslint:disable-next-line:max-line-length
      months: ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'],
      monthsShort: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'],
      today: 'วันนี้',
      clear: 'Clear',
      format: 'ประจำวัน DD ที่ dd MM yyyy',
      titleFormat: 'MM yyyy', /* Leverages same syntax as 'format' */
      weekStart: 0
    };
    $('#startDate').datepicker({
      language: 'en',
      autoclose: true,
      todayHighlight: true
    }).on('changeDate', function (ev) {
      const sendDate = {
        date: ev.date
      };
      console.log(ev.date, "DATE SENDING")
      env.__Appserver.changeMenuDate(sendDate).subscribe((result) => {
      })
    });
  }

  private getFileDetails(evt) {
    const files = evt.target.files; // FileList object

    // Loop through the FileList and render image files as thumbnails.
    for (let i = 0, f; f = files[i]; i++) {
      const menuDetail = {};
      // Only process image files.
      if (!f.type.match('image.*')) {
        continue;
      }

      const reader = new FileReader();


      const self = this;
      // Closure to capture the file information.
      reader.onloadend = (function (theFile) {
        return function (e) {
          menuDetail['img'] = e.target.result;
          menuDetail['name'] = theFile.name.replace(/\.[^/.]+$/, '');
          self.menuFiles.push(menuDetail);
          console.log(menuDetail);
          this.detail = document.createElement('div');
          this.detail.className = 'col-md-4 col-xs-6';
          // tslint:disable-next-line:max-line-length
          this.detail.innerHTML = ['<div class="card ml-4 mt-3" style="width: 18rem;"><img style="height: 220px;" class="card-img-top" src="', e.target.result,
            // tslint:disable-next-line:max-line-length
            '" title="', escape(theFile.name), '"/><div class="card-body" style="text-align: center;"> <h5 class="card-title">', theFile.name.replace(/\.[^/.]+$/, ''), '</h5></div></div>'].join('');
          document.getElementById('list').insertBefore(this.detail, null);
        };
      })(f);

      // Read in the image file as a data URL.
      reader.readAsDataURL(f);

    }
    const upper = this;
    console.log(this.menuFiles, "ส่งข้อมูล");
    console.log(typeof this.menuFiles);
    $('#uploadData').click(function () {
      upper.__Appserver.uploadMenu(upper.menuFiles).subscribe((result) => {
        console.log(result);
        location.reload();
      })
    })
  }

  private clearFileDetail() {
    // alert("ลบ");
    // console.log(this.menuFiles.length);
    // for(let i = 0; i < this.menuFiles.length; i++) {
    //   this.menuFiles.shift()
    // }
    // const uploadIMG = document.getElementById('files') as HTMLInputElement;
    // const ltstFood = document.getElementById('list');
    // const form1 = document.getElementById('fileform');
    // ltstFood.innerHTML = null;
    // uploadIMG.value = null;
    // console.log(this.detail);
    location.reload();
  }

  public getDetailMenu() {
    this.__Appserver.getFoodMenu().subscribe((res) => {
      this.getfood = res.data[0].menu;
      this.getdatefood = res.data[0].date;
      console.log(typeof this.getdatefood)
      this.datepicker = new Date(this.getdatefood);
      console.log(this.datepicker, "--datepicker--")
      var dd = this.datepicker.getDate();
      var day = this.days[this.datepicker.getDay()]
      var mm = this.months[this.datepicker.getMonth()];
      var yyyy = this.datepicker.getFullYear();
      this.datepicker = "ประจำวัน" + " " + day + " ที่" + "  " + dd + "  " + mm + "  " + yyyy;
      (<HTMLInputElement>document.getElementById('startDate')).value = this.datepicker;
    })
  }

  private deleteMenu() {
    if (confirm('ต้องการลบข้อมูลเมนูอาหารทั้งหมดใช่หรือไม่?')) {
      this.__Appserver.deleteMenuData().subscribe((res) => {
        location.reload();
      })
    } else {
      // Do nothing!
    }
  }

}


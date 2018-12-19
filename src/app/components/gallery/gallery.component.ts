import { Component, OnInit } from '@angular/core';
import { AppserverService } from '../../services/appserver.service';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { GalleryService } from '../../services/gallery.service';
import { Http } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'hammerjs';
declare const App;
declare const $;
@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {
  public url;
  public albums;
  public imgAlbum;
  public nameAlbum;
  public galleryFiles = [];
  public detail: any;
  public imgpath;
  public optionGallery = [
    {
        "image": false,
        "thumbnailsRemainingCount": true,
        "height": "212px",
        "thumbnailsColumns": 1,
        "previewfullWidth": true,
        "width": "100%"
    },
    {
        "breakpoint": 500,
        "width": "50%",
        "thumbnailsColumns": 1
    }
]


  constructor(private http: HttpClient, private __appserverservice: AppserverService, private __galleryservice: GalleryService, ) {
    this.url = this.__appserverservice.baseUrl;
  }

  ngOnInit() {
    App.initLoadJquery();
    this.GetGallery();
    this.galleryDetail();
    // this.imagePreview();
  }

  public GetGallery() {
    this.__appserverservice.getGallery().subscribe((res) => {
      this.albums = res;
      console.log(this.albums, "XOXO")
      console.log(this.albums[0], "อั้มบั้ม1")
    })
  }

  public galleryDetail() {
    $("#อัลบั้ม").hide()
    $('#backMain').hide()
    $('.albumName').hide()
    $(document).ready(function () {
      $(".albumDetail").click(function (event) {
        console.log(event)
        $('#main').hide();
        $('#addAlbum').hide();
        $('#อัลบั้ม').show();
        $('#backMain').show()
        $('.albumName').show()
        $('#galleryName').hide();
      })
      $("#backMain").click(function () {
        $("#อัลบั้ม").hide()
        $('#backMain').hide()
        $('#main').show();
        $('#addAlbum').show();
        $('.albumName').hide()
        $('#galleryName').show();
      })
    })
  }

  public getvalue(url, name) {
    this.imgAlbum = url;
    this.nameAlbum = name;
    console.log(this.imgAlbum, this.nameAlbum, "test");
  }

  public deleteAlbum() {
    confirm("ยืนยันการลบ???");
  }

  public backtomain() {
    this.imgAlbum = null;
    this.nameAlbum = null;
  }

  public getFileDetails(evt) {
    var files = evt.target.files; // FileList object

    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {
      let menuDetail = {};
      // Only process image files.
      if (!f.type.match('image.*')) {
        continue;
      }

      var reader = new FileReader();


      var self = this;
      // Closure to capture the file information.
      reader.onloadend = (function (theFile) {
        return function (e) {
          menuDetail['img'] = e.target.result;
          menuDetail['name'] = theFile.name.replace(/\.[^/.]+$/, "");
          self.galleryFiles.push(menuDetail);
          console.log(menuDetail);
          this.detail = document.createElement('div');
          this.detail.className = "col-md-4 col-xs-6";
          this.detail.innerHTML = ['<div class="card ml-4 mt-3" style="width: 18rem;"><img style="height: 220px;" class="card-img-top" src="', e.target.result,
            '" title="', escape(theFile.name), '"/><div class="card-body" style="text-align: center;"><button type="button" id="PicDelete" class="btn btn-outline-danger">ลบรูป</button></div></div>'].join('');
          document.getElementById('list').insertBefore(this.detail, null);
        };
      })(f);

      // Read in the image file as a data URL.
      reader.readAsDataURL(f);

    }
    console.log(this.galleryFiles);
  }

  public clearFileDetail() {
    this.galleryFiles = [];
    const uploadIMG = document.getElementById('files') as HTMLInputElement;
    const ltstFood = document.getElementById('list')
    let form1 = document.getElementById('fileform');
    ltstFood.innerHTML = null;
    uploadIMG.value = null;
    console.log(this.detail)
  }

  // public imagePreview() {
  //     $('#ลบรูป').click(function(event) {
  //       console.log(event)
  //       alert('test')
  //       $('.imagepreview').attr('src', $(this).find('img').attr('src'));
  //       $('#imagemodal').modal('show');   
  //     });
  //   }

  public getNameAlbum(evt) {
    let galleryName = {};
    galleryName['name'] = evt.target.value;
    this.galleryFiles.push(galleryName);
    console.log(this.galleryFiles);
  }

  public getimg(val) {
    console.log(val);
    this.imgpath = val;
    $('.imagepreview').attr('src', this.imgpath);
    $('#imagemodal').modal('show'); 
  }

  public clearimgpreview() {
    this.imgpath = null;
    $('.imagepreview').attr('src', this.imgpath);
  }
  

}

//variable
var w ;
var h ;


function printExif(dataURL) {
    var originalImg = new Image();
    originalImg.src = dataURL;
    move(4);

    var exif = piexif.load(dataURL);
    var s = ""
    /*
    if (exif["thumbnail"]) {
        var thumbStr = "data:image/jpeg;base64," + btoa(exif["thumbnail"]);
        var img = "<img src='{img}'></img>".replace("{img}", thumbStr);
        s += ("<table class='t'><tr><th class='th'>thumbnail</th></tr><tr><td>" +
              img + "</td></tr></table><br>");
    }
    */
    var newDiv = $("<div class='z'></div>").html(s).hide();
    $("#output").prepend(newDiv);

    originalImg.onload = function () {
        w = originalImg.width;
        h = originalImg.height;
        var size = $("<div></div>").text("Original size:" + w + "*" + h);
        var im = $(originalImg).addClass("originalImage");
        //newDiv.prepend(im);
        newDiv.prepend(size);
        resizeImage(dataURL);
    }

    newDiv.slideDown(1000);

}


function resizeImage(imageURLdata) {

  imageToDataUri(imageURLdata, function(ooo){
      console.log("resized");
      move(4);
      editphoto(ooo);
  });


}

function editphoto(evt) {
  var zeroth = {};
  zeroth[piexif.ImageIFD.Make] = "RICOH";
  zeroth[piexif.ImageIFD.Model] = "Ricoh Theta S";
  zeroth[piexif.ImageIFD.Software] = "360_Sebastien_G";
  var exifObj = {"0th":zeroth};
  var exifbytes = piexif.dump(exifObj);
  var inserted = piexif.insert(exifbytes, evt);
  download(inserted, "FacebookPhoto360Ready.jpeg", "image/jpeg");
  move(4);
  return "resize";
}


function imageToDataUri(img, callback) {

    var width_base = 5376;
    var height_base = 2688;
    var local_h = Math.round((h*5376)/w) ;



    // create an off-screen canvas
    var canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d');

    var imgP = new Image();
    imgP.src = img;
    // set its dimension to target size
    canvas.width = 5376;
    canvas.height = 2688;

    // draw source image into the off-screen canvas:
    ctx.fillRect(0,0,5376,2688);

    //ctx.drawImage(imgP, 0, ((2688-w)/2), 5376, 2688);

    if ((h/w)> .5){
      console.log("up");
        var local_wx = Math.round((h*2688)/h) ;
      ctx.drawImage(imgP, ((5376-local_wx)/2), 0, local_wx, 2688);

    }else {
      var local_hx = Math.round((h*5376)/w) ;
      ctx.drawImage(imgP, 0, ((2688-local_hx)/2), 5376, local_hx);
    }



    callback(canvas.toDataURL('image/jpeg'));
    return ("exif editing");
}


function handleFileSelect(evt) {
    chargement = 0
    console.log("on load");
    move(4);
    var file = evt.target.files[0];
    var reader = new FileReader();
    reader.onloadend = function(e){
        printExif(e.target.result);
    };
    reader.readAsDataURL(file);
}

document.getElementById('f').addEventListener('change', handleFileSelect, false);

var chargement = 0

function move(val) {
  var elem = document.getElementById("myBar");
  var marche = (100/val) ;
  var width = marche*chargement;
  var id = setInterval(frame, 10);
  chargement = chargement+marche ;
  function frame() {
    if (width >= 100) {
      clearInterval(id);
    } else {
      width++;
      elem.style.width = width + '%';
      document.getElementById("label").innerHTML = width * 1  + '%';
    }
  }
}

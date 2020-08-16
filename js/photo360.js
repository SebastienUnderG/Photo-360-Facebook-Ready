// variable
let w;
let h;
let chargement = 0;

function printExif(dataURL) {
    let originalImg = new Image();
    originalImg.src = dataURL;
    move(4);
    let exif = piexif.load(dataURL);
    let s = "";
    let newDiv = $("<div class='z'></div>").html(s).hide();
    $("#output").prepend(newDiv);

    originalImg.onload = function () {
        w = originalImg.width;
        h = originalImg.height;
        let size = $("<div></div>").text("Original size:" + w + "*" + h);
        newDiv.prepend(size);
        resizeImage(dataURL);
    };
    newDiv.slideDown(1000);
}


function resizeImage(imageURLdata) {
    imageToDataUri(imageURLdata, function (image) {
        console.log("resized");
        move(4);
        editphoto(image);
    });
}

function editphoto(evt) {
    let zeroth = {};
    zeroth[piexif.ImageIFD.Make] = "RICOH";
    zeroth[piexif.ImageIFD.Model] = "Ricoh Theta S";
    zeroth[piexif.ImageIFD.Software] = "360_Sebastien_G";
    let exifObj = {"0th": zeroth};
    let exifbytes = piexif.dump(exifObj);
    let inserted = piexif.insert(exifbytes, evt);
    download(inserted, "FacebookPhoto360Ready.jpeg", "image/jpeg");
    move(4);
    return "resize";
}


function imageToDataUri(img, callback) {
    const width_base = 5376;
    const height_base = 2688;
    let local_h = Math.round((h * width_base) / w);

    // create an off-screen canvas
    let canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d');

    let imgP = new Image();
    imgP.src = img;

    // set its dimension to target size
    canvas.width = width_base;
    canvas.height = height_base;

    // draw source image into the off-screen canvas:
    ctx.fillRect(0, 0, width_base, height_base);

    if ((h / w) > .5) {
        console.log("up");
        let local_width = Math.round((w * height_base) / h);
        ctx.drawImage(imgP, ((width_base - local_width) / 2), 0, local_width, height_base);
    } else {
        console.log("down");
        let local_height = Math.round((h * width_base) / w);
        ctx.drawImage(imgP, 0, ((height_base - local_height) / 2), width_base, local_height);
    }

    callback(canvas.toDataURL('image/jpeg'));
    return ("exif editing");
}

function handleFileSelect(evt) {
    chargement = 0;
    console.log("on load");
    move(4);
    let file = evt.target.files[0];
    let reader = new FileReader();
    reader.onloadend = function (e) {
        printExif(e.target.result);
    };
    reader.readAsDataURL(file);
}

function move(val) {
    let elem = document.getElementById("myBar");
    let marche = (100 / val);
    let width = marche * chargement;
    let id = setInterval(frame, 10);
    chargement = chargement + marche;

    function frame() {
        if (width >= 100) {
            clearInterval(id);
        } else {
            width++;
            elem.style.width = width + '%';
            document.getElementById("label").innerHTML = width + '%';
        }
    }
}

document.getElementById('f').addEventListener('change', handleFileSelect, false);

// Variables globales
let w; // Largeur de l'image originale
let h; // Hauteur de l'image originale
let chargement = 0; // Variable pour la barre de progression

// Fonction pour afficher les informations Exif de l'image
const printExif = (dataURL) => {
    // Créer une nouvelle image et charger l'image à partir des données URL
    const originalImg = new Image();
    originalImg.src = dataURL;

    // Mettre à jour la barre de progression pour indiquer le chargement de l'image
    move(4);

    // Charger les données Exif de l'image
    const exif = piexif.load(dataURL);

    // Créer un élément de div pour afficher les informations Exif (masqué initialement)
    const newDiv = $("<div class='z'></div>").html('').hide();
    $("#output").prepend(newDiv);

    // Une fois l'image chargée, récupérer sa largeur et sa hauteur
    originalImg.onload = () => {
        w = originalImg.width;
        h = originalImg.height;

        // Afficher les dimensions originales de l'image
        const size = $(`<div>Original size: ${w} * ${h}</div>`);
        newDiv.prepend(size);

        // Redimensionner l'image pour la préparation à la génération Facebook 360
        resizeImage(dataURL);
    };

    // Faire apparaitre le div contenant les informations Exif avec une animation de glissement
    newDiv.slideDown(1000);
};

// Fonction pour redimensionner l'image à la taille requise pour Facebook 360
const resizeImage = (imageURLdata) => {
    // Appeler la fonction imageToDataUri pour redimensionner l'image
    imageToDataUri(imageURLdata, (image) => {
        // Mettre à jour la barre de progression pour indiquer le redimensionnement
        move(4);
        // Appeler la fonction editphoto pour éditer l'image (ajouter les Exif, etc.)
        editphoto(image);
    });
};

// Fonction pour éditer l'image en ajoutant les informations Exif
const editphoto = (evt) => {
    // Créer un objet Exif avec les informations requises (fabricant, modèle, logiciel)
    const zeroth = {
        [piexif.ImageIFD.Make]: "RICOH",
        [piexif.ImageIFD.Model]: "Ricoh Theta S",
        [piexif.ImageIFD.Software]: "360_Sebastien_G"
    };
    const exifObj = { "0th": zeroth };

    // Convertir les informations Exif en octets
    const exifbytes = piexif.dump(exifObj);

    // Insérer les informations Exif dans l'image redimensionnée
    const inserted = piexif.insert(exifbytes, evt);

    // Télécharger l'image avec les informations Exif ajoutées
    download(inserted, "FacebookPhoto360Ready.jpeg", "image/jpeg");

    // Mettre à jour la barre de progression pour indiquer la fin du traitement
    move(4);

    // Renvoyer un message indiquant que l'image a été redimensionnée et éditée
    return "resize";
};

// Fonction pour redimensionner l'image à une taille spécifique
const imageToDataUri = (img, callback) => {
    // Dimensions de base pour Facebook 360
    const width_base = 5376;
    const height_base = 2688;

    // Calculer la hauteur locale en conservant le ratio d'aspect de l'image originale
    const local_h = Math.round((h * width_base) / w);

    // Créer un canvas hors écran
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const imgP = new Image();
    imgP.src = img;

    // Définir les dimensions du canvas à la taille cible
    canvas.width = width_base;
    canvas.height = height_base;

    // Dessiner l'image source sur le canvas
    ctx.fillRect(0, 0, width_base, height_base);

    if ((h / w) > .5) {
        // Si l'image est plus haute que large
        console.log("up");
        const local_width = Math.round((w * height_base) / h);
        ctx.drawImage(imgP, ((width_base - local_width) / 2), 0, local_width, height_base);
    } else {
        // Si l'image est plus large que haute
        console.log("down");
        const local_height = Math.round((h * width_base) / w);
        ctx.drawImage(imgP, 0, ((height_base - local_height) / 2), width_base, local_height);
    }

    // Appeler la fonction de rappel avec l'URL de données de l'image redimensionnée
    callback(canvas.toDataURL('image/jpeg'));

    // Renvoyer un message indiquant que l'édition des Exif a été effectuée
    return "exif editing";
};

// Fonction pour gérer la sélection de fichier
const handleFileSelect = (evt) => {
    // Réinitialiser le chargement à 0
    chargement = 0;
    console.log("on load");

    // Mettre à jour la barre de progression pour indiquer le chargement du fichier
    move(4);

    // Récupérer le fichier sélectionné
    const file = evt.target.files[0];

    // Créer un lecteur de fichier pour lire les données du fichier sélectionné
    const reader = new FileReader();

    // Lorsque la lecture est terminée, appeler la fonction printExif pour afficher les informations Exif
    reader.onloadend = (e) => {
        printExif(e.target.result);
    };

    // Lire le contenu du fichier sous forme d'URL de données
    reader.readAsDataURL(file);
};

// Fonction pour mettre à jour la barre de progression
const move = (val) => {
    const elem = document.getElementById("myBar");
    const marche = (100 / val);
    let width = marche * chargement;
    const id = setInterval(() => {
        if (width >= 100) {
            clearInterval(id);
        } else {
            width++;
            elem.style.width = width + '%';
            document.getElementById("label").innerHTML = width + '%';
        }
    }, 10);
    chargement = chargement + marche;
};

// Écouter l'événement de changement de fichier et appeler la fonction handleFileSelect
document.getElementById('fileInput').addEventListener('change', handleFileSelect, false);

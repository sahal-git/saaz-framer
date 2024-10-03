let cropper;
let secondaryImages = [];
let currentIndex = 0;
let primaryImageDimensions = { width: 0, height: 0 };
let croppedImage;
let primaryImageFile = null;

const HD_WIDTH = 1920;
const HD_HEIGHT = 1080;

document.getElementById('primary-image').addEventListener('change', handlePrimaryImage);
document.getElementById('secondary-images').addEventListener('change', handleSecondaryImages);

function handlePrimaryImage(event) {
    primaryImageFile = event.target.files[0]; // Store the selected primary image file
    if (primaryImageFile) {
        const primaryImage = new Image();
        primaryImage.onload = () => {
            primaryImageDimensions.width = primaryImage.width;
            primaryImageDimensions.height = primaryImage.height;
            console.log('Primary image dimensions:', primaryImageDimensions);
        };
        primaryImage.src = URL.createObjectURL(primaryImageFile);
    } else {
        console.log('No primary image selected.');
    }
}

function handleSecondaryImages(event) {
    secondaryImages = Array.from(event.target.files);
    currentIndex = 0;
    if (secondaryImages.length > 0) {
        console.log('Secondary images loaded:', secondaryImages);
        processNextImage();
    } else {
        console.log('No secondary images selected.');
    }
}

function processNextImage() {
    if (currentIndex < secondaryImages.length) {
        const secondaryImage = secondaryImages[currentIndex];
        const secondaryPreview = document.getElementById('secondary-preview');
        const cropButton = document.getElementById('crop-button');

        secondaryPreview.src = URL.createObjectURL(secondaryImage);
        secondaryPreview.style.display = 'block';
        secondaryPreview.style.width = '70%';
        console.log('Processing image:', secondaryImage.name);

        if (cropper) {
            cropper.destroy();
            console.log('Cropper destroyed.');
        }

        secondaryPreview.onload = () => {
            const aspectRatio = primaryImageDimensions.width / primaryImageDimensions.height;

            cropper = new Cropper(secondaryPreview, {
                aspectRatio: aspectRatio,
                viewMode: 1,
                responsive: true,
                zoomable: true,
                scalable: true,
                movable: true,
                cropBoxResizable: true,
                cropBoxMovable: true,
                ready() {
                    console.log('Cropper ready.');
                }
            });

            cropButton.style.display = 'block';
            cropButton.onclick = cropImage;
            console.log('Crop button set up.');
        };
    } else {
        location.reload(); // Reload the page after processing all images
    }
}

function cropImage() {
    console.log('Crop button clicked.');
    const croppedCanvas = cropper.getCroppedCanvas();

    croppedCanvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        croppedImage = new Image();

        croppedImage.onload = () => {
            console.log('Cropped image loaded.');
            document.getElementById('crop-button').style.display = 'none';
            document.getElementById('secondary-preview').style.display = 'none';

            const canvas = document.getElementById('canvas');
            const ctx = canvas.getContext('2d');

            const canvasAspectRatio = primaryImageDimensions.width / primaryImageDimensions.height;
            let canvasWidth, canvasHeight;

            if (HD_WIDTH / HD_HEIGHT > canvasAspectRatio) {
                canvasWidth = HD_HEIGHT * canvasAspectRatio;
                canvasHeight = HD_HEIGHT;
            } else {
                canvasWidth = HD_WIDTH;
                canvasHeight = HD_WIDTH / canvasAspectRatio;
            }

            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            
            ctx.drawImage(croppedImage, 0, 0, canvasWidth, canvasHeight);
            overlayPrimaryImage();
        };
        croppedImage.src = url;
    }, 'image/jpeg'); // Save as JPEG format
}

function overlayPrimaryImage() {
    console.log('Overlaying primary image.');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    if (primaryImageFile) {
        const primaryImage = new Image();

        primaryImage.onload = () => {
            ctx.drawImage(primaryImage, 0, 0, canvas.width, canvas.height);
            addWatermark(ctx, canvas);
            downloadImage(canvas, `Framed_with_Saaz_Framer_${currentIndex + 1}.jpeg`);
            currentIndex++;
            processNextImage();
        };

        primaryImage.src = URL.createObjectURL(primaryImageFile);
    } else {
        console.log('Please select both images.');
    }
}
/*
function addWatermark(ctx, canvas) {
    const watermarkText = "Framed with Saaz Framer";
    const fontSize = Math.floor(canvas.width * 0.01);
    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.transform = "rotate(-90deg)";
    const x = 20;
    const y = canvas.height / 2;
    ctx.fillText(watermarkText, x, y);
}
*/
function downloadImage(canvas, filename) {
    console.log('Downloading image:', filename);
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/jpeg', 1.0); // High-quality JPEG
    link.download = filename;
    link.click();
}

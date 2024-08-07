let cropper;
let secondaryImages = [];
let currentIndex = 0;
let primaryImageDimensions = { width: 0, height: 0 };
let croppedImage;
let primaryImageFile = null; // Variable to store the primary image file
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
            const secondaryImageWidth = secondaryPreview.naturalWidth;
            const secondaryImageHeight = secondaryPreview.naturalHeight;
            console.log('Secondary image dimensions:', { width: secondaryImageWidth, height: secondaryImageHeight });

            const aspectRatio = primaryImageDimensions.width / primaryImageDimensions.height;
            const cropWidth = Math.min(HD_WIDTH, secondaryImageWidth);
            const cropHeight = cropWidth / aspectRatio;

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
                    cropper.setCropBoxData({
                        width: cropWidth,
                        height: cropHeight,
                    });
                    console.log('Crop box data set:', cropper.getCropBoxData());
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
    const croppedCanvas = cropper.getCroppedCanvas({
        width: Math.min(HD_WIDTH, cropper.getCanvasData().naturalWidth),
        height: Math.min(HD_HEIGHT, cropper.getCanvasData().naturalHeight),
    });

    const ctx = document.getElementById('canvas').getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    croppedCanvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        croppedImage = new Image();

        croppedImage.onload = () => {
            console.log('Cropped image loaded.');
            document.getElementById('crop-button').style.display = 'none';
            document.getElementById('secondary-preview').style.display = 'none';
            const canvas = document.getElementById('canvas');
            const ctx = canvas.getContext('2d');

            const primaryAspectRatio = primaryImageDimensions.width / primaryImageDimensions.height;
            let canvasWidth, canvasHeight;

            if (HD_WIDTH / HD_HEIGHT > primaryAspectRatio) {
                canvasWidth = HD_HEIGHT * primaryAspectRatio;
                canvasHeight = HD_HEIGHT;
            } else {
                canvasWidth = HD_WIDTH;
                canvasHeight = HD_WIDTH / primaryAspectRatio;
            }

            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            
            ctx.drawImage(croppedImage, 0, 0, canvasWidth, canvasHeight);
            overlayPrimaryImage();
        };
        croppedImage.src = url;
    }, 'image/png');
}

function overlayPrimaryImage() {
    console.log('Overlaying primary image.');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    if (primaryImageFile) {
        const primaryImage = new Image();

        primaryImage.onload = () => {
            if (croppedImage) {
                ctx.drawImage(croppedImage, 0, 0, canvas.width, canvas.height);
            }
            ctx.drawImage(primaryImage, 0, 0, canvas.width, canvas.height);
            addWatermark(ctx, canvas);
            downloadImage(canvas, 'Framed with Saaz Framer.png');
            currentIndex++;
            processNextImage();
        };

        primaryImage.src = URL.createObjectURL(primaryImageFile);
    } else {
        console.log('Please select both images.');
    }
}

function addWatermark(ctx, canvas) {
    const watermarkText = "Framed with Saaz Framer";
    const fontSize = Math.floor(canvas.width * 0.01); // Smaller font size
    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)"; // White with more transparency
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    const x = 20; // 10 pixels from the left
    const y = canvas.height / 2; // Vertically centered
    ctx.fillText(watermarkText, x, y);
}

function downloadImage(canvas, filename) {
    console.log('Downloading image:', filename);
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = filename;
    link.click();
}

let cropper;
let secondaryImages = [];
let currentIndex = 0;
let primaryImageDimensions = { width: 0, height: 0 };
let croppedImage; // Declare croppedImage here

document.getElementById('primary-image').addEventListener('change', handlePrimaryImage);
document.getElementById('secondary-images').addEventListener('change', handleSecondaryImages);

function handlePrimaryImage(event) {
    const primaryInput = event.target.files[0];
    if (primaryInput) {
        const primaryImage = new Image();
        primaryImage.onload = () => {
            primaryImageDimensions.width = primaryImage.width;
            primaryImageDimensions.height = primaryImage.height;
            console.log('Primary image dimensions:', primaryImageDimensions);
        };
        primaryImage.src = URL.createObjectURL(primaryInput);
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
        secondaryPreview.style.width = '70%'; // Set preview size to 70%
        console.log('Processing image:', secondaryImage.name);

        if (cropper) {
            cropper.destroy();
            console.log('Cropper destroyed.');
        }

        cropper = new Cropper(secondaryPreview, {
            aspectRatio: primaryImageDimensions.width / primaryImageDimensions.height,
            viewMode: 1,
            responsive: true,
            zoomable: true,
            scalable: true,
            movable: true,
            cropBoxResizable: true,
            cropBoxMovable: true,
            ready() {
                console.log('Cropper ready.');
                const containerData = cropper.getContainerData();
                const cropBoxData = cropper.getCropBoxData();
                const aspectRatio = primaryImageDimensions.width / primaryImageDimensions.height;
                const newCropBoxWidth = containerData.width;
                const newCropBoxHeight = containerData.width / aspectRatio;

                cropper.setCropBoxData({
                    left: cropBoxData.left,
                    top: (containerData.height - newCropBoxHeight) / 2,
                    width: newCropBoxWidth,
                    height: newCropBoxHeight
                });
                console.log('Crop box data set:', cropper.getCropBoxData());
            }
        });

        cropButton.style.display = 'block';
        cropButton.onclick = cropImage;
        console.log('Crop button set up.');
    } else {
        alert('All images processed.');
    }
}

function cropImage() {
    console.log('Crop button clicked.');
    const croppedCanvas = cropper.getCroppedCanvas({
        width: primaryImageDimensions.width,
        height: primaryImageDimensions.height,
    });

    const ctx = document.getElementById('canvas').getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before drawing

    croppedCanvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        croppedImage = new Image(); // Define croppedImage here

        croppedImage.onload = () => {
            console.log('Cropped image loaded.');
            document.getElementById('crop-button').style.display = 'none';
            document.getElementById('secondary-preview').style.display = 'none';
            const canvas = document.getElementById('canvas');
            const ctx = canvas.getContext('2d');
            ctx.canvas.width = croppedImage.width;
            ctx.canvas.height = croppedImage.height;
            ctx.drawImage(croppedImage, 0, 0);
            overlayPrimaryImage();
        };
        croppedImage.src = url;
    }, 'image/png');
}

function overlayPrimaryImage() {
    console.log('Overlaying primary image.');
    const primaryInput = document.getElementById('primary-image');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    if (primaryInput.files && primaryInput.files[0]) {
        const primaryImage = new Image();

        primaryImage.onload = () => {
            if (croppedImage) {
                ctx.drawImage(croppedImage, 0, 0); // Draw secondary image first
            }
            ctx.drawImage(primaryImage, 0, 0, primaryImageDimensions.width, primaryImageDimensions.height); // Overlay primary image
            downloadImage(canvas, `merged-image-${currentIndex + 1}.png`);
            currentIndex++;
            processNextImage(); // Load the next image
        };

        primaryImage.src = URL.createObjectURL(primaryInput.files[0]);
    } else {
        alert('Please select both images.');
    }
}

function downloadImage(canvas, filename) {
    console.log('Downloading image:', filename);
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = filename;
    link.click();
}

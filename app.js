const { useState, useEffect, useRef } = React;

function App() {
  const [primaryImage, setPrimaryImage] = useState(null);
  const [secondaryImages, setSecondaryImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cropper, setCropper] = useState(null);
  const [primaryImageDimensions, setPrimaryImageDimensions] = useState({ width: 0, height: 0 });
  const secondaryPreviewRef = useRef(null);
  const canvasRef = useRef(null);

  const HD_WIDTH = 1920;
  const HD_HEIGHT = 1080;

  useEffect(() => {
    if (secondaryImages.length > 0 && currentIndex < secondaryImages.length) {
      processNextImage();
    }
  }, [currentIndex, secondaryImages]);

  function handlePrimaryImage(event) {
    const file = event.target.files[0];
    if (file) {
      setPrimaryImage(file);
      const img = new Image();
      img.onload = () => {
        setPrimaryImageDimensions({ width: img.width, height: img.height });
        console.log('Primary image dimensions:', { width: img.width, height: img.height });
      };
      img.src = URL.createObjectURL(file);
    } else {
      console.log('No primary image selected.');
    }
  }

  function handleSecondaryImages(event) {
    const files = Array.from(event.target.files);
    setSecondaryImages(files);
    setCurrentIndex(0);
    if (files.length > 0) {
      console.log('Secondary images loaded:', files);
    } else {
      console.log('No secondary images selected.');
    }
  }

  function processNextImage() {
    if (currentIndex < secondaryImages.length) {
      const secondaryImage = secondaryImages[currentIndex];
      const secondaryPreview = secondaryPreviewRef.current;
      if (secondaryPreview) {
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
          const newCropper = new Cropper(secondaryPreview, {
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
          setCropper(newCropper);
        };
      }
    } else {
      window.location.reload();
    }
  }

  function cropImage() {
    console.log('Crop button clicked.');
    if (!cropper) return;
    const croppedCanvas = cropper.getCroppedCanvas();
    croppedCanvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const croppedImage = new Image();
      croppedImage.onload = () => {
        console.log('Cropped image loaded.');
        const canvas = canvasRef.current;
        if (!canvas) return;
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
    }, 'image/jpeg');
  }

  function overlayPrimaryImage() {
    console.log('Overlaying primary image.');
    const canvas = canvasRef.current;
    if (!canvas || !primaryImage) return;
    const ctx = canvas.getContext('2d');
    const primaryImg = new Image();
    primaryImg.onload = () => {
      ctx.drawImage(primaryImg, 0, 0, canvas.width, canvas.height);
      addWatermark(ctx, canvas);
      downloadImage(canvas, `Framed_with_Saaz_Framer_${currentIndex + 1}.jpeg`);
      setCurrentIndex(currentIndex + 1);
    };
    primaryImg.src = URL.createObjectURL(primaryImage);
  }

  function addWatermark(ctx, canvas) {
    const watermarkText = "Framed with Saaz Framer";
    const fontSize = Math.floor(canvas.width * 0.01);
    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = "rgba(255, 255, 255, 0)";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.transform = "rotate(-90deg)";
    const x = 20;
    const y = canvas.height / 2;
    ctx.fillText(watermarkText, x, y);
  }

  function downloadImage(canvas, filename) {
    console.log('Downloading image:', filename);
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/jpeg', 1.0);
    link.download = filename;
    link.click();
  }

  return (
    <div className="container">
      <h1>SAAZ FRAMER</h1>
      <div className="upload-section">
        <label htmlFor="primary-image" className="upload-label">Upload Primary Image</label>
        <input type="file" id="primary-image" accept="image/*" onChange={handlePrimaryImage} />
        <label htmlFor="secondary-images" className="upload-label">Upload Secondary Images</label>
        <input type="file" id="secondary-images" accept="image/*" multiple onChange={handleSecondaryImages} />
      </div>
      <div className="preview-section">
        <img ref={secondaryPreviewRef} id="secondary-preview" style={{ display: 'none' }} />
        <canvas ref={canvasRef} id="canvas" style={{ display: 'none' }} />
      </div>
      <div className="buttons">
        <button id="crop-button" style={{ display: cropper ? 'block' : 'none' }} onClick={cropImage}>Crop & Merge</button>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root')); 
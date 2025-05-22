import React, { useState, useEffect, useRef } from 'react';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import './styles.css';

function UploadIcon() {
  return (
    <svg className="upload-icon" fill="none" viewBox="0 0 32 32" stroke="currentColor" strokeWidth="2">
      <rect x="6" y="20" width="20" height="6" rx="2" fill="#e9e5fa" stroke="#b0b6c3"/>
      <path d="M16 24V8" stroke="#7c3aed" strokeWidth="2.2" strokeLinecap="round"/>
      <path d="M11 13l5-5 5 5" stroke="#7c3aed" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function App() {
  const [step, setStep] = useState(1); // 1: frame, 2: images, 3: cropping, 4: done
  const [primaryImage, setPrimaryImage] = useState(null);
  const [secondaryImages, setSecondaryImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cropper, setCropper] = useState(null);
  const [primaryImageDimensions, setPrimaryImageDimensions] = useState({ width: 0, height: 0 });
  const [finalImage, setFinalImage] = useState(null);
  const secondaryPreviewRef = useRef(null);
  const canvasRef = useRef(null);

  const HD_WIDTH = 1920;
  const HD_HEIGHT = 1080;

  // Effect to process the next image or go to done step
  useEffect(() => {
    if (step === 3) {
      if (currentIndex < secondaryImages.length) {
        // Process the current image
        processNextImage();
      } else if (secondaryImages.length > 0) {
        // All images processed, go to Done step
        setStep(4);
      }
    }
    // eslint-disable-next-line
  }, [step, currentIndex, secondaryImages]);

  function handlePrimaryImage(event) {
    const file = event.target.files[0];
    if (file) {
      setPrimaryImage(file);
      const img = new Image();
      img.onload = () => {
        setPrimaryImageDimensions({ width: img.width, height: img.height });
        setStep(2);
      };
      img.src = URL.createObjectURL(file);
    }
  }

  function handleSecondaryImages(event) {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      setSecondaryImages(files);
      setCurrentIndex(0);
      setStep(3);
      setFinalImage(null);
    }
  }

  function processNextImage() {
    const secondaryImage = secondaryImages[currentIndex];
    const secondaryPreview = secondaryPreviewRef.current;
    if (secondaryPreview) {
      secondaryPreview.src = URL.createObjectURL(secondaryImage);
      secondaryPreview.style.display = 'block';
      secondaryPreview.style.width = '70%';
      if (cropper) {
        cropper.destroy();
      }
      secondaryPreview.onload = () => {
        const aspectRatio = primaryImageDimensions.width / primaryImageDimensions.height || 1;
        const newCropper = new Cropper(secondaryPreview, {
          aspectRatio: aspectRatio,
          viewMode: 1,
          responsive: true,
          zoomable: true,
          scalable: true,
          movable: true,
          cropBoxResizable: true,
          cropBoxMovable: true,
        });
        setCropper(newCropper);
      };
    }
  }

  function cropImage() {
    if (!cropper) return;
    const croppedCanvas = cropper.getCroppedCanvas();
    croppedCanvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const croppedImage = new Image();
      croppedImage.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const canvasAspectRatio = primaryImageDimensions.width / primaryImageDimensions.height || 1;
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
    const canvas = canvasRef.current;
    if (!canvas || !primaryImage) return;
    const ctx = canvas.getContext('2d');
    const primaryImg = new Image();
    primaryImg.onload = () => {
      ctx.drawImage(primaryImg, 0, 0, canvas.width, canvas.height);
      addWatermark(ctx, canvas);

      setFinalImage(canvas.toDataURL('image/jpeg', 1.0));
      downloadImage(canvas, `Framed_with_Saaz_Framer_${currentIndex + 1}.jpeg`);

      // Only increment index here, useEffect handles next step/image
      setCurrentIndex(prevIndex => prevIndex + 1);
    };
    primaryImg.src = URL.createObjectURL(primaryImage);
  }

  function addWatermark(ctx, canvas) {
    const watermarkText = "Framed with Saaz Framer";
    const fontSize = Math.floor(canvas.width * 0.01);
    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = "rgba(255, 255, 255, 0)"; // Watermark is currently invisible
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";

    // Apply translation and rotation
    const x = 20; // Adjust as needed for visible watermark placement
    const y = canvas.height / 2; // Adjust as needed for visible watermark placement
    ctx.translate(x, y);
    ctx.rotate(-Math.PI / 2);

    // Draw text at the new origin (0, 0)
    ctx.fillText(watermarkText, 0, 0);

    // Reset transform
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  function downloadImage(canvas, filename) {
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/jpeg', 1.0);
    link.download = filename;
    link.click();
  }

  function handleReload() {
    setStep(1);
    setPrimaryImage(null);
    setSecondaryImages([]);
    setCurrentIndex(0);
    setCropper(null);
    setPrimaryImageDimensions({ width: 0, height: 0 });
    setFinalImage(null);
  }

  const steps = [
    { label: 'Frame' },
    { label: 'Images' },
    { label: 'Crop' },
    { label: 'Done' },
  ];

  return (
    <div className="container">
      <div className="logo-row">
        <svg className="brand-logo" viewBox="0 0 44 44" fill="none"><rect x="6" y="6" width="32" height="32" rx="8" fill="#e9e5fa" stroke="#7c3aed" strokeWidth="2.5"/><rect x="14" y="14" width="16" height="16" rx="4" fill="#fff" stroke="#7c3aed" strokeWidth="1.5"/></svg>
        <h1>SAAZ FRAMER</h1>
        <div className="tagline">Frame your memories with style. Crop and merge in seconds.</div>
      </div>
      <div className="step-tracker">
        {steps.map((s, i) => (
          <div key={s.label} className={`step-tab${step === i+1 ? ' active' : ''}`}>{s.label}</div>
        ))}
      </div>
      {step === 1 && (
        <>
          <div className="section-heading">Step 1: Upload your frame</div>
          <div className="section-instruction">Choose a frame/background image. It will be used as overlay for all your images.</div>
          <div className="upload-box">
            <UploadIcon />
            <span className="upload-label">Click or drag to upload</span>
            <span className="upload-helper">Supported: PNG/JPG • Max 2MB • Ideal: 1080x1080px</span>
            <input type="file" accept="image/*" onChange={handlePrimaryImage} />
            {primaryImage && <div className="file-name">{primaryImage.name}</div>}
          </div>
        </>
      )}
      {step === 2 && (
        <>
          <div className="section-heading">Step 2: Upload your images</div>
          <div className="section-instruction">Select one or more images to be framed. You can select multiple files at once.</div>
          <div className="upload-box">
            <UploadIcon />
            <span className="upload-label">Click or drag to upload</span>
            <span className="upload-helper">Supported: PNG/JPG • Max 2MB</span>
            <input type="file" accept="image/*" multiple onChange={handleSecondaryImages} />
            {secondaryImages.length > 0 && <div className="file-name">{secondaryImages.length} image(s) selected</div>}
          </div>
        </>
      )}
      {step === 3 && (
        <div className="preview-section">
          <div className="section-heading">Step 3: Crop your image</div>
          <div className="section-instruction">Adjust the crop area to match your frame. Click <b>Crop & Merge</b> to continue.</div>
          <div style={{textAlign: 'center', marginBottom: 12}}>
            <img ref={secondaryPreviewRef} id="secondary-preview" alt="Secondary" />
          </div>
          <div className="buttons" style={{justifyContent: 'center'}}>
            <button id="crop-button" onClick={cropImage}>Crop & Merge</button>
          </div>
          <canvas ref={canvasRef} id="canvas" style={{ display: 'none' }} /> {/* Canvas is kept hidden for processing */}
          <div style={{color: '#b0b6c3', textAlign: 'center', marginTop: 16, fontSize:'0.98rem'}}>
            Image {currentIndex + 1} of {secondaryImages.length}
          </div>
          <div style={{color:'#7c3aed', fontSize:'0.95rem', marginTop:8}}>
            Tip: You can zoom, move, and resize the crop box for best results.
          </div>
        </div>
      )}
      {step === 4 && (
        <div className="preview-section" style={{textAlign: 'center'}}>
          <div className="section-heading" style={{color:'#7c3aed', fontSize:'1.13rem'}}>Thank you for using Saaz Framer!</div>
          <div className="section-instruction">Here is your framed image.</div>
          {finalImage && <img src={finalImage} alt="Final Framed" style={{maxWidth: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', margin: '20px auto'}} />}
          <button onClick={handleReload}>Start Over</button>
        </div>
      )}
      <footer>
        © 2025 Saaz Framer — Crafted with ❤️ for your memories
      </footer>
    </div>
  );
}

export default App; 
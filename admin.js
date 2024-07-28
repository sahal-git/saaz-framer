document.addEventListener('DOMContentLoaded', function() {
    const uploadFrameButton = document.getElementById('upload-frame');
    const frameInput = document.getElementById('frame-image');
    const saveSettingsButton = document.getElementById('save-settings');
    const frameWidthInput = document.getElementById('frame-width');
    const frameHeightInput = document.getElementById('frame-height');
    const frameWidthDisplay = document.getElementById('frame-width-display');
    const frameHeightDisplay = document.getElementById('frame-height-display');
    const frameDimensionsDiv = document.getElementById('frame-dimensions');
    const statusMessage = document.getElementById('status-message');

    uploadFrameButton.addEventListener('click', function() {
        const file = frameInput.files[0];

        if (!file) {
            showMessage('Please select a PNG frame image.');
            return;
        }

        if (file.type !== 'image/png') {
            showMessage('Please upload a PNG image.');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const frameImage = new Image();
            frameImage.src = e.target.result;

            frameImage.onload = function() {
                // Display dimensions
                frameWidthDisplay.textContent = frameImage.width;
                frameHeightDisplay.textContent = frameImage.height;
                frameWidthInput.value = frameImage.width;
                frameHeightInput.value = frameImage.height;
                frameDimensionsDiv.classList.remove('hidden');

                const frameSettings = {
                    frameImage: e.target.result,
                    frameSize: {
                        width: frameImage.width,
                        height: frameImage.height
                    }
                };

                localStorage.setItem('frameSettings', JSON.stringify(frameSettings));
                showMessage('Frame image uploaded and settings saved.');
            };
        };
        reader.readAsDataURL(file);
    });

    saveSettingsButton.addEventListener('click', function() {
        const width = parseInt(frameWidthInput.value, 10);
        const height = parseInt(frameHeightInput.value, 10);

        if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
            showMessage('Please enter valid dimensions.');
            return;
        }

        const frameSettings = JSON.parse(localStorage.getItem('frameSettings')) || {};
        frameSettings.frameSize = { width, height };

        localStorage.setItem('frameSettings', JSON.stringify(frameSettings));
        showMessage('Frame size updated and settings saved.');
    });

    function showMessage(message) {
        statusMessage.textContent = message;
        statusMessage.classList.remove('hidden');
        setTimeout(() => statusMessage.classList.add('hidden'), 3000);
    }
});

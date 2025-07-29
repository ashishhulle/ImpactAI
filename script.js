const URL = 'https://teachablemachine.withgoogle.com/models/hFJ7H0itp/';

const loadingStatus = document.querySelector('.loadingStatus .loadingContainer');
const uploadedImage = document.querySelector('#uploaded-image');
const webcamElement = document.createElement('video');
let model, labelContainer, maxPredictions, webcam;

async function init() {
    const modelURL = URL + 'model.json';
    const metadataURL = URL + 'metadata.json';
    
    // Load the model and metadata
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Append elements to the DOM
    labelContainer = document.querySelector('#label-container .indicator');
    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement('div')).innerHTML = '0%';
    }
    
    // Setup webcam
    webcam = new tmImage.Webcam(200, 200, true); // width, height, flip
    await webcam.setup(); // Request access to the webcam
    await webcam.play();
    document.querySelector('#webcam-container').appendChild(webcam.canvas);
    window.requestAnimationFrame(loop);
}

async function loop() {
    webcam.update(); // Update the webcam frame
    await predict(webcam.canvas);
    window.requestAnimationFrame(loop);
}

// Run the uploaded image through the model
async function predict(imageElement) {
    const prediction = await model.predict(imageElement, false);
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = prediction[i].className + ': ' + (prediction[i].probability * 100).toFixed(2) + '%';
        labelContainer.querySelectorAll('div')[i].innerHTML = classPrediction;
        labelContainer.querySelectorAll('div')[i].style.width = `${prediction[i].probability.toFixed(2) * 100}%`;
    }
    loadingStatus.style.display = 'none';
}

document.getElementById('image-upload').addEventListener('change', function(event) {
    document.getElementById('file-name').textContent = this.files[0].name;
    loadingStatus.style.display = 'block';
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function() {
        const image = new Image();
        uploadedImage.src = reader.result;
        uploadedImage.style.display = 'block';
        image.src = reader.result;
        image.onload = function() {
            setTimeout(() => {
                predict(image);
            }, 100);
        };
    };
    reader.readAsDataURL(file);
});

init();

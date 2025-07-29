const URL = 'https://teachablemachine.withgoogle.com/models/w8rORZlke/';

const loadingStatus = document.querySelector('.loadingStatus .loadingConitainer');
const uploadedImage = document.querySelector('#uploaded-image');

let model, labelContainer, maxPredictions;

async function init() {
    const modelURL = URL + 'model.json';
    const metadataURL = URL + 'metadata.json';


    
    // load the model and metadata
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // append elements to the DOM
    labelContainer = document.querySelector('#label-container .indecator');
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        labelContainer.appendChild(document.createElement('div')).innerHTML = '0%';
    }
}

// run the uploaded image through the image model
async function predict(imageElement) {
    const prediction = await model.predict(imageElement, false);
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ': ' + (prediction[i].probability*100).toFixed(2) + '%';
        
        labelContainer.querySelectorAll('div')[i].innerHTML = classPrediction;
        labelContainer.querySelectorAll('div')[i].style.width = `${prediction[i].probability.toFixed(2) * 100}%`;
        loadingStatus.style.display = 'none';
    }
}

document.getElementById('image-upload').addEventListener('change', function(event) {
    document.getElementById('file-name').textContent = this.files[0].name;;
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

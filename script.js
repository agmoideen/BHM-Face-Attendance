const video = document.getElementById('video');
const statusText = document.getElementById('status');
const attendanceList = document.getElementById('attendance-list');

let markedStudents = new Set(); // ഒരു ദിവസം ഒരു തവണ മാത്രം ഹാജർ രേഖപ്പെടുത്താൻ

async function loadModels() {
    statusText.innerText = "ആവശ്യമായ ഫയലുകൾ ഡൗൺലോഡ് ചെയ്യുന്നു...";
    
    // face-api.js-ന്റെ AI മോഡലുകൾ ലോഡ് ചെയ്യുന്നു
    await faceapi.nets.ssdMobilenetv1.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models');
    await faceapi.nets.faceLandmark6dNet.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models');
    
    statusText.innerText = "ക്യാമറ സ്റ്റാർട്ട് ചെയ്യുന്നു...";
    startVideo();
}

function startVideo() {
    navigator.mediaDevices.getUserMedia({ video: {} })
        .then(stream => {
            video.srcObject = stream;
            statusText.innerText = "മുഖം സ്കാൻ ചെയ്യാൻ തയ്യാറാണ്!";
        })
        .catch(err => {
            console.error("Camera Error: ", err);
            statusText.innerText = "ക്യാമറ ഓൺ ചെയ്യാൻ അനുവാദമില്ല!";
        });
}

video.addEventListener('play', () => {
    const canvas = document.getElementById('overlay');
    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);

    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors();
        
        if (detections.length > 0) {
            statusText.innerText = "മുഖം തിരിച്ചറിഞ്ഞു!";
            
            // ഇവിടെ കുട്ടികളുടെ ഡാറ്റാബേസുമായി മാച്ച് ചെയ്യുന്ന കോഡ് ചേർക്കാം
            // തൽക്കാലം ക്യാമറ വർക്ക് ചെയ്യുന്നുണ്ടെന്ന് ഉറപ്പാക്കാൻ ഡിറ്റക്ഷൻ കാണിക്കുന്നു
        } else {
            statusText.innerText = "കുട്ടിയുടെ മുഖം ക്യാമറയ്ക്ക് മുന്നിൽ കാണിക്കുക...";
        }
    }, 1000);
});

// മോഡലുകൾ ലോഡ് ചെയ്യാൻ ഫങ്ഷൻ വിളിക്കുന്നു
loadModels();

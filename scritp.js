const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureButton = document.getElementById('capture');
const downloadLink = document.getElementById('download');
const ctx = canvas.getContext('2d');
const logo = new Image();
logo.src = 'logo.png'; // Logo del evento

navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
  })
  .catch(err => {
    alert('Error al acceder a la cámara: ' + err);
  });

captureButton.addEventListener('click', () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0);

  // Insertar el logo encima
  logo.onload = () => {
    const size = video.videoWidth * 0.2;
    ctx.drawImage(logo, video.videoWidth - size - 10, 10, size, size);
    updateDownloadLink();
  };

  // Por si ya está cargado
  if (logo.complete) {
    const size = video.videoWidth * 0.2;
    ctx.drawImage(logo, video.videoWidth - size - 10, 10, size, size);
    updateDownloadLink();
  }
});

function updateDownloadLink() {
  downloadLink.href = canvas.toDataURL();
  downloadLink.style.display = 'inline-block';
}

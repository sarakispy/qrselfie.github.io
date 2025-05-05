const fileInput = document.getElementById("fileInput");
const previewContainer = document.getElementById("previewContainer");
const uploadBtn = document.getElementById("uploadBtn");
const loadingContainer = document.getElementById("loadingContainer");
const progressBar = document.getElementById("progressBar");

const GITHUB_USERNAME = "sarakispy";
const REPO_NAME = "fotos-15-a-os-1";
const BRANCH = "main";
const TOKEN = "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";

// Mostrar vista previa
fileInput.addEventListener("change", () => {
  previewContainer.innerHTML = "";
  const files = fileInput.files;
  if (!files.length) return;

  for (const file of files) {
    const reader = new FileReader();
    reader.onload = e => {
      const img = document.createElement("img");
      img.src = e.target.result;
      previewContainer.appendChild(img);
    };
    reader.readAsDataURL(file);
  }
});

// Convertir a base64
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}

// Subir imagen a GitHub
uploadBtn.addEventListener("click", async () => {
  const files = fileInput.files;
  if (!files.length) {
    alert("Seleccioná al menos una imagen.");
    return;
  }

  uploadBtn.disabled = true;
  uploadBtn.innerText = "Subiendo...";
  loadingContainer.style.display = "block";
  progressBar.style.width = "0%";

  let subidas = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fileName = `selfies/${Date.now()}-${file.name}`;
    try {
      const base64 = await toBase64(file);

      const res = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/${fileName}`, {
        method: "PUT",
        headers: {
          "Authorization": `token ${TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: `Subiendo selfie: ${file.name}`,
          content: base64,
          branch: BRANCH
        })
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("Error:", error.message);
        alert(`Error al subir ${file.name}: ${error.message}`);
      } else {
        subidas++;
      }

      progressBar.style.width = `${Math.round(((i + 1) / files.length) * 100)}%`;

    } catch (error) {
      console.error(error);
      alert(`Fallo al subir ${file.name}`);
    }
  }

  uploadBtn.disabled = false;
  uploadBtn.innerText = "Subir";
  loadingContainer.style.display = "none";
  fileInput.value = "";
  previewContainer.innerHTML = "";

  alert(`✅ Subidas exitosas: ${subidas}`);
});

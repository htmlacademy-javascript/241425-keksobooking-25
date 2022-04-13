const avatarLoadNode = document.querySelector('.ad-form__field [type="file"]');
const advertPhotoLoadNode = document.querySelector('.ad-form__upload [type=file]');
const avatarPreviewNode = document.querySelector('.ad-form-header__preview');
const advertPhotoPreviewNode = document.querySelector('.ad-form__photo');

const FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
function addShowingPreview(from, to, types) {
  if (!from || !to || !types || types.length === 0) {
    return;
  }
  from.addEventListener('change', () => {
    const file = from.files[0];

    const fileName = file.name.toLowerCase();

    const matches = types.some((type) => fileName.endsWith(type));

    if (matches) {
      let img = to.querySelector('img');
      if (!img) {
        img = document.createElement('img');
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'contain';
      }
      img.src = URL.createObjectURL(file);
      to.appendChild(img);
    }
  });
}

addShowingPreview(avatarLoadNode, avatarPreviewNode, FILE_TYPES);
addShowingPreview(advertPhotoLoadNode, advertPhotoPreviewNode, FILE_TYPES);

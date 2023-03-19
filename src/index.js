import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchImages } from './js/fetch-images.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
export let currentPage = 1;
export let currentSearchValue;

const formRef = document.querySelector('form#search-form');
const inputRef = document.querySelector('#search-form input');
const galleryRef = document.querySelector('.gallery');
const loadMorebutton = document.querySelector('.load-more');

let lightBox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

formRef.addEventListener('submit', onClick);
loadMorebutton.addEventListener('click', onLoadClick);

async function onClick(e) {
  e.preventDefault();
  galleryRef.innerHTML = ' ';
  currentPage = 1;
  loadMorebutton.classList.add('visually-hidden');
  currentSearchValue = e.target.elements.searchQuery.value;
  if (currentSearchValue === '') {
    Notify.failure('Error! Type something.');
    return;
  }
  const response = await fetchImages(currentSearchValue);
  if (!response) {
    Notify.failure('Server Error!');
  }
  const images = response.data.hits;
  const totalHits = response.data.totalHits;

  if (images.length === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  Notify.success(`Hooray! We found ${totalHits} images.`);
  galleryRef.innerHTML = createMarkup(images);
  if (totalHits > 36) {
    loadMorebutton.classList.remove('visually-hidden');
  }
  lightBox.refresh();
}

async function onLoadClick(e) {
  currentPage += 1;
  const searchValue = inputRef.textContent;
  const response = await fetchImages(currentSearchValue);
  if (!response) {
    Notify.failure('Server Error!');
  }
  const images = response.data.hits;
  const totalHits = response.data.totalHits;
  const markup = createMarkup(images);
  galleryRef.insertAdjacentHTML('beforeEnd', markup);
  if (totalHits < 36 * currentPage) {
    loadMorebutton.classList.add('visually-hidden');
    Notify.info("We're sorry, but you've reached the end of search results.");
  }
  lightBox.refresh();
}

function createMarkup(images) {
  return images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<a class = "image-thumb" href="${largeImageURL}">
  <div class="photo-card">
  <img class = "preview"src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item"><b>Likes:</b><br>${likes}</p>
    <p class="info-item"><b>Views:</b><br>${views}</p>
    <p class="info-item"><b>Comments:</b><br>${comments}</p>
    <p class="info-item"><b>Downloads:</b><br>${downloads}</p>
  </div>
</div>
</a>
`;
      }
    )
    .join(' ');
}

import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { currentPage, currentSearchValue } from '../index.js';
const KEY = '34477991-b3a261c7118a49b860526c778';

export const fetchImages = async searchValue => {
  try {
    const response = await axios.get(
      `https://pixabay.com/api/?key=${KEY}&q=${searchValue}&image_type=photo&orientation=horizontal&safesearch=true&per_page=36&page=${currentPage}`
    );
    if (response.ok) {
      Notify.failure('Error.More information in console');
      throw new Error(response.status);
    }
    return response;
  } catch (error) {
    console.log(error.message);
  }
};

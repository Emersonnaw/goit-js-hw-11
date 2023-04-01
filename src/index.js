
import './common/style.css';
import ImageServiceAPI from './components/imageService';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import axios from 'axios';
var lightbox = new SimpleLightbox('.thumb a', {captionsData:'alt',captionDelay:250});
var throttle = require('lodash.throttle');
 
const imagesApi = new ImageServiceAPI(); //import Class
let markupCards = '';
let oldvalue = ' ';
let allowDownloadMore = null; // flag on protect
const refs = {
  searchForm: document.querySelector('#search-form'), // link form
  gallery: document.querySelector('.gallery'),
//  buttonLoadMore: document.querySelector('.load-more'),
};





refs.searchForm.addEventListener('submit', handleSubmit); // catch value Submit

 async function handleSubmit(e) {
  e.preventDefault(); //cancel reload page
  // removeButtonLeadMore();
 const submitValue = e.currentTarget.elements.searchQuery.value;
  allowDownloadMore = false;
  if (!submitValue) {
    //protect against non-entered data
    Notiflix.Notify.failure('input Something please', {
      timeout: 6000,
    });
    return;
  }
  

  if (oldvalue === submitValue) {    //protect against the  same request
    
    Notiflix.Notify.info('Change the query value please', {
      timeout: 6000,
    });
    return;
  } else {
  oldvalue = submitValue;
  }

  imagesApi.resetPage(); //reset number of find page
  imagesApi.query = submitValue; //write value search
  dataWithServer();
  allowDownloadMore = true;

 

}

// refs.buttonLoadMore.addEventListener('click', onLoadMore);

// function onLoadMore(e) {
//   removeButtonLeadMore();
//   imagesApi.incrementPage();

//   showMoreCards();
//   ;
// }

;(() => {
  window.addEventListener('scroll', throttle(checkPosition,250))
  window.addEventListener('resize', throttle(checkPosition,250))
})()


async function checkPosition(){
  const height = document.body.offsetHeight; //height document
  const screenHeight = window.innerHeight; // height screen
 
  const scrolled = window.scrollY; //pixel scrolled 
 
  const threshold = height - screenHeight / 5;  // trigger point
   const position = scrolled + screenHeight; // watch whete the bottom of the screen
  if (position >= threshold && allowDownloadMore) { // event and action
    imagesApi.incrementPage();
    await showMoreCards();
   
  }
}


async function dataWithServer() {
  try {
    const objectFromServer = await imagesApi.fetchImage();
  
    if (!objectFromServer.hits.length) {
      refs.gallery.innerHTML = '';
      Notiflix.Notify.failure(
        // send non blocking alert
        'Sorry, there are no images matching your search query. Please try again.',
        {
          timeout: 6000,
        }
      );
      return;
    }
    showTotalHits(objectFromServer);
    galleryAbortContainer();
    imagesApi.resetPage();
    imagesApi.makeGalleryCard(objectFromServer.hits);
    markupCards = imagesApi.getReadyMarkup();
    refs.gallery.insertAdjacentHTML('beforeend', markupCards); // render cards
    lightbox.refresh();
    // addButtonLeadMore(); //show buttom More  
    
  } catch (error) {
    console.log(error);
  }
  
}

async function showMoreCards(){
  try {
    const moreCard = await imagesApi.fetchImage();
  // addButtonLeadMore();
  imagesApi.makeGalleryCard(moreCard.hits);
  markupCards = imagesApi.getReadyMarkup();
  refs.gallery.insertAdjacentHTML('beforeend', markupCards);
  lightbox.refresh();
  allContentLoaded(moreCard);
 
  // showTotalHits(moreCard);
  } catch (error) {
    console.log(error);
  }
  
}


// function protectEmptyInput(valSabmit) {
//   if (!valSabmit) {
//     //protect against non-entered data
//     Notiflix.Notify.failure('input Something please', {
//       timeout: 6000,
//     });
//     return;
//   }
  
// }

function galleryAbortContainer() {
  refs.gallery.innerHTML = '';
}

// function addButtonLeadMore() {
//   refs.buttonLoadMore.classList.remove('visually-hidden');
// }

// function removeButtonLeadMore() {
//   refs.buttonLoadMore.classList.add('visually-hidden');
// }

function allContentLoaded(allHits) {
  let cardCounter = document.querySelectorAll('.photo-card').length;
  if (cardCounter >= allHits.totalHits) {

    Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results.",
      {
        timeout: 6000,
      }
    );
    t
    // removeButtonLeadMore();
  }
}

function showTotalHits(hits) {
  Notiflix.Notify.success(`Hooray! We found ${hits.totalHits} images.`, {
    timeout: 6000,
  });
}

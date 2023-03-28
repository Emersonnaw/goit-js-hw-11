// infinite-scroll.com
import './common/style.css'
import  ImageServiceAPI from './components/imageService'
import Notiflix from 'notiflix';
const axios = require('axios').default;

const imagesApi = new ImageServiceAPI(); //import Class
let markupCards = '';
let oldvalue = '';
const refs = {
   searchForm: document.querySelector('#search-form'), // link form
   gallery: document.querySelector('.gallery'),
   buttonLoadMore: document.querySelector('.load-more'),
  
}


refs.searchForm.addEventListener('submit',handleSubmit); // catch value Submit

function handleSubmit(e){ 
   e.preventDefault(); //cancel reload page
   removeButtonLeadMore();
   if(!e.currentTarget.elements.searchQuery.value){ //protect against non-entered data
    Notiflix.Notify.failure(
      'input Something please',
      {
        timeout: 6000,
      },
    );
     return;
   }
   
   if (oldvalue === e.currentTarget.elements.searchQuery.value){ //protect against the  same request 
    Notiflix.Notify.info(
      'Change the query value please',
      {
        timeout: 6000,
      },
    );
     return;
   }else {
    oldvalue = e.currentTarget.elements.searchQuery.value;
   }
   
 imagesApi.query = e.currentTarget.elements.searchQuery.value; //write value search
 imagesApi.resetPage(); //reset number of find page

 imagesApi.fetchImage()
 .then(baseData => {
   if(!baseData.hits.length) {
    Notiflix.Notify.failure(          // send non blocking alert
    'Sorry, there are no images matching your search query. Please try again.',
      {
        timeout: 6000,
      },
    ); 
          return;
   }
     
galleryAbortContainer();
imagesApi.makeGalleryCard(baseData.hits);
markupCards = imagesApi.getReadyMarkup();
refs.gallery.insertAdjacentHTML("beforeend", markupCards); // render cards
addButtonLeadMore(); //show buttom More
 }).catch(error => console.log(error));
 }

refs.buttonLoadMore.addEventListener('click', onLoadMore);

function onLoadMore(e){
  removeButtonLeadMore();
  imagesApi.incrementPage();
  imagesApi.fetchImage()
 .then(baseData => {
  addButtonLeadMore();
  imagesApi.makeGalleryCard(baseData.hits);
 markupCards = imagesApi.getReadyMarkup();
refs.gallery.insertAdjacentHTML("beforeend", markupCards);
allContentLoaded(baseData);
}).catch(error => console.log(error));
}

function galleryAbortContainer(){
  refs.gallery.innerHTML = '';
}

function addButtonLeadMore() {
  refs.buttonLoadMore.classList.remove('visually-hidden');
}

function removeButtonLeadMore(){
  refs.buttonLoadMore.classList.add('visually-hidden');
}

function allContentLoaded(allHits){
  let cardCounter = document.querySelectorAll(".photo-card").length;
  if(cardCounter >= allHits.totalHits){
    Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results.",
      {
        timeout: 6000,
      },
    );
    removeButtonLeadMore();
  
  }
}
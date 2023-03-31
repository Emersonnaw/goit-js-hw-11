 import axios from "axios";
export default class ImageServiceAPI {
  constructor() {
    this.search_query = '';
     this.page = 2; // increment number of page need to put om then(data)
     this.markup =''; 
  }

  get query() {
    return this.search_query;
  }

  set query(newQuery) {
    this.search_query = newQuery; 
  }

  resetPage(){
     this.page = 1;
  }
  
  incrementPage(){
    this.page += 1;
  }
  
  getReadyMarkup(){
    return this.markup;
   }

 async fetchImage() {
    const BASE_URL = 'https://pixabay.com/api/';
    const key = '34586692-ed7cb8a238ccde585a263c879';
    const searchTypePhoto = '&image_type=photo';
    const searchOrientation = '&orientation="horizontal"';
    const ageFilter = '&safesearch="true"';
    const perPage ='&per_page=40';
    const page = `&page=${this.page}`;
 
   const object =  await axios.get(`${BASE_URL}?key=${key}&q=${this.search_query}${searchTypePhoto}${searchOrientation}${ageFilter}${perPage}${page}`);
   return object.data;
  }





 makeGalleryCard(renderObject){
   // {webformatURL,largeImageURL ,tags, likes, views, comments, downloads}
   return this.markup = renderObject.map(({webformatURL,largeImageURL ,tags, likes, views, comments, downloads}) => {
     return   `<div class="photo-card">  
     <div class="thumb"> 
      
          <a href="${largeImageURL}">
          <img class="img__card" src="${webformatURL}" alt="${tags}" loading="lazy" />
          </a>
     </div>                           
        <div class="info">
          <p class="info-item">
            <b>Likes</b>
            ${likes}
          </p>
          <p class="info-item">
            <b>Views</b>
            ${views}
          </p>
          <p class="info-item">
            <b>Comments</b>
            ${comments}
          </p>
          <p class="info-item">
            <b>Downloads</b>
            ${downloads}
          </p>
        </div>
      </div>`
   }).join('');
  }

 }

 
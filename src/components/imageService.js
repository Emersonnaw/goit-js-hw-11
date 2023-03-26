export default class ImageServiceAPI {
  constructor() {
    this.search_query = '';
     this.page = 1; // increment number of page need to put om then(data)
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

  fetchImage() {
    const BASE_URL = 'https://pixabay.com/api/';
    const searchTypePhoto = '&image_type=photo';
    const searchOrientation = '&orientation="horizontal"';
    const ageFilter = '&safesearch="true"';
    const key = '34586692-ed7cb8a238ccde585a263c879';

   return fetch(
      `${BASE_URL}?key=${key}&q=${this.search_query}${searchTypePhoto}${searchOrientation}${ageFilter}`
    )
      .then(resp => resp.json)
      .then(data => {
          // console.log(data);
           return data;
      }
        
        //this.page +=1 //increment number of page
      );
  }
}
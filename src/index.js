// infinite-scroll.com
import './common/style.css'
import  ImageServiceAPI from './components/imageService'
const imagesApi = new ImageServiceAPI(); //import Class

const refs = {
    searchForm: document.querySelector('#search-form'), // link form
}

refs.searchForm.addEventListener('submit',handleSubmit); // catch value Submit

function handleSubmit(e){ // event reac tion
    e.preventDefault(); //cancel reload pade

  imagesApi.query = e.currentTarget.elements.searchQuery.value; //write value
  imagesApi.resetPage();
  imagesApi.fetchImage().then(baseData => {console.log(baseData)});
}

// function onLoadMore(searchQuery){
// }
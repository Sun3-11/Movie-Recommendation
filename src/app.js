
//.ENV
// import dotenv from 'dotenv'
// dotenv.config()

// //
const searchForm = document.getElementById('search-form');
const searchInput = document.querySelector('input[type="search"]');
const suggestionsContainer = document.getElementById('suggestions-container');
const suggestionsList = document.getElementById('suggestions-list');
const recommendationsContainer = document.getElementById('recommendations-container');

//function for show info using omdbapi
async function getShows(query) {
  const apiKey = process.env.APIKEY;
  const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${query}&type=movie`);
  const data = await response.json();
  if (data && data.Search) {
   console.log(data)
    return data.Search;
  } else {
    return [];
  }
}

//function for show suggestions in suggestionsList
function showSuggestions(movies) {
  // Remove all previous items from suggestionsList
  while (suggestionsList.firstChild) {
    suggestionsList.removeChild(suggestionsList.firstChild);
  }

  // Create and add new items to suggestionsList
  movies.forEach(movie => {
    const suggestionItem = document.createElement('li');
    const imageSrc = movie.Poster === "N/A" ? 'https://via.placeholder.com/150' : movie.Poster;
    suggestionItem.classList.add('suggestion-item');
    suggestionItem.innerHTML = `
      <div class="suggestion-details">
        <img class="img-details" src="${imageSrc}" alt="${movie.Title}">
        <h3 class="title-details">${movie.Title}</h3>
      </div>
    `;
    suggestionItem.addEventListener('click', handleSuggestionClick);
    suggestionsList.appendChild(suggestionItem);
  });

  // Show suggestionsContainer
  if (movies.length > 0) {
    suggestionsContainer.style.display = 'block';
  } else {
    suggestionsContainer.style.display = 'none';
  }
}

// دالة للتعامل مع عمليات البحث
const handleSearch = async (event) => {
  // منع تحميل الصفحة بعد النقر على زر إرسال
  event.preventDefault();

  const searchValue = searchInput.value.trim().toLowerCase();
  if (!searchValue) {
    return;
  }

  // إخفاء suggestionsContainer
  suggestionsContainer.style.display = 'none';

  if (searchValue.length > 2) { // فحص طول النص المدخل
    // استعلام عن معلومات العروض باستخدام القيمة المدخلة
    const shows = await getShows(searchValue);

    makeImages(shows);
  } else {
    // استخراج الاقتراحات بهدف العرض للمستخدم
    const movies = await getShows(searchValue);

    showSuggestions(movies.slice(0, 5));
  }

};
//   if (shows.length === 0) {
//     const suggestions = await getShows('');
//     console.log(`Entered Movie name is not matching with any movie from the dataset . Please check the below suggestions :\n ${suggestions.map(s => s.Title).join('\n')}`);
//     return showSuggestions(suggestions);
//   }

//   makeImages(shows);
// };

// إضافة حدث input لمدخل البحث
searchInput.addEventListener('input', async () => {

  // استخراج قيمة مدخل البحث وتنظيفها
  const searchValue = searchInput.value.trim().toLowerCase();
  if (!searchValue) {
    return;
  }

  const movies = await getShows(searchValue);

  showSuggestions(movies.slice(0, 5));
});

// إنشاء دالة جديدة لمعالجة حدث النقر على الاقتراحات
const handleSuggestionClick = async (event) => {

  // إخفاء suggestionsContainer
  suggestionsContainer.style.display = 'none';

  // استخراج اسم العرض المحدد
  const title = event.currentTarget.querySelector('.suggestion-details h3').textContent;

// استعلام عن معلومات العروض باستخدام الاسم
  const shows = await getShows(title);

  // عرض التوصيات في recommendationsContainer
  makeImages([shows[0]]);
};

  // Remove all previous items from recommendationsContainer
function makeImages(movies) {
  while (recommendationsContainer.firstChild) {
    recommendationsContainer.removeChild(recommendationsContainer.firstChild);
  }

  // Show images for each show in recommendationsContainer
  movies.forEach(async (movie) => {
    const container = document.createElement('div');
    container.classList.add('show-container');

    const image = document.createElement('img');
    const imageSrc = movie.Poster === "N/A" ? 'https://via.placeholder.com/150' : movie.Poster;
    image.classList.add('recommendation-image');
    image.src = imageSrc;
    image.alt = movie.Title;
    container.appendChild(image);

    const details = document.createElement('div');
    details.classList.add('show-details');

    const title = document.createElement('h3');
    title.textContent = movie.Title;
    details.appendChild(title);

    const movieDetails = await getMovieDetails(movie.Title);
    if (movieDetails.Rated) {
      const rated = document.createElement('p');
      rated.textContent = `Rated: ${movieDetails.Rated}`;
      details.appendChild(rated);
    }
    if (movieDetails.imdbRating) {
      const rating = document.createElement('p');
      rating.textContent = `IMDB Rating: ${movieDetails.imdbRating}/10`;
      details.appendChild(rating);
    }
   if (movieDetails.imdbVotes) {
      const votes = document.createElement('p');
      votes.textContent = `IMDB Votes: ${movieDetails.imdbVotes}`;
      details.appendChild(votes);
    }
   if (movieDetails.Released) {
      const Released = document.createElement('p');
      Released.textContent = `IMDB Year: ${movieDetails.Released}`;
      details.appendChild(Released);
    }
    if (movieDetails.Genre) {
      const genres = document.createElement('p');
      genres.textContent = `Genres: ${movieDetails.Genre}`;
      details.appendChild(genres);
    }
    if (movieDetails.Plot) {
      const plot = document.createElement('p');
      plot.textContent = `Plot: ${movieDetails.Plot}`;
      details.appendChild(plot);
    }
    container.appendChild(details);

    recommendationsContainer.appendChild(container);
  });
}
async function getMovieDetails(title) {
  const apiKey = process.env.APIKEY;
  const response = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&t=${title}`);
  const data = await response.json();
  console.log(data)
  return data;
}

//Execute the search
searchForm.addEventListener('submit', handleSearch);

//.........................................................................

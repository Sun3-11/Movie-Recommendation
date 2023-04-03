
// // // //.ENV
// // // // import dotenv from 'dotenv'
// // // // dotenv.config()

const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');
const suggestionsContainer = document.querySelector('#suggestions-container');
const suggestionsList = document.querySelector('#suggestions-list');
const recommendationsContainer = document.querySelector('#recommendations-container');
const recommendButton =  document.getElementById("recommendButton")
const recommendationscontainer = document.querySelector('.slides-container')
const apiKey = process.env.APIKEY;//write your apiKey from https://www.omdbapi.com/


//function for show info using omdbapi
async function getShows(query) {
  //process.env.APIKEY;
  const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${query}&type=movie`);
  const data = await response.json();
//   if (data && data.Search) {
//    console.log(data)
     return data.Search;
//   } else {
//     return [];
//   }
}

// دالة للحصول على معلومات فيلم محدد من omdbapi
async function getMovieDetails(title) {
  const response = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&t=${title}`);
  const data = await response.json();
  console.log(data)
  return data;
}

// دالة للحصول على التوصيات بناءً على الفيلم المحدد
async function getRecommendations(movie) {
  const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&t=${movie.Title}`);
  const data = await response.json();
  // استخراج قائمة التوصيات
  const recommendations = data?.Ratings?.find(r => r.Source === 'Internet Movie Database')?.Value?.split('/')[0] >= 7 ? await getShows(data.Genre.split(',')[0].trim()) : [];
  return recommendations;
}
//................................................................


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


  // Remove all previous items from recommendationsContainer
function makeImagesReco(movies) {
  while (recommendationscontainer.firstChild) {
    recommendationscontainer.removeChild(recommendationscontainer.firstChild);
  }
 

  // Show images for each show in recommendationscontainer
  movies.forEach(async (movie) => {
    const container = document.createElement('div');
    container.classList.add('slide');

    const image = document.createElement('img');
    const imageSrc = movie.Poster === "N/A" ? 'https://via.placeholder.com/150' : movie.Poster;
    //image.classList.add('recommendation-image');
    image.src = imageSrc;
    image.alt = movie.Title;
    container.appendChild(image);

    const details = document.createElement('div');
    details.classList.add('caption');

    const title = document.createElement('h2');
    title.textContent = movie.Title;
    details.appendChild(title);

   // const movieDetails = await getMovieDetails(movie.Title);

    container.appendChild(details);

    recommendationscontainer.appendChild(container);

  });
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
    suggestionItem.addEventListener('click', handleSuggestionRecoClick);
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


// دالة لمعالجة حدث النقر على زر التوصية
const handleRecommendationClick = async () => {
  // استخراج قيمة البحث من مدخل البحث
  const searchValue = searchInput.value.trim().toLowerCase();
  if (!searchValue) {
    return;
  }
  // إخفاء suggestionsContainer
  suggestionsContainer.style.display = 'none';
  // استعلام عن معلومات الفيلم المدخل
  const movieDetails = await getMovieDetails(searchValue);
  // استعلام عن التوصيات بناءً على الفيلم المحدد
  const recommendations = await getRecommendations(movieDetails);
  // عرض التوصيات في recommendationscontainer
  console.log(`reco${recommendations}`)

  makeImagesReco(recommendations);
};


// دالة لمعالجة حدث النقر على عنصر الاقتراح
const handleSuggestionRecoClick = async (event) => {
  // استخراج اسم الفيلم من العنصر المنقر عليه
  const title = event.currentTarget.querySelector('.title-details').textContent;
  // إدخال اسم الفيلم في مدخل البحث
  searchInput.value = title;
  // إخفاء suggestionsContainer
  suggestionsContainer.style.display = 'none';
  // استعلام عن معلومات الفيلم المختار
  const movieDetails = await getMovieDetails(title);
  // استعلام عن التوصيات بناءً على الفيلم المحدد
  const recommendations = await getRecommendations(movieDetails);
  // عرض التوصيات في recommendationsContainer
  makeImagesReco(recommendations);
};



//Execute the search
searchForm.addEventListener('submit', handleSearch  );
//recommendButton.addEventListener('submit', handleRecommendationClick)


// معالج حدث النقر على أي مكان آخر في الصفحة
document.addEventListener('click', event => {
  const isClickInside = searchForm.contains(event.target) || suggestionsContainer.contains(event.target);
  if (!isClickInside) {
    suggestionsContainer.style.display = 'none';
  }
});


//...................


// Function to fetch similar movies from TMDb API
// Function to fetch movies from OMDB API
const fetchMovies = async (movieTitle) => {
  const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${movieTitle}`);
  const data = await response.json();
  return data.Search;
}

// Function to fetch movie details from OMDB API
const fetchMovieDetails = async (imdbId) => {
  const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${imdbId}`);
  const data = await response.json();
  return data;
}

// Apriori algorithm implementation
const minSupport = 2;

const aprioriGen = (freqSets) => {
  const candidates = [];
  for (let i = 0; i < freqSets.length; i++) {
    for (let j = i + 1; j < freqSets.length; j++) {
      const l1 = freqSets[i];
      const l2 = freqSets[j];
      if (l1.slice(0, -1).join(",") === l2.slice(0, -1).join(",")) {
        const candidate = [...new Set([...l1, ...l2])];
        candidates.push(candidate);
      }
    }
  }
  return candidates;
}

const apriori = (movieData, minSupport) => {
  const itemSet = new Map();
  for (const entry of movieData.flat()) {
    for (const item of entry) {
      itemSet.set(item, (itemSet.get(item) || 0) + 1);
    }
  }
  const freqSets = Array.from(itemSet)
    .filter(([k, v]) => v >= minSupport)
          .map(([k, v]) => [k]);
  if (!freqSets.length) { // <-- Add this condition
  return [];
  }
  let index = 1;
  while (freqSets[index - 1].length > 1) {
    const candidateSets = aprioriGen(freqSets);
    for (const entry of movieData.flat()) {
      for (const candidate of candidateSets) {
        if (candidate.every((val) => entry.includes(val))) {
          itemSet.set(candidate, (itemSet.get(candidate) || 0) + 1);
        }
      }
    }
    freqSets[index] = Array.from(itemSet)
      .filter(([k, v]) => v >= minSupport)
      .map(([k, v]) => k);
    index++;
  }
  return freqSets
}
// Get watched movies from user input and recommend similar movies
recommendButton.addEventListener("click", async function() {
  const searchInput = document.querySelector('#search-input').value.trim();
  if (!searchInput) {
    alert("Please enter at least one movie you have watched.");
    return;
  }
  const watchedMovies = searchInput.split(",").map((movieTitle) => movieTitle.trim());
  const movieData = [];
  for (let i = 0; i < watchedMovies.length; i++) {
    const movieTitle = watchedMovies[i];
    const movies = await fetchMovies(movieTitle);
    if (movies?.length) {
      const movieIds = movies.map((movie) => movie.imdbID);
      movieData.push(movieIds);
    }
  }
  if (!movieData.length) {
    alert("Could not find any matching movies.");
    return;
  }
  const freqSets = apriori(movieData, minSupport);
  const recommendedMovies = new Set();
  for (const freqSet of freqSets) {
    if (freqSet.length <= 1) continue;
    const lastMovieId = freqSet[freqSet.length - 1];
    const movieDetails = await fetchMovieDetails(lastMovieId);
    const genre = movieDetails?.Genre;
    if (genre) {
      const similarMovies = await fetchMoviesByGenre(genre);
      similarMovies.forEach((movie) => recommendedMovies.add(movie));
    }
  }
  const recommendedList = Array.from(recommendedMovies).slice(0, 10);
  renderRecommendedMovies(recommendedList);
  console.log(`reco${recommendedList}`)
});

// Function to fetch movies by genre from OMDB API
const fetchMoviesByGenre = async (genre) => {
  const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=&type=movie&plot=short&r=json&genre=${genre}`);
  const data = await response.json();
  return data.Search || [];
};

// Function to render recommended movies
const renderRecommendedMovies = (movies) => {
  const recommendedList = document.querySelector("#recommended-list");
  recommendedList.innerHTML = "";
    console.log(`recomended${movies}`)

  if (!movies.length) {
    const message = document.createElement("p");
    message.textContent = "No recommended movies found, Look at other recommendations :";
    recommendedList.appendChild(message);
    return;
  }
  for (const movie of movies) {
    const li = document.createElement("li");
    const title = movie.Title;
    const year = movie.Year;
    li.textContent = `${title} (${year})`;
    recommendedList.appendChild(li);
  }
};

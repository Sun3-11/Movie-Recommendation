//.ENV
import dotenv from 'dotenv'
dotenv.config()

//
const searchForm = document.getElementById('search-form');
const searchInput = document.querySelector('input[type="search"]');
const suggestionsContainer = document.getElementById('suggestions-container');
const suggestionsList = document.getElementById('suggestions-list');
const recommendationsContainer = document.getElementById('recommendations-container');

// دالة للاستعلام عن معلومات العروض باستخدام API
async function getShows(query) {
  const apiKey = process.env.APIKEY;
  const response = await fetch(`https://imdb-api.com/en/API/SearchMovie/${apiKey}/${query}`);
  const data = await response.json();
  console.log(data)
  return data.results;
}

// دالة لإظهار الاقتراحات في suggestionsList
function showSuggestions(shows) {
  // إزالة جميع العناصر السابقة من suggestionsList
  while (suggestionsList.firstChild) {
    suggestionsList.removeChild(suggestionsList.firstChild);
  }

  // إنشاء وإضافة العناصر الجديدة إلى suggestionsList
  shows.forEach(show => {
    const suggestionItem = document.createElement('li');
    suggestionItem.classList.add('suggestion-item');
    suggestionItem.innerHTML = `
      <div class="suggestion-details">
        <img class="img-details" src="${show.image}" alt="${show.title}">
        <h3 class="title-details">${show.title}</h3>
      </div>
    `;
    suggestionItem.addEventListener('click', handleSuggestionClick);
    suggestionsList.appendChild(suggestionItem);
  });

  // إظهار suggestionsContainer إذا كانت الأفكار غير فارغة ، وإلا فإنه يجب أن يتم إخفاؤه
  if (shows.length > 0) {
    suggestionsContainer.style.display = 'block';
  } else {
    suggestionsContainer.style.display = 'none';
  }
}

// دالة للتعامل مع عمليات البحث
const handleSearch = async (event) => {
  // منع تحميل الصفحة بعد النقر على زر إرسال
  event.preventDefault();

  // استخراج قيمة مدخل البحث وتنظيفها
  const searchValue = searchInput.value.trim().toLowerCase();
  if (!searchValue) {
    return;
  }

  // إخفاء suggestionsContainer
  suggestionsContainer.style.display = 'none';

  // استعلام عن معلومات العروض باستخدام القيمة المدخلة
  const shows = await getShows(searchValue);

  // عرض التوصيات في recommendationsContainer
  makeImages(shows);
};

// إضافة حدث input لمدخل البحث
searchInput.addEventListener('input', async () => {
  // استخراج قيمة مدخل البحث وتنظيفها
  const searchValue = searchInput.value.trim().toLowerCase();
  if (!searchValue) {
    return;
  }

  // استعلام عن معلومات العروض باستخدام القيمة المدخلة
  const shows = await getShows(searchValue);

  // عرض النتائج في suggestionsList
  showSuggestions(shows.slice(0, 5));
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


async function getMovieDetails(title) {
   const apiKey = process.env.KEY; // تغيير YOUR_API_KEY إلى مفتاح API الخاص بك
  const response = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&t=${title}`);
  const data = await response.json();
  console.log(data)
  return data;
}


// دالة لإنشاء عناصر HTML img وعرضها في recommendationsContainer
function makeImages(shows) {
  // إزالة جميع العناصر السابقة من recommendationsContainer
  while (recommendationsContainer.firstChild) {
    recommendationsContainer.removeChild(recommendationsContainer.firstChild);
  }

  // عرض الصور لكل عرض في recommendationsContainer
 shows.forEach(async (show) => {
    const container = document.createElement('div');
    container.classList.add('show-container');

    const image = document.createElement('img');
    image.classList.add('recommendation-image');
    image.src = show.image ? show.image : '';
    image.alt = show.title;
    container.appendChild(image);

    const details = document.createElement('div');
    details.classList.add('show-details');

    const title = document.createElement('h3');
    title.textContent = show.title;
    details.appendChild(title);

    const movieDetails = await getMovieDetails(show.title);
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

// إضافة حدث submit للنموذج للبحث عن عروض تلفزيونية
searchForm.addEventListener('submit', handleSearch);

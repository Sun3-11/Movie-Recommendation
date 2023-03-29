const searchForm = document.getElementById('search-form');
const searchInput = document.querySelector('input[type="search"]');
const suggestionsContainer = document.getElementById('suggestions-container');
const suggestionsList = document.getElementById('suggestions-list');
const recommendationsContainer = document.getElementById('recommendations-container');

// دالة للاستعلام عن معلومات العروض باستخدام API
async function getShows(query) {
  const response = await fetch(`https://api.tvmaze.com/search/shows?q=${query}`);
  const data = await response.json();
  return data.map(result => result.show);
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
        <h3>${show.name}</h3>
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
  const name = event.currentTarget.querySelector('.suggestion-details h3').textContent;

  // استعلام عن معلومات العروض باستخدام الاسم
  const shows = await getShows(name);

  // عرض التوصيات في recommendationsContainer
  makeImages(shows);
};

// دالة لإنشاء عناصر HTML img وعرضها في recommendationsContainer
function makeImages(shows) {
  // إزالة جميع العناصر السابقة من recommendationsContainer
  while (recommendationsContainer.firstChild) {
    recommendationsContainer.removeChild(recommendationsContainer.firstChild);
  }

  // عرض الصور لكل عرض في recommendationsContainer
  shows.forEach(show => {
    const container = document.createElement('div');
    container.classList.add('show-container');

    const image = document.createElement('img');
    image.classList.add('recommendation-image');
    image.src = show.image ? show.image.medium : '';
    container.appendChild(image);

    const details = document.createElement('div');
    details.classList.add('show-details');

    const name = document.createElement('h3');
    name.textContent = show.name;
    details.appendChild(name);

    if (show.premiered) {
      const premiered = document.createElement('p');
      premiered.textContent = `Premiered: ${show.premiered}`;
      details.appendChild(premiered);
    }

    if (show.rating && show.rating.average) {
      const rating = document.createElement('p');
      rating.textContent = `Rating: ${show.rating.average}/10`;
      details.appendChild(rating);
    }

    if (show.genres && show.genres.length > 0) {
      const genres = document.createElement('p');
      genres.textContent = `Genres: ${show.genres.join(', ')}`;
      details.appendChild(genres);
    }

    container.appendChild(details);

    recommendationsContainer.appendChild(container);
  });
}


// إضافة حدث submit للنموذج للبحث عن عروض تلفزيونية
searchForm.addEventListener('submit', handleSearch);

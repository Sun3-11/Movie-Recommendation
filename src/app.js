// const form = document.querySelector('#searchForm');
// form.addEventListener('submit', async (e) => {
//      e.preventDefault();
//     // console.log("SUBMITTED!")
//    // console.dir(form.elements.query.value)
//     const searTerm = form.elements.query.value;
//     const config = { params : { q: searTerm }}
//     const res = await axios.get(`https://api.tvmaze.com/search/shows`, config);
//    // console.log(res.data[0].show.image.medium);
//  console.log(res.data[0].show.rating.average)
//     makeImages(res.data)
//     makeName(res.data)
//     form.elements.query.value = '';
// })

//  const makeImages = (shows) =>{
//     for(let result of shows){
//         if(result.show.image ) {
//             console.log(result) 
//             const img = document.createElement('IMG');
//             img.src = result.show.image.medium;
//             document.body.append(img)
//         }
//     }

// }


// // 1- إنشاء دالة makeName وتمرير مصفوفة shows كمدخل
// const makeName = (shows) => {
//     // 2- استخدام حلقة for...of للتكرار على المصفوفة shows
//     for (let result of shows) {
//         // 3- التحقق من وجود قيمة result.show.rating.average قبل تعيينها داخل العنصر "div"
//         if (result.show.rating.average) {
//             // 4- إنشاء عنصر "div"
//             const nameM = document.createElement('p');
//             // 5- تعيين قيمة نصية داخل العنصر "div" باستخدام خاصية innerHTML
//             nameM.innerHTML = result.show.rating.average;
//             // 6- إضافة العنصر "div" إلى آخر عنصر في الصفحة body
//             document.body.append(nameM);
//             // 7- قياسيًا، يتم استخدام console.log() لطباعة القيمة في وحدة التحكم بالمتصفح
//             console.log(result);
//         }
//     }
// }

//الكود بعد التحسين 
// const makeImages = (shows) => {
//   for(let result of shows) {
//     if(result.show.image && result.show.name && result.show.rating.average && result.show.genres.length && result.show.premiered) {
//       const div = document.createElement('div');
//       div.classList.add('movie-container');

//       const img = document.createElement('img');
//       img.src = result.show.image.medium;
//       div.append(img);

//       const name = document.createElement('p');
//       name.innerHTML = "<strong>Name: </strong>" + result.show.name;
//       div.append(name);

//       const rating = document.createElement('p');
//       rating.innerHTML = "<strong>Rating: </strong>" + result.show.rating.average;
//       div.append(rating);

//       const genres = document.createElement('p');
//       genres.innerHTML = "<strong>Genres: </strong>" + result.show.genres.join(', ');
//       div.append(genres);

//       const premiered = document.createElement('p');
//       premiered.innerHTML = "<strong>Premiered: </strong>" + result.show.premiered;
//       div.append(premiered);

//       document.body.append(div);
//     }
//   }
// }

// const makeName = (shows) => {
//   for(let result of shows) {
//     if(result.show.rating.average && result.show.name) {
//       const nameM = document.createElement('p');
//       nameM.innerHTML = "<strong>" + result.show.name + ": </strong>" + result.show.rating.average;
//       document.body.append(nameM);
//     }
//   }
// }

// const form = document.querySelector('#searchForm');
// form.addEventListener('submit', async (e) => {
//   e.preventDefault();

//   const searchTerm = form.elements.query.value;
//   const config = { params : { q: searchTerm }}
//   const res = await axios.get(`https://api.tvmaze.com/search/shows`, config);

//   makeImages(res.data);
//   makeName(res.data);
  
//   form.elements.query.value = '';
// });

// الكود بعد التحسين 
const form = document.querySelector("#searchForm");
const input = form.elements.query;
let timeoutId;

const getShows = async (query) => {
  const response = await axios.get(`https://api.tvmaze.com/search/shows?q=${query}`);
  return response.data.map(result => result.show);
}

window.makeImages = (shows) => {
  for(let result of shows) {
    if(result.image && result.name && result.rating.average && result.genres.length && result.premiered) {
      const div = document.createElement("div");
      div.classList.add("movie-container");

      const img = document.createElement("img");
      img.src = result.image.medium;
      div.append(img);

      const name = document.createElement("p");
      name.innerHTML = "<strong>Name: </strong>" + result.name;
      div.append(name);

      const rating = document.createElement("p");
      rating.innerHTML = "<strong>Rating: </strong>" + result.rating.average;
      div.append(rating);

      const genres = document.createElement("p");
      genres.innerHTML = "<strong>Genres: </strong>" + result.genres.join(", ");
      div.append(genres);

      const premiered = document.createElement("p");
      premiered.innerHTML = "<strong>Premiered: </strong>" + result.premiered;
      div.append(premiered);

      document.body.append(div);
    }
  }
}

const getSuggestions = async (query) => {
  const shows = await getShows(query);
  return shows.map(show => ({
    name: show.name,
    image: show.image && show.image.medium,
    rating: show.rating && show.rating.average,
    genres: show.genres && show.genres.join(", "),
    premiered: show.premiered
  }));
}

// عرض قائمة الاقتراحات وعنوانها
const suggestionsContainer = document.createElement("div");
const suggestionsTitle = document.createElement("h2");
suggestionsTitle.textContent = "Suggestions:";
suggestionsContainer.append(suggestionsTitle);

// إنشاء قائمة لعرض الاقتراحات
const suggestionsList = document.createElement("ul");

const handleInput = async () => {
  const searchTerm = input.value;
  if (searchTerm.trim() === "") {
    // مسح القائمة عندما يكون حقل البحث خالياً
    suggestionsContainer.style.display = "none";
    while (suggestionsList.firstChild) {
      suggestionsList.removeChild(suggestionsList.firstChild);
    }
    return;
  }

  // الحصول على الاقتراحات وعرضها في القائمة
  const suggestions = await getSuggestions(searchTerm);
  while (suggestionsList.firstChild) {
    suggestionsList.removeChild(suggestionsList.firstChild);
  }
  for (let suggestion of suggestions) {
    const li = document.createElement("li");

    // إضافة الصورة إذا كانت متوفرة
    if (suggestion.image) {
      const img = document.createElement("img");
      img.src = suggestion.image;
      img.alt = suggestion.name;
      li.append(img);
    }

    // إضافة اسم العرض والتقييم والنوع والتاريخ
    const div = document.createElement("div");
    div.classList.add("suggestion-details");
    const name = document.createElement("p");
    name.innerHTML = "<strong>Name: </strong>" + suggestion.name;
    div.append(name);
    if (suggestion.rating) {
      const rating = document.createElement("p");
      rating.innerHTML = "<strong>Rating: </strong>" + suggestion.rating;
      div.append(rating);
    }
    if (suggestion.genres) {
      const genres = document.createElement("p");
      genres.innerHTML = "<strong>Genres: </strong>" + suggestion.genres;
      div.append(genres);
    }
    if (suggestion.premiered) {
      const premiered = document.createElement("p");
      premiered.innerHTML = "<strong>Premiered: </strong>" + suggestion.premiered;
      div.append(premiered);
    }
    li.append(div);

    suggestionsList.append(li);
  }

  // إضافة القائمة إلى الصفحة
  if (suggestions.length > 0) {
    suggestionsContainer.style.display = "block";
    suggestionsContainer.append(suggestionsList);
    document.body.append(suggestionsContainer);

} else {
suggestionsContainer.style.display = "none";
}
};

const handleSubmit = async (event) => {
event.preventDefault();
const searchTerm = input.value;
const shows = await getShows(searchTerm);

if (shows.length > 0) {
// إذا وجد العرض المطلوب بالضبط، يتم عرضه أولاً
const show = shows.find(show => show.name.toLowerCase() === searchTerm.toLowerCase());
if (show) {
window.makeImages([show]);
return;
}
}

// عرض قائمة الاقتراحات
const suggestions = await getSuggestions(searchTerm);

while (suggestionsList.firstChild) {
suggestionsList.removeChild(suggestionsList.firstChild);
}

for (let suggestion of suggestions) {
const li = document.createElement("li");

// إضافة الصورة إذا كانت متوفرة
if (suggestion.image) {
  const img = document.createElement("img");
  img.src = suggestion.image;
  img.alt = suggestion.name;
  li.append(img);
}

// إضافة اسم العرض والتقييم والنوع والتاريخ
const div = document.createElement("div");
div.classList.add("suggestion-details");
const name = document.createElement("p");
name.innerHTML = "<strong>Name: </strong>" + suggestion.name;
div.append(name);
if (suggestion.rating) {
  const rating = document.createElement("p");
  rating.innerHTML = "<strong>Rating: </strong>" + suggestion.rating;
  div.append(rating);
}
if (suggestion.genres) {
  const genres = document.createElement("p");
  genres.innerHTML = "<strong>Genres: </strong>" + suggestion.genres;
  div.append(genres);
}
if (suggestion.premiered) {
  const premiered = document.createElement("p");
  premiered.innerHTML = "<strong>Premiered: </strong>" + suggestion.premiered;
  div.append(premiered);
}
li.append(div);

suggestionsList.append(li);
}

// إضافة القائمة إلى الصفحة
if (suggestions.length > 0) {
suggestionsContainer.style.display = "block";
suggestionsContainer.append(suggestionsList);
document.body.append(suggestionsContainer);
} else {
suggestionsContainer.style.display = "none";
}
};

form.addEventListener("submit", handleSubmit);
input.addEventListener("input", () => {
clearTimeout(timeoutId);
timeoutId = setTimeout(handleInput, 500);
});
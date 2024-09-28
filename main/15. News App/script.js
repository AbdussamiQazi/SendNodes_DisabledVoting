const API_KEY = "1d3a0eefa97b499d8fbc4ee93eeb40b7";
const url = "https://newsapi.org/v2/everything?q=";

window.addEventListener("load", () => fetchNews("India"));

function reload() {
    window.location.reload();
}

async function fetchNews(query) {
    const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
    const data = await res.json();
    bindData(data.articles);
}

function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = "";

    articles.forEach((article) => {
        if (!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
    });

    newsSource.innerHTML = `${article.source.name} · ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

let curSelectedNav = null;
function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    navItem.classList.add("active");
}

// Search Functionality
const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value.trim();
    if (!query) return alert("Please enter a valid search term");
    fetchNews(query);
    searchText.value = "";
});

// Zoom functionality
let scale = 1;

document.getElementById('zoom-in').addEventListener('click', () => {
    scale += 0.1;
    document.body.style.transform = `scale(${scale})`;
    document.body.style.transformOrigin = 'top left'; // Maintain stability
});

document.getElementById('zoom-out').addEventListener('click', () => {
    if (scale > 1) {
        scale -= 0.1;
        document.body.style.transform = `scale(${scale})`;
        document.body.style.transformOrigin = 'top left'; // Maintain stability
    }
});

// Language Translation
const translations = {
    en: {
        ipl: "IPL",
        finance: "Finance",
        politics: "Politics",
        searchPlaceholder: "e.g. Science",
        searchButton: "Search",
    },
    mr: {
        ipl: "आयपीएल",
        finance: "आर्थिक",
        politics: "राजकारण",
        searchPlaceholder: "उदा. विज्ञान",
        searchButton: "शोधा",
    },
    hi: {
        ipl: "आईपीएल",
        finance: "वित्त",
        politics: "राजनीति",
        searchPlaceholder: "जैसे विज्ञान",
        searchButton: "खोजें",
    },
    gu: {
        ipl: "આઈપીએલ",
        finance: "વિત્ત",
        politics: "રાજકારણ",
        searchPlaceholder: "ઉદાહરણ તરીકે વિજ્ઞાન",
        searchButton: "શોધો",
    }
};

function setLanguage(lang) {
    const selectedLanguage = lang;
    document.getElementById("ipl").innerHTML = translations[selectedLanguage].ipl;
    document.getElementById("finance").innerHTML = translations[selectedLanguage].finance;
    document.getElementById("politics").innerHTML = translations[selectedLanguage].politics;
    document.getElementById("search-text").setAttribute("placeholder", translations[selectedLanguage].searchPlaceholder);
    document.getElementById("search-button").innerHTML = translations[selectedLanguage].searchButton;
}

// Event listener for default language (English)
window.addEventListener("load", () => {
    const defaultLanguage = 'en';
    switchLanguage(defaultLanguage);
});

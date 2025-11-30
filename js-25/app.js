import playList from "./playList.js";
console.log(playList);

const div = document.querySelector(".time-widget");
const quote = document.querySelector(".quote");
const author = document.querySelector(".author");
const data = document.querySelector(".date");
const greeting = document.querySelector(".greeting");
const nameInput = document.querySelector(".name");
const body = document.querySelector("body");
const prev = document.querySelector(".slide-prev");
const next = document.querySelector(".slide-next");
const weatherIcon = document.querySelector(".weather-icon");
const temperature = document.querySelector(".temperature");
const weatherDescription = document.querySelector(".weather-description");
const wind = document.querySelector(".wind");
const city = document.querySelector(".city");
const changeQuote = document.querySelector(".change-quote");
let isPlay = false;
let playNum = 0;
const playNext = document.querySelector(".play-next");
const playPrev = document.querySelector(".play-prev");
const playListContainer = document.querySelector(".play-list");
const playAu = document.querySelector(".play");

let time = document.createElement("p");
time.classList.add("time");
function upTime() {
  let now = new Date();
  time.textContent = now.toLocaleTimeString();
  div.append(time);
}

upTime();
setInterval(upTime, 1000);

let now = new Date();
let options = {
  month: "long",
  day: "numeric",
  weekday: "long",
};

let part = "";
if (now.getHours() >= 6 && now.getHours() < 12) {
  part = "morning";
} else if (now.getHours() >= 12 && now.getHours() < 18) {
  part = "afternoon";
} else if (now.getHours() >= 18 && now.getHours() < 24) {
  part = "evening";
} else {
  part = "night";
}

let dataP = document.createElement("p");
dataP.textContent = now.toLocaleString("ru-RU", options);
data.append(dataP);

const updateGreeting = () => {
  if (part === "morning") {
    greeting.textContent = "Доброе утро,";
  } else if (part === "afternoon") {
    greeting.textContent = "Добрый день,";
  } else if (part === "evening") {
    greeting.textContent = "Добрый вечер,";
  } else {
    greeting.textContent = "Доброй ночи,";
  }
};

setInterval(updateGreeting, 1000);
updateGreeting();

nameInput.addEventListener("input", () => {
  localStorage.setItem("name", nameInput.value);
  console.log(localStorage.getItem("name"));
});

const name = localStorage.getItem("name");
if (name) {
  nameInput.value = name;
}

function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
let num = getRandomInteger(1, 20);

const bodyImg = () => {
  const img = new Image();
  img.src = "";
  if (num > 9) {
    img.src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${part}/${num}.jpg`;
  } else {
    img.src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${part}/0${num}.jpg`;
  }

  img.onload = () => {
    body.style.backgroundImage = `url(${img.src})`;
  };

  console.log(num);
};
bodyImg();

prev.addEventListener("click", () => {
  num -= 1;
  if (num === 0) {
    num = 20;
  }
  bodyImg();
});

next.addEventListener("click", () => {
  num += 1;
  if (num === 21) {
    num = 1;
  }
  bodyImg();
});

city.addEventListener("change", () => {
  localStorage.city = city.value;
  getWeather();
});

const cityLoc = localStorage.getItem("city");
if (cityLoc) {
  city.value = cityLoc;
}
localStorage.setItem("name", nameInput.value);

async function getWeather() {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=ru&appid=08f2a575dda978b9c539199e54df03b0&units=metric`;
  // https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=ru&appid=9ed584102c0f73357bf1f9d972ed137e&units=metric
  const res = await fetch(url);
  const dataWeit = await res.json();
  weatherIcon.classList.add(`owf-${dataWeit.weather[0].id}`);
  temperature.textContent = `${dataWeit.main.temp}°C`;
  wind.textContent = `Скорость ветра ${dataWeit.wind.speed} м/с`;
  weatherDescription.textContent = dataWeit.weather[0].description;
}
getWeather();

const newQuotes = (arr) => {
  let ind = getRandomInteger(0, arr.length - 1);
  quote.innerHTML = "";
  author.innerHTML = "";
  let quoteText = document.createElement("p");
  quoteText.textContent = `"${arr[ind].text}"`;
  quote.append(quoteText);
  let authorText = document.createElement("p");
  authorText.textContent = arr[ind].author;
  author.append(authorText);
};

function getQuotes() {
  const quotes = "data.json";
  fetch(quotes)
    .then((res) => res.json())
    .then((data) => {
      newQuotes(data);
    });
}
getQuotes();

changeQuote.addEventListener("click", () => {
  getQuotes();
  newQuotes(data);
});

for (let i = 0; i < playList.length; i++) {
  let li = document.createElement("li");
  li.classList.add("play-item");
  li.textContent = playList[i].title;
  playListContainer.append(li);
}

const playNextFun = () => {
  playNum += 1;
  if (playNum === 4) {
    playNum = 0;
  }
  isPlay = false;
  playAudio();
};

const playPrevFun = () => {
  playNum -= 1;
  if (playNum === -1) {
    playNum = 3;
  }
  isPlay = false;
  playAudio();
};

playNext.addEventListener("click", () => {
  playNextFun();
  playAu.classList.add("pause");
});

playPrev.addEventListener("click", () => {
  playPrevFun();
  playAu.classList.add("pause");
});

const audio = new Audio();

function playAudio() {
  activMus();
  audio.src = `${playList[playNum].src}`;

  if (!isPlay) {
    audio.currentTime = 0;
    audio.play();
    isPlay = true;
  } else {
    audio.pause();
    isPlay = false;
  }
}

playAu.addEventListener("click", () => {
  playAudio();
  playAu.classList.toggle("pause");
});

const listItems = playListContainer.querySelectorAll("li");

const activMus = () => {
  listItems.forEach((item, index) => {
    if (index === playNum) {
      item.classList.toggle("item-active");
    } else {
      item.classList.remove("item-active");
    }
  });
};

const API_KEY = "e25122c64d186d93fb8be9ed160b1bd2";
let currentSound = null;

function searchWeather() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) return alert("Please enter a city name");

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
    .then((res) => {
      if (!res.ok) throw new Error("City not found");
      return res.json();
    })
    .then((data) => {
      updateUI(data);
    })
    .catch((err) => {
      alert(err.message);
    });
}

function updateUI(data) {
  const location = data.name;
  const temp = data.main.temp;
  const desc = data.weather[0].main;

  document.getElementById("weatherInfo").classList.remove("hidden");
  document.getElementById("location").textContent = location;
  document.getElementById("temperature").textContent = `${temp}°C`;
  document.getElementById("description").textContent = desc;

  applyTheme(desc);
  showCharacters(desc);

  // Make boxes transparent
document.querySelector(".weather-container").classList.add("transparent-bg");
document.getElementById("characterPopupLeft").classList.add("transparent-bg");
document.getElementById("characterPopupRight").classList.add("transparent-bg");

}

function applyTheme(desc) {
  const bgMap = {};

  const trackMap = {
    Clear: "assests/sounds/clear.mp3",
    Rain: "assests/sounds/rainy.mp3",
    Snow: "assests/sounds/snow.mp3",
    Clouds: "assests/sounds/clouds.mp3",
    Thunderstorm: "assests/sounds/storm.mp3"
  };

  // fallback background image
  document.body.style.backgroundImage = bgMap[desc] || bgMap["Clear"];

  // VIDEO HANDLING
  const video = document.getElementById("videoBg");
  if (video) {
    const videoSrcMap = {
      Clear: "assests/videos/clear.mp4",
      Rain: "assests/videos/rain.mp4",
      Snow: "assests/videos/snow.mp4",
      Clouds: "assests/videos/clouds.mp4",
      Thunderstorm: "assests/videos/storm.mp4"
    };

    const newVideoSrc = videoSrcMap[desc] || videoSrcMap["Clear"];
    const source = video.querySelector("source");

    if (!source.src.includes(newVideoSrc)) {
      source.src = newVideoSrc;
      video.load();
    }

    // Fade in the video
    video.style.display = "block";
    video.style.opacity = "0";
    video.oncanplay = () => {
      video.play();
      setTimeout(() => {
        video.style.transition = "opacity 1s ease-in-out";
        video.style.opacity = "1";
      }, 50);
    };
  }

  // SOUND HANDLING
  const newTrack = trackMap[desc] || trackMap["Clear"];

  if (currentSound) {
    currentSound.fade(0.5, 0, 1000);
    setTimeout(() => {
      currentSound.stop();
      currentSound.unload();

      currentSound = new Howl({
        src: [newTrack],
        loop: true,
        volume: 0,
        onload: function () {
          currentSound.play();
          currentSound.fade(0, 0.5, 1000);
        }
      });
    }, 1000);
  } else {
    currentSound = new Howl({
      src: [newTrack],
      loop: true,
      volume: 0,
      onload: function () {
        currentSound.play();
        currentSound.fade(0, 0.5, 1000);
      }
    });
  }
}



function showCharacters(desc) {
  const leftPopup = document.getElementById("characterPopupLeft");
  const rightPopup = document.getElementById("characterPopupRight");
   const leftImg = document.getElementById("characterImageLeft");
  const rightImg = document.getElementById("characterImageRight");

  const quotesLeft = {
    Clear: "A golden warmth, the world bathed in bright grace, Where laughter echoes, leaving not a trace.",
    Rain: "Soft whispers fall, a cleansing, gentle weep, As silver threads on thirsty earth now creep.",
    Snow: "A silent hush, the world in white array, Each crystal holds the beauty of today.",
    Clouds: "Gray veiled above, a softened, muted light,The world dreams softly, wrapped in gentle night.",
    Thunderstorm: "The sky rips open, a thunderous roar, While lightning paints the night, and winds implore."
  };

  const quotesRight = {
    Clear: "Beneath the blue, a vibrant, waking day, Where light and warmth chase every doubt away.",
    Rain: "The earth drinks deep, refreshed by nature's tears, As petrichor rises, calming all our fears.",
    Snow: "A gentle fall, a blanket soft and deep, While hushed landscapes in pure white beauty sleep.",
    Clouds: "A muted sky, where soft light gently gleams, And silent moments weave through waking dreams.",
    Thunderstorm: "The heavens rage, a furious, dark display, As nature's power holds absolute sway."
  };

  leftPopup.classList.remove("hidden");
  rightPopup.classList.remove("hidden");
  // Hide character images always
  leftImg.classList.add("hidden");
  rightImg.classList.add("hidden");
  

  document.getElementById("characterQuoteLeft").textContent =
    quotesLeft[desc] || "Enjoy the weather, whatever it is!";
  document.getElementById("characterQuoteRight").textContent =
    quotesRight[desc] || "Every day has its own charm!";
}

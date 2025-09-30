const detector = document.getElementById("detector");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const captchaPopup = document.getElementById("captchaPopup");
const captchaInput = document.getElementById("captchaInput");
const countdownEl = document.getElementById("countdown");
const captchaTimerEl = document.getElementById("captchaTimer");
const failPopup = document.getElementById("failPopup");
const successPopup = document.getElementById("successPopup");
const successReset = document.getElementById("successReset");

// Flip clock digits
const minTens = document.getElementById("minTens");
const minOnes = document.getElementById("minOnes");
const secTens = document.getElementById("secTens");
const secOnes = document.getElementById("secOnes");

let clicks = 0;
let moveInterval, timerInterval, failInterval;
let dx = 0.5, dy = 0.3;
let captchaText = "";
let captchaChars = [];
let triesLeft = 3;
let timeLeft = 60;

// -------- Random Map --------
function setRandomBackground() {
  const maps = [
    "https://d3uzjcc4cyf4cj.cloudfront.net/maps/lg/410007004.webp",
    "https://d3uzjcc4cyf4cj.cloudfront.net/maps/lg/410000740.webp",
    "https://d3uzjcc4cyf4cj.cloudfront.net/maps/lg/410013648.webp",
    "https://d3uzjcc4cyf4cj.cloudfront.net/maps/lg/410007052.webp"
  ];
  const randomMap = maps[Math.floor(Math.random() * maps.length)];
  document.body.style.background = `url(${randomMap}) no-repeat center center fixed`;
  document.body.style.backgroundSize = "cover";
}

// -------- Nút Bắt đầu --------
startBtn.addEventListener("click", () => {
  setRandomBackground();
  startBtn.style.display = "none";
  resetBtn.style.display = "none";
  captchaPopup.style.display = "none";
  failPopup.style.display = "none";
  successPopup.style.display = "none";
  clicks = 0;
  triesLeft = 3;
  timeLeft = 60;
  captchaInput.value = "";

  const maxX = window.innerWidth - 250;
  const maxY = window.innerHeight - 250;
  const randomX = Math.floor(Math.random() * maxX);
  const randomY = Math.floor(Math.random() * maxY);
  detector.style.left = randomX + "px";
  detector.style.top = randomY + "px";
  detector.style.display = "flex";

  setTimeout(() => detector.classList.add("show"), 50);

  startMoving(detector);
  startTimer();
});

// -------- Nút Làm lại --------
resetBtn.addEventListener("click", () => {
  setRandomBackground();
  startBtn.style.display = "block";
  resetBtn.style.display = "none";
  detector.style.display = "none";
  captchaPopup.style.display = "none";
  failPopup.style.display = "none";
  successPopup.style.display = "none";
  detector.classList.remove("show");
  clearInterval(moveInterval);
  clearInterval(timerInterval);
  clearInterval(failInterval);
  captchaInput.value = "";
});

// -------- Click Detector --------
detector.addEventListener("click", () => {
  clicks++;
  if (clicks < 3) {
    teleport(detector);
  } else {
    clearInterval(moveInterval);
    detector.style.display = "none";
    captchaPopup.style.display = "block";

    captchaPopup.style.left = (window.innerWidth / 2 - 130) + "px";
    captchaPopup.style.top = (window.innerHeight / 2 - 100) + "px";

    drawCaptcha();
    resetBtn.style.display = "block";
    makeDraggable(captchaPopup);

    // Tự focus vào input luôn
    captchaInput.focus();
  }
});

// ----------- Hàm phụ -----------

function startMoving(el) {
  let x = parseInt(el.style.left) || window.innerWidth / 2;
  let y = parseInt(el.style.top) || window.innerHeight / 2;
  dx = (Math.random() * 1.5 + 0.3) * (Math.random() < 0.5 ? 1 : -1);
  dy = (Math.random() * 1.5 + 0.3) * (Math.random() < 0.5 ? 1 : -1);

  clearInterval(moveInterval);
  moveInterval = setInterval(() => {
    x += dx;
    y += dy;
    if (x < 0 || x > window.innerWidth - 250) dx = -dx;
    if (y < 0 || y > window.innerHeight - 250) dy = -dy;
    el.style.left = x + "px";
    el.style.top = y + "px";
  }, 30);
}

function teleport(el) {
  el.style.display = "none";
  const maxX = window.innerWidth - 250;
  const maxY = window.innerHeight - 250;
  const randomX = Math.floor(Math.random() * maxX);
  const randomY = Math.floor(Math.random() * maxY);
  setTimeout(() => {
    el.style.left = randomX + "px";
    el.style.top = randomY + "px";
    el.style.display = "flex";
    startMoving(el);
  }, 200);
}

// ------ Captcha ------
function drawCaptcha() {
  const canvas = document.getElementById("captchaCanvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const chars = "가나다라마바사아자차카타파하허거너더러머버서어저처커터퍼히의횸췌쨩쩡쭝쀼"; // thêm chữ nhiều nét
  captchaText = "";
  captchaChars = [];

  const length = Math.floor(Math.random() * 4) + 4; // 4 ~ 7 ký tự
  for (let i = 0; i < length; i++) {
    captchaText += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  ctx.fillStyle = "#f4f4f4";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 150; i++) {
    ctx.fillStyle = randomColor();
    ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 1, 1);
  }
  for (let i = 0; i < 10; i++) {
    ctx.strokeStyle = randomColor();
    ctx.beginPath();
    ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
    ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
    ctx.stroke();
  }

  for (let i = 0; i < captchaText.length; i++) {
    const x = 25 + i * 40;
    const y = 40 + Math.random() * 10;
    const angle = (Math.random() - 0.5) * 0.8;
    const size = Math.floor(30 + Math.random() * 8);

    captchaChars.push({ char: captchaText[i], x, y, angle, size });

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.font = `bold ${size}px GungSuh, serif`;
    ctx.fillStyle = randomColor();
    ctx.fillText(captchaText[i], 0, 0);
    ctx.restore();
  }

  captchaInput.value = "";
  startOverlayEffect();
  captchaInput.focus();
}

function startOverlayEffect() {
  const overlay = document.getElementById("captchaOverlay");
  const octx = overlay.getContext("2d");
  let offsetX = -overlay.width;

  clearInterval(overlay.interval);
  overlay.interval = setInterval(() => {
    octx.clearRect(0, 0, overlay.width, overlay.height);

    captchaChars.forEach(info => {
      octx.save();
      octx.translate(info.x + offsetX, info.y);
      octx.rotate(info.angle);
      octx.font = `${info.size + 2}px GungSuh, serif`;
      octx.fillStyle = "rgba(0,0,0,0.4)";
      octx.fillText(info.char, 0, 0);
      octx.restore();
    });

    offsetX += 3;
    if (offsetX > overlay.width) offsetX = -overlay.width;
  }, 25);
}

function makeDraggable(el) {
  let isDown = false, offsetX = 0, offsetY = 0;
  el.addEventListener("mousedown", (e) => {
    isDown = true;
    offsetX = e.clientX - el.getBoundingClientRect().left;
    offsetY = e.clientY - el.getBoundingClientRect().top;
    el.style.cursor = "grabbing";
  });
  document.addEventListener("mouseup", () => {
    isDown = false;
    el.style.cursor = "grab";
  });
  document.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    el.style.left = (e.clientX - offsetX) + "px";
    el.style.top = (e.clientY - offsetY) + "px";
  });
}

// ------ Timer ------
function startTimer() {
  clearInterval(timerInterval);
  timeLeft = 60;
  countdownEl.innerText = timeLeft;
  captchaTimerEl.innerText = timeLeft;
  timerInterval = setInterval(() => {
    timeLeft--;
    countdownEl.innerText = timeLeft;
    captchaTimerEl.innerText = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      showFail();
    }
  }, 1000);
}

captchaInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") checkCaptcha();
});

function checkCaptcha() {
  const val = captchaInput.value.trim();
  if (val === captchaText) {
    clearInterval(timerInterval);
    captchaPopup.style.display = "none";
    successPopup.style.display = "block";
  } else {
    triesLeft--;
    if (triesLeft > 0) {
      captchaInput.value = "";
      drawCaptcha();
    } else {
      showFail();
    }
  }
}

function randomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// ------ Fail Popup ------
function showFail() {
  captchaPopup.style.display = "none";
  detector.style.display = "none";
  failPopup.style.display = "block";

  let failTime = 10;

  clearInterval(failInterval);
  failInterval = setInterval(() => {
    failTime--;

    const mins = String(Math.floor(failTime / 60)).padStart(2, "0");
    const secs = String(failTime % 60).padStart(2, "0");

    minTens.textContent = mins[0];
    minOnes.textContent = mins[1];
    secTens.textContent = secs[0];
    secOnes.textContent = secs[1];

    if (failTime <= 0) {
      clearInterval(failInterval);
      failPopup.style.display = "none";
      resetBtn.style.display = "block";
    }
  }, 1000);
}

// ------ Success Popup ------
successReset.addEventListener("click", () => {
  successPopup.style.display = "none";
  resetBtn.click();
});

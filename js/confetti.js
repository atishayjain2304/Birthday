(function() {
  //-----------Var Inits--------------
  canvas = document.getElementById("world");
  ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  cx = ctx.canvas.width/2;
  cy = ctx.canvas.height/2;

  let confetti = [];
  const confettiCount = 300;
  const gravity = 0.5;
  const terminalVelocity = 5;
  const drag = 0.075;
  const colors = [
    { front : 'red', back: 'darkred'},
    { front : 'green', back: 'darkgreen'},
    { front : 'blue', back: 'darkblue'},
    { front : 'yellow', back: 'darkyellow'},
    { front : 'orange', back: 'darkorange'},
    { front : 'pink', back: 'darkpink'},
    { front : 'purple', back: 'darkpurple'},
    { front : 'turquoise', back: 'darkturquoise'},
  ];

//-----------Functions--------------
  resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    cx = ctx.canvas.width/2;
    cy = ctx.canvas.height/2;
  }

  getTimeRemaining = (endtime) => {
    const total = Date.parse(endtime) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));

    return {
      total,
      days,
      hours,
      minutes,
      seconds
    };
  }

   initializeClock = (id, endtime) => {
    const clock = document.getElementById(id);
    const daysSpan = clock.querySelector('.days');
    const hoursSpan = clock.querySelector('.hours');
    const minutesSpan = clock.querySelector('.minutes');
    const secondsSpan = clock.querySelector('.seconds');

    function updateClock() {
      const t = getTimeRemaining(endtime);

      daysSpan.innerHTML = t.days;
      hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
      minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
      secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

      if (t.total <= 0) {
        clearInterval(timeinterval);
      }
    }

    updateClock();
    const timeinterval = setInterval(updateClock, 1000);
  }

  initializeClock('clockdiv', 'APRIL 23 2021 11:30:00 GMT+0530');

  randomRange = (min, max) => Math.random() * (max - min) + min

  initConfetti = () => {
    for (let i = 0; i < confettiCount; i++) {
      confetti.push({
        color      : colors[Math.floor(randomRange(0, colors.length))],
        dimensions : {
          x: randomRange(10, 20),
          y: randomRange(10, 30),
        },
        position   : {
          x: randomRange(0, canvas.width),
          y: canvas.height - 1,
        },
        rotation   : randomRange(0, 2 * Math.PI),
        scale      : {
          x: 1,
          y: 1,
        },
        velocity   : {
          x: randomRange(-25, 25),
          y: randomRange(0, -50),
        },
      });
    }
  }

//---------Render-----------
  render = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confetti.forEach((confetto, index) => {
      let width = (confetto.dimensions.x * confetto.scale.x);
      let height = (confetto.dimensions.y * confetto.scale.y);

      // Move canvas to position and rotate
      ctx.translate(confetto.position.x, confetto.position.y);
      ctx.rotate(confetto.rotation);

      // Apply forces to velocity
      confetto.velocity.x -= confetto.velocity.x * drag;
      confetto.velocity.y = Math.min(confetto.velocity.y + gravity, terminalVelocity);
      confetto.velocity.x += Math.random() > 0.5 ? Math.random() : -Math.random();

      // Set position
      confetto.position.x += confetto.velocity.x;
      confetto.position.y += confetto.velocity.y;

      // Delete confetti when out of frame
      if (confetto.position.y >= canvas.height) confetti.splice(index, 1);

      // Loop confetto x position
      if (confetto.position.x > canvas.width) confetto.position.x = 0;
      if (confetto.position.x < 0) confetto.position.x = canvas.width;

      // Spin confetto by scaling y
      confetto.scale.y = Math.cos(confetto.position.y * 0.1);
      ctx.fillStyle = confetto.scale.y > 0 ? confetto.color.front : confetto.color.back;

      // Draw confetto
      ctx.fillRect(-width / 2, -height / 2, width, height);

      // Reset transform matrix
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    });

    // Fire off another round of confetti
    if (confetti.length <= 10) initConfetti();

    window.requestAnimationFrame(render);
  }

//---------Execution--------
  initConfetti();
  render();

  console.log('nikhil');
  let audio = document.createElement("AUDIO")
  document.body.appendChild(audio);
  audio.src = "chiku.mp3"

  window.addEventListener("click", function () {
      audio.play()
  })
  const body = document.body;
  body.click();
  body.dispatchEvent(new Event('click'));

//----------Resize----------
  window.addEventListener('resize', function () {
    resizeCanvas();
  });

//------------Click------------
  window.addEventListener('click', function() {
    initConfetti();
  });

}).call(this);
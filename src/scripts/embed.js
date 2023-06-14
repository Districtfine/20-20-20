const embedDiv = document.getElementById("20-20-20-timer-embed");

function createEmbedElements() {
  let content = `
    <audio>
        <source src="media/alarm.mp3">
        <source src="media/ogg.mp3">
    </audio>
    <header>
        <h2>
            <u>20-20-20 Interval Timer</u>
        </h2>
        <div id="time-selector">
            Every
            <input type="number" id="working_timeVal" name="working_timeVal" value="20" max="120" />
            <select id="working_timeUnit" name="working_timeUnit">
                <option value="minutes">minutes</option>
                <option value="seconds">seconds</option>
            </select>

            <p>look 20 feet away from your screen for</p>

            <input type="number" id="resting_timeVal" name="resting_timeVal" value="20" max="120" />
            <select id="resting_timeUnit" name="resting_timeUnit">
                <option value="seconds">seconds</option>
                <option value="minutes">minutes</option>
            </select>
            <br>
            <button id="start">
            Start
            </button>
        </div>

        <div id="base-timer" hidden>
            <svg class="svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <g class="circle">
                <circle class="path-elapsed" cx="50" cy="50" r="45" />
                <path id="path-remaining" stroke-dasharray="283" d="
                    M 50,50
                    m -45,0
                    a 45,45 0 1,0 90,0
                    a 45,45 0 1,0 -90,0
                "></path>
            </g>
            </svg>
            <span class="inside-timer">
                <var id="current-interval"></var>
                <var id="time-left-display"></var>
                <span class="timer-controls">
                    <button class="stopBtn">
                    <i class="material-icons">stop</i>
                    </button>
                    <button class="pauseBtn">
                    <i class="material-icons">pause</i>
                    </button>
                    <button class="skipBtn">
                    <i class="material-icons">skip_next</i>
                    </button>
                </span>
            </span>
        </div>
    </header>
    <style>
    #start,
    h2,
    header,
    input,
    main,
    select {
        font-family: Montserrat, sans-serif;
    }
    #first-para,
    body {
        margin: 0;
    }
    .inside-timer,
    .timer-controls {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
    }
    #start,
    input,
    select {
        box-sizing: border-box;
    }
    #time-selector {
        font-size: 1.2rem;
        color: #fff;
    }
    h2 {
        color: #fff;
        font-size: 2rem;
    }
    body {
        padding: 0;
    }
    input {
        width: 70px;
    }
    input,
    select {
        font-size: 1rem;
    }
    #start {
        height: auto;
        width: auto;
        margin-top: 20px;
    }
    #base-timer,
    .inside-timer {
        width: var(--timer-width);
        height: var(--timer-height);
    }
    header {
        text-align: center;
        padding-top: 1em;
        padding-bottom: 1em;
        background-color: #172a3a;
    }
    main {
        text-align: left;
        font-size: 1.1rem;
        background-color: #fff;
        padding: 1rem;
    }
    main p {
        color: #000;
    }
    @media (min-width: 1100px) {
        main {
        margin: 0 21% auto;
        }
    }
    :root {
        --path-time-color: #09bc8a;
        --timer-height: 500px;
        --timer-width: 500px;
    }
    @media (max-width: 500px) {
        :root {
        --timer-height: 100vw;
        --timer-width: 100vw;
        }
    }
    #base-timer {
        position: relative;
        margin: auto;
        font-family: "Courier Prime", monospace;
        color: #fff;
    }
    #base-timer .circle {
        fill: none;
        stroke: none;
    }
    #base-timer .path-elapsed {
        stroke-width: 5px;
        stroke: white;
    }
    .inside-timer {
        position: absolute;
        top: 0;
        grid-template-rows: 1fr 1fr 1fr;
    }
    #current-interval {
        grid-column: 2/3;
        font-size: 35px;
        text-align: center;
        margin: 40% auto auto;
    }
    #time-left-display {
        font-size: 48px;
        grid-column: 2/3;
        margin: auto;
    }
    .timer-controls {
        grid-column: 2/3;
    }
    #path-remaining {
        stroke-width: 5px;
        stroke-linecap: round;
        transform: rotate(90deg);
        transform-origin: center;
        transition: 0.5s linear;
        stroke: currentColor;
        color: var(--path-time-color);
    }
    .timer-controls button {
        box-sizing: border-box;
        margin: 0 auto;
        padding: 1px;
        border: 2px solid #fff;
        border-radius: 20%;
        width: 40px;
        height: 40px;
        background: #172a3a;
        color: #fff;
        cursor: pointer;
        transition: background 250ms ease-in-out, transform 150ms;
        -webkit-appearance: none;
        -moz-appearance: none;
    }
    @media (min-width: 500px) {
        .timer-controls button {
        margin: 40% auto auto;
        }
    }
    .timer-controls button::-moz-focus-inner {
        border: none;
    }
    .timer-controls button:hover {
        background: #0053ba;
    }
    svg {
        transform: scaleX(-1);
    }
    </style>
`;

  embedDiv.innerHTML = content;
}

function loadExternalScript(link) {
  const scriptElement = document.createElement("script");
  document.head.appendChild(scriptElement);
  scriptElement.type = "text/javascript";
  scriptElement.async = false;
  return new Promise((resolve, reject) => {
    scriptElement.onload = resolve;
    scriptElement.onerror = reject;
    scriptElement.src = link;
  });
}

function loadExternalStylesheet(link) {
  document
    .getElementsByTagName("head")[0]
    .insertAdjacentHTML(
      "beforeend",
      `<link rel="stylesheet" href="${link}" />`
    );
}

loadExternalStylesheet("https://fonts.googleapis.com/icon?family=Material+Icons");
createEmbedElements();

loadExternalScript("https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js")
  .then(loadExternalScript("https://cdnjs.cloudflare.com/ajax/libs/countdown/2.6.0/countdown.min.js"))
  .then(loadExternalScript("https://districtfine.github.io/20-20-20/dist/moment-countdown.min.js"))
  .then(loadExternalScript("https://districtfine.github.io/20-20-20/dist/index.js"));
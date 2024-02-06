function toggleSubMenu(submenuId, arrowId) {
  var submenu = document.getElementById(submenuId);
  var arrow = document.getElementById(arrowId);

  var allSubmenus = document.querySelectorAll(".submenu");
  allSubmenus.forEach(function (item) {
    if (item.id !== submenuId && item.classList.contains("submenu-visible")) {
      item.classList.remove("submenu-visible");

      document
        .getElementById("arrow-" + item.id.split("-")[1])
        .classList.remove("arrow-up");
    }
  });

  if (submenu.classList.contains("submenu-visible")) {
    submenu.classList.remove("submenu-visible");
    arrow.classList.remove("arrow-up");
  } else {
    submenu.classList.add("submenu-visible");
    arrow.classList.add("arrow-up");
  }
}

let timeoutId;

function handleInput() {
  clearTimeout(timeoutId);

  const searchInput = document.getElementById("search-input");
  const loadingDiv = document.getElementById("text");
  const loadingIcon = document.getElementById("loading-icon");
  const query = searchInput.value;

  if (query.length >= 1) {
    loadingDiv.classList.add("show-text");
    loadingIcon.style.display = "inline";
    timeoutId = setTimeout(search, 500);
  } else {
    const searchResults = document.getElementById("search-results");
    searchResults.style.display = "none";
    loadingDiv.classList.remove("show-text");
    loadingIcon.style.display = "none";
  }
}

async function search() {
  const searchInput = document.getElementById("search-input");
  const searchResults = document.getElementById("search-results");
  const loadingIcon = document.getElementById("loading-icon");

  const query = searchInput.value;
  if (!query) {
    searchResults.style.display = "none";
    return;
  }

  try {
    searchResults.style.display = "none";
    loadingIcon.style.display = "inline";

    const apiUrl = `https://dummyjson.com/products/search?q=${query}&limit=5&delay=1000`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    displayResults(data);
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    loadingIcon.style.display = "none";
  }
}

function displayResults(data) {
  const searchResults = document.getElementById("search-results");
  searchResults.innerHTML = "";

  if (data && data.products && data.products.length > 0) {
    const resultItems = document.createElement("div");
    resultItems.classList.add("results");

    data.products.forEach((item) => {
      const resultItem = document.createElement("div");
      resultItem.classList.add("item");

      resultItem.innerHTML = `
        <p class="name">${item.title}</p>
        <p class="price">$${item.price.toFixed(2)}</p>
      `;

      resultItems.appendChild(resultItem);
    });

    searchResults.innerHTML = "";
    searchResults.appendChild(resultItems);
    searchResults.style.display = "block";
  } else {
    searchResults.innerHTML = "Brak wyników";
    searchResults.style.display = "block";
  }
}

const searchInput = document.getElementById("search-input");
searchInput.addEventListener("input", handleInput);

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const CUSTOM_COMMANDS = {
  hello: {
    msg: "Hello :)",
  },
};

const terminal = document.getElementById("my-terminal");
const commandInput = document.getElementById("commandInput");
const commandHistory = [];
let commandIndex = 0;

function appendToTerminal(content, className = "") {
  const output = document.createElement("div");
  output.textContent = content;
  output.className = className;
  terminal.appendChild(output);
  terminal.scrollTop = terminal.scrollHeight;
}

function executeCommand(command) {
  if (command.trim() === "") return;

  commandHistory.push(command);
  commandIndex = commandHistory.length;

  appendToTerminal("you: " + command, "command-history");

  const args = command.split(" ");
  const baseCommand = args[0].toLowerCase();

  setTimeout(() => {
    if (CUSTOM_COMMANDS.hasOwnProperty(baseCommand)) {
      appendToTerminal("terminal: " + CUSTOM_COMMANDS[baseCommand].msg);
    } else {
      switch (baseCommand) {
        case "clear":
          terminal.innerHTML = "";
          break;
        case "help":
          const availableCommands = getAvailableCommands();
          appendToTerminal(
            "terminal: Available Commands: " + availableCommands.join(", ")
          );
          break;
        case "quote":
          fetch("https://dummyjson.com/quotes/random")
            .then((response) => response.json())
            .then((data) => appendToTerminal("terminal: " + data.quote));
          break;
        case "double":
          const number = parseFloat(args[1]);
          if (!isNaN(number)) {
            appendToTerminal(`terminal: Result: ${number * 2}`);
          } else {
            appendToTerminal("terminal: Invalid number for doubling.");
          }
          break;
        default:
          appendToTerminal("terminal: Unknown command: " + command);
          break;
      }
    }
  }, 500);
}

function displayCommandHint() {
  const availableCommands = getAvailableCommands();
  const currentInput = commandInput.value.toLowerCase();
  const matchingCommands = availableCommands.filter((command) =>
    command.startsWith(currentInput)
  );

  const hint =
    matchingCommands.length > 0
      ? matchingCommands.join(" | ")
      : "No matching commands";

  const commandHint = document.getElementById("commandHint");
  commandHint.textContent = hint;
  commandHint.style.display = "block";
}

function getAvailableCommands() {
  return ["clear", "help", "quote", "double", ...Object.keys(CUSTOM_COMMANDS)];
}

commandInput.addEventListener("input", function (e) {
  terminal.innerHTML = "";
  displayCommandHint();
});

commandInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    const command = this.value;
    executeCommand(command);
    this.value = "";
  } else if (e.key === "ArrowUp") {
    if (commandIndex > 0) {
      commandIndex--;
      this.value = commandHistory[commandIndex];
    }
  } else if (e.key === "ArrowDown") {
    if (commandIndex < commandHistory.length - 1) {
      commandIndex++;
      this.value = commandHistory[commandIndex];
    } else {
      this.value = "";
      commandIndex = commandHistory.length;
    }
  } else if (e.key === "Tab") {
    e.preventDefault();
    displayCommandHint();
  }
});

commandInput.focus();

const lastLoginText = document.getElementById("lastLoginText");

function updateLastLogin() {
  const currentDate = new Date();
  const day = currentDate.getUTCDay();
  const month = months[currentDate.getUTCMonth()];
  const year = currentDate.getUTCFullYear();
  const hours = currentDate.getUTCHours().toString().padStart(2, "0");
  const minutes = currentDate.getUTCMinutes().toString().padStart(2, "0");
  const seconds = currentDate.getUTCSeconds().toString().padStart(2, "0");

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const lastLoginText = document.getElementById("lastLoginText");
  lastLoginText.textContent = `Last login: ${
    days[day]
  }, ${currentDate.getUTCDate()} ${month} ${year} ${hours}:${minutes}:${seconds} GMT`;
}

updateLastLogin();

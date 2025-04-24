// Get the elements from the DOM
const form = document.getElementById("pokemonForm");
const generateButton = document.getElementById("generateButton");
const input = document.getElementById("cardCount");
const pokemonCategory = document.getElementById("type");

// Event listener for the button click to generate Pokémon cards
generateButton.addEventListener("click", (event) => {
  event.preventDefault(); // Prevent default form submission behavior
  getPokemonDataFromAPI(); // Fetch Pokémon data based on user input
});

// Fetching Pokémon data from the API based on selected Pokémon type
async function getPokemonDataFromAPI() {
  const url = `https://pokeapi.co/api/v2/type/${pokemonCategory.value}`; // URL based on selected type
  try {
    // Fetch data from the PokeAPI
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response Status:${response.status}`); // Handle non-OK response
    }
    const json = await response.json();
    const pokemonsArray = json.pokemon; // Extract Pokémon data from API response
    const pokemonsNamesArray = [];

    // Loop through the array to get only the Pokémon names
    pokemonsArray.forEach((pokemon) => {
      pokemonsNamesArray.push(pokemon.pokemon.name);
    });

    // Shuffle the Pokémon names array based on the user input size
    const shuffledPokemonArray = shufflingArray(pokemonsNamesArray, input);
    // remove previous cards
    const cardContainer = document.querySelector(".main-container");
    const existingCards = cardContainer.querySelectorAll(".card");
    existingCards.forEach((card) => card.remove());

    // Render the shuffled Pokémon cards
    renderFunction(shuffledPokemonArray);
  } catch (error) {
    throw new Error(error.message); // Handle errors in fetching data
  }
}

// Shuffle the Pokémon names array and slice it based on the user's input
function shufflingArray(pokemonsNamesArray, input) {
  let n = pokemonsNamesArray.length;

  // Shuffle the array using Fisher-Yates algorithm
  for (let i = n - 1; i > 0; i--) {
    let randomIndex = Math.floor(Math.random() * (i + 1));
    [pokemonsNamesArray[i], pokemonsNamesArray[randomIndex]] = [
      pokemonsNamesArray[randomIndex],
      pokemonsNamesArray[i],
    ];
  }

  // Slice the shuffled array to return the number of Pokémon cards requested by the user
  const shuffledPokemonArray = pokemonsNamesArray.slice(0, input.value);
  return shuffledPokemonArray;
}

// Render the shuffled Pokémon array into the DOM by generating HTML for each Pokémon card
function renderFunction(shuffledPokemonArray) {
  shuffledPokemonArray.forEach((individualPokemon) => {
    async function detailsOfPokemon() {
      const singlePokemonData = `https://pokeapi.co/api/v2/pokemon/${individualPokemon}`; // Fetch detailed data for the individual Pokémon
      try {
        const response = await fetch(singlePokemonData);
        if (!response.ok) {
          throw new Error(`Response Status:${response.status}`); // Handle non-OK response
        }
        const individualPokemonData = await response.json(); // Get the detailed Pokémon data

        // Extract specific stats (HP, Attack, Defense, Speed) from the Pokémon data
        const hp = individualPokemonData.stats.find(
          (stat) => stat.stat.name === "hp"
        ).base_stat;
        const attack = individualPokemonData.stats.find(
          (stat) => stat.stat.name === "attack"
        ).base_stat;
        const defense = individualPokemonData.stats.find(
          (stat) => stat.stat.name === "defense"
        ).base_stat;
        const speed = individualPokemonData.stats.find(
          (stat) => stat.stat.name === "speed"
        ).base_stat;

        const type = pokemonCategory.value.toLowerCase(); // Ensure type is lowercase for class names

        // Create the HTML structure for a Pokémon card
        const cardContainer = document.createElement("div");
        cardContainer.className = "card"; // Add card class
        cardContainer.innerHTML = `
          <div class="card-top type-${type}">
            <span class="hp">HP ${hp}</span>
            <img
              src="${individualPokemonData.sprites.front_default}" 
              alt="${individualPokemon}" 
              class="pokemon-img"
            />
          </div>
          <h2 class="name">${individualPokemon}</h2>
          <span class="type-badge type-${type}">${pokemonCategory.value}</span>
          <div class="stats">
            <div>
              <h3>${attack}</h3>
              <p>Attack</p>
            </div>
            <div>
              <h3>${defense}</h3>
              <p>Defense</p>
            </div>
            <div>
              <h3>${speed}</h3>
              <p>Speed</p>
            </div>
          </div>`;

        // Append the generated card to the main container
        document.querySelector(".main-container").appendChild(cardContainer);
      } catch (error) {
        console.log(error.message); // Handle errors when fetching Pokémon details
      }
    }
    detailsOfPokemon(); // Call the function to get individual Pokémon details
  });
}

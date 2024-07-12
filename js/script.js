// Código JavaScript aqui

const state = {
    currentNumbers: [],
    selectedTeam: '',
    savedGames: [],
    numbers: []
  };
  
  function start() {
    readLocalStorage();
    createNumbers();
    render();
  }
  
  function readLocalStorage() {
    if (!window.localStorage) {
      return;
    }
  
    const savedGames = window.localStorage.getItem('saved-games');
  
    if (savedGames) {
      state.savedGames = JSON.parse(savedGames);
    }
  }
  
  function writeLocalStorage() {
    window.localStorage.setItem('saved-games', JSON.stringify(state.savedGames));
  }
  
  function createNumbers() {
    state.numbers = [];
  
    for (let i = 1; i <= 80; i++) {
      state.numbers.push(i);
    }
  }
  
  function render() {
    renderNumbers();
    renderTeamSelector();
    renderButtons();
    renderSavedGames();
  }
  
  function renderNumbers() {
    const divNumbers = document.querySelector('#timemania-numbers');
    divNumbers.innerHTML = '';
    
    const ulNumbers = document.createElement('ul');
    ulNumbers.classList.add('numbers');
  
    for (let i = 0; i < state.numbers.length; i++) {
      const number = state.numbers[i];
  
      const liNumber = document.createElement('li');
      liNumber.textContent = number.toString().padStart(2, '0');
      liNumber.classList.add('number');
  
      liNumber.addEventListener('click', handleNumberClick);
  
      if (state.currentNumbers.includes(number)) {
        liNumber.classList.add('selected-number');
      }
  
      ulNumbers.appendChild(liNumber);
    }
  
    divNumbers.appendChild(ulNumbers);
  }
  
  function renderTeamSelector() {
    const selectTeam = document.getElementById('time-do-coracao');
    selectTeam.innerHTML = ''; // Limpa as opções existentes
  
    const teams = [
      'Atlético Mineiro', 'Botafogo', 'Corinthians', 'Cruzeiro', 'Flamengo',
      'Fluminense', 'Grêmio', 'Internacional', 'Palmeiras', 'Santos', 'São Paulo',
      'Vasco da Gama', 'Ponte Preta', 'Chapecoense', 'Brusque', 'Vasco',
      'Náutico', 'CRB', 'Criciúma', 'Cruzeiro', 'CSA', 'Bahia', 'Novorizontino',
      'Grêmio', 'Guarani', 'Ituano', 'Londrina', 'Operário', 'Sampaio Corrêa',
      'Sport', 'Tombense', 'Vila Nova'
    ];
  
    for (const team of teams) {
      const option = document.createElement('option');
      option.value = team.toLowerCase().replace(/\s/g, '_'); // Transforma o nome em formato de URL
      option.textContent = team;
      selectTeam.appendChild(option);
    }
  
    selectTeam.addEventListener('change', (event) => {
      state.selectedTeam = event.target.value;
    });
  }
  
  function handleNumberClick(event) {
    const element = event.currentTarget;
    const number = parseInt(element.textContent);
  
    if (state.currentNumbers.includes(number)) {
      state.currentNumbers = state
      .currentNumbers.filter(num => num !== number);
    } else {
      if (state.currentNumbers.length < 10) {
        state.currentNumbers.push(number);
      }
    }
  
    renderNumbers();
  }
  
  function renderButtons() {
    const divButtons = document.getElementById('timemania-buttons');
    divButtons.innerHTML = '';
  
    const ulButtons = document.createElement('ul');
    ulButtons.classList.add('buttons');
  
    const liNewGameButton = renderNewGameButton();
    const liRandomGameButton = renderRandomGameButton();
    const liSaveGameButton = renderSaveGameButton();
    const liClearSavedGamesButton = renderClearSavedGamesButton();
  
    ulButtons.appendChild(liNewGameButton);
    ulButtons.appendChild(liRandomGameButton);
    ulButtons.appendChild(liSaveGameButton);
    ulButtons.appendChild(liClearSavedGamesButton);
  
    divButtons.appendChild(ulButtons);
  }
  
  function renderNewGameButton() {
    const li = document.createElement('li');
    li.classList.add('button');
  
    const button = document.createElement('button');
    button.textContent = 'Novo jogo';
    button.addEventListener('click', newGame);
  
    li.appendChild(button);
  
    return li;
  }
  
  function renderRandomGameButton() {
    const li = document.createElement('li');
    li.classList.add('button');
  
    const button = document.createElement('button');
    button.textContent = 'Jogo aleatório';
    button.addEventListener('click', generateRandomGame);
  
    li.appendChild(button);
  
    return li;
  }
  
  function renderSaveGameButton() {
    const li = document.createElement('li');
    li.classList.add('button');
  
    const button = document.createElement('button');
    button.textContent = 'Salvar jogo';
    button.disabled = state.currentNumbers.length !== 10 || state.selectedTeam === '';
    button.addEventListener('click', saveGame);
  
    li.appendChild(button);
  
    return li;
  }
  
  function renderClearSavedGamesButton() {
    const li = document.createElement('li');
    li.classList.add('button');
  
    const button = document.createElement('button');
    button.textContent = 'Limpar jogos salvos';
    button.addEventListener('click', clearSavedGames);
  
    li.appendChild(button);
  
    return li;
  }
  
  function generateRandomGame() {
    state.currentNumbers = [];
    state.currentTrevos = [];
  
    while (state.currentNumbers.length < 10) {
      const randomNum = Math.floor(Math.random() * 80) + 1;
      if (!state.currentNumbers.includes(randomNum)) {
        state.currentNumbers.push(randomNum);
      }
    }
  
    render();
  }
  
  function saveGame() {
    const sortedNumbers = [...state.currentNumbers].sort((a, b) => a - b); // Ordena as dezenas
    const game = {
      numbers: sortedNumbers,
      team: state.selectedTeam
    };
    state.savedGames.push(game);
    writeLocalStorage();
    newGame();
  }
  
  function clearSavedGames() {
    state.savedGames = [];
    writeLocalStorage();
    render();
  }
  
  function renderSavedGames() {
    const divSavedGames = document.querySelector('#timemania-saved-games');
    divSavedGames.innerHTML = '';
  
    if (state.savedGames.length === 0) {
      divSavedGames.innerHTML = '<p>Nenhum jogo gravado até o momento.</p>';
    } else {
      const h2 = document.createElement('h2');
      h2.textContent = 'Jogos salvos';
  
      const ul = document.createElement('ul');
      ul.classList.add('saved-games');
  
      for (let i = 0; i < state.savedGames.length; i++) {
        const currentGame = state.savedGames[i];
  
        const li = document.createElement('li');
  
        const numbers = currentGame.numbers.map(number => number.toString().padStart(2, '0')).join(' ');
        const team = currentGame.team;
  
        li.textContent = numbers + ' | Time: ' + team;
  
        ul.appendChild(li);
      }
  
      divSavedGames.appendChild(h2);
      divSavedGames.appendChild(ul);
    }
  }
  
  start();
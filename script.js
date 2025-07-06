 // Geolocation API functionality
    document.getElementById('getLocationBtn').addEventListener('click', function() {
      const resultDiv = document.getElementById('locationResult');
      const errorDiv = document.getElementById('locationError');
      
      // Reset previous results
      errorDiv.classList.add('hidden');
      resultDiv.innerHTML = '<p class="text-blue-300">🔍 Getting your location...</p>';
      
      if (!navigator.geolocation) {
        errorDiv.innerHTML = 'Geolocation is not supported by this browser.';
        errorDiv.classList.remove('hidden');
        resultDiv.innerHTML = '<p>Click the button above to get your current location coordinates</p>';
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        function(position) {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          
          resultDiv.innerHTML = `
            <div class="bg-gray-700/50 p-4 rounded-lg">
              <h4 class="text-green-300 font-semibold mb-2">📍 Your Location:</h4>
              <p><strong>Latitude:</strong> ${latitude.toFixed(6)}</p>
              <p><strong>Longitude:</strong> ${longitude.toFixed(6)}</p>
              <p class="text-sm text-gray-400 mt-2">Accuracy: ±${position.coords.accuracy} meters</p>
            </div>
          `;
        },
        function(error) {
          let errorMessage = '';
          switch(error.code) {
            case 1: // GeolocationPositionError.PERMISSION_DENIED
              errorMessage = 'Location access denied by user.';
              break;
            case 2: // GeolocationPositionError.POSITION_UNAVAILABLE
              errorMessage = 'Location information is unavailable.';
              break;
            case 3: // GeolocationPositionError.TIMEOUT
              errorMessage = 'Location request timed out.';
              break;
            default:
              errorMessage = `An error occurred (Code: ${error.code}). ${error.message || ''}`;
              break;
          }
          errorDiv.innerHTML = errorMessage;
          errorDiv.classList.remove('hidden');
          resultDiv.innerHTML = '<p>Click the button above to get your current location coordinates</p>';
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });

    // Load feedback from localStorage on page load
    function loadFeedback() {
      const feedbackList = document.getElementById('feedbackList');
      const storedFeedback = JSON.parse(localStorage.getItem('esportsFeedback') || '[]');
      
      feedbackList.innerHTML = '';
      storedFeedback.forEach(feedback => {
        const feedbackItem = document.createElement('div');
        feedbackItem.className = 'bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg border border-gray-600/50';
        feedbackItem.innerHTML = `
          <h4 class="text-yellow-300 font-semibold">${feedback.name}</h4>
          <p class="text-gray-300 mt-2">${feedback.comment}</p>
          <small class="text-gray-500">${feedback.timestamp}</small>
        `;
        feedbackList.appendChild(feedbackItem);
      });
    }

    // Feedback form functionality with localStorage
    document.getElementById('feedbackForm').addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = document.getElementById('name').value;
      const comment = document.getElementById('comment').value;
      
      if (name && comment) {
        // Get existing feedback from localStorage
        const existingFeedback = JSON.parse(localStorage.getItem('esportsFeedback') || '[]');
        
        // Create new feedback object
        const newFeedback = {
          name: name,
          comment: comment,
          timestamp: new Date().toLocaleString()
        };
        
        // Add to beginning of array
        existingFeedback.unshift(newFeedback);
        
        // Store back to localStorage
        localStorage.setItem('esportsFeedback', JSON.stringify(existingFeedback));
        
        // Reload feedback display
        loadFeedback();
        
        // Reset form
        document.getElementById('name').value = '';
        document.getElementById('comment').value = '';
        
        // Show confirmation
        alert('Thank you for your feedback! It has been saved.');
      }
    });

    // Load feedback on page load
    document.addEventListener('DOMContentLoaded', loadFeedback);

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
    // ===========================================
// FETCH API FUNCTIONALITY
// ===========================================

// API endpoints (using public APIs for demo)
const API_ENDPOINTS = {
  tournaments: 'https://jsonplaceholder.typicode.com/posts?_limit=3',
  players: 'https://jsonplaceholder.typicode.com/users?_limit=6',
  news: 'https://jsonplaceholder.typicode.com/posts?_start=0&_limit=5'
};

// DOM elements
const loadingSpinner = document.getElementById('loadingSpinner');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');

// Utility functions
function showLoading() {
  loadingSpinner.classList.remove('hidden');
  hideAllSections();
}

function hideLoading() {
  loadingSpinner.classList.add('hidden');
}

function showError(message) {
  errorText.textContent = message;
  errorMessage.classList.remove('hidden');
  hideLoading();
}

function hideError() {
  errorMessage.classList.add('hidden');
}

function hideAllSections() {
  document.getElementById('tournamentStats').classList.add('hidden');
  document.getElementById('topPlayers').classList.add('hidden');
  document.getElementById('gamingNews').classList.add('hidden');
  hideError();
}

// Fetch Tournament Stats
async function fetchTournamentStats() {
  try {
    showLoading();
    
    const response = await fetch(API_ENDPOINTS.tournaments);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Simulate tournament stats with fetched data
    document.getElementById('activeTournaments').textContent = data.length;
    document.getElementById('totalPrizePool').textContent = `$${(data.length * 5000).toLocaleString()}`;
    document.getElementById('registeredPlayers').textContent = data.length * 50;
    
    hideLoading();
    document.getElementById('tournamentStats').classList.remove('hidden');
    
  } catch (error) {
    console.error('Error fetching tournament stats:', error);
    showError('Failed to load tournament statistics. Please try again.');
  }
}

// Fetch Top Players
async function fetchTopPlayers() {
  try {
    showLoading();
    
    const response = await fetch(API_ENDPOINTS.players);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const players = await response.json();
    const playersGrid = document.getElementById('playersGrid');
    
    // Clear existing content
    playersGrid.innerHTML = '';
    
    // Create player cards
    players.forEach((player, index) => {
      const rank = index + 1;
      const score = Math.floor(Math.random() * 5000) + 1000;
      const games = ['Valorant', 'Chess', 'PUBG', 'FIFA', 'Tekken', 'Rocket League'];
      const randomGame = games[Math.floor(Math.random() * games.length)];
      
      const playerCard = `
        <div class="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-gray-600/50 text-center hover:transform hover:scale-105 transition-all duration-300">
          <div class="text-2xl sm:text-3xl font-bold text-yellow-400 mb-2">#${rank}</div>
          <div class="text-lg sm:text-xl font-semibold text-white mb-1">${player.name}</div>
          <div class="text-sm text-gray-400 mb-2">${player.username}</div>
          <div class="text-base text-cyan-300 mb-2">${randomGame}</div>
          <div class="text-lg font-bold text-green-400">${score.toLocaleString()} pts</div>
        </div>
      `;
      
      playersGrid.innerHTML += playerCard;
    });
    
    hideLoading();
    document.getElementById('topPlayers').classList.remove('hidden');
    
  } catch (error) {
    console.error('Error fetching players:', error);
    showError('Failed to load player data. Please try again.');
  }
}

// Fetch Gaming News
async function fetchGamingNews() {
  try {
    showLoading();
    
    const response = await fetch(API_ENDPOINTS.news);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const news = await response.json();
    const newsGrid = document.getElementById('newsGrid');
    
    // Clear existing content
    newsGrid.innerHTML = '';
    
    // Create news cards
    news.forEach((article, index) => {
      const newsCard = `
        <div class="bg-gradient-to-br from-red-800/50 to-orange-900/50 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-red-500/30 hover:transform hover:scale-105 transition-all duration-300">
          <div class="flex flex-col sm:flex-row gap-4">
            <div class="flex-1">
              <h4 class="text-lg sm:text-xl font-bold text-red-300 mb-2">${article.title}</h4>
              <p class="text-sm sm:text-base text-gray-300 mb-3">${article.body.substring(0, 120)}...</p>
              <div class="flex flex-wrap gap-2 mb-3">
                <span class="bg-red-500/30 text-red-200 px-2 py-1 rounded-full text-xs">Gaming</span>
                <span class="bg-orange-500/30 text-orange-200 px-2 py-1 rounded-full text-xs">Tournament</span>
              </div>
              <div class="text-xs text-gray-400">Article #${article.id} • Just now</div>
            </div>
          </div>
        </div>
      `;
      
      newsGrid.innerHTML += newsCard;
    });
    
    hideLoading();
    document.getElementById('gamingNews').classList.remove('hidden');
    
  } catch (error) {
    console.error('Error fetching news:', error);
    showError('Failed to load gaming news. Please try again.');
  }
}

// Event listeners
document.getElementById('fetchTournaments').addEventListener('click', fetchTournamentStats);
document.getElementById('fetchPlayers').addEventListener('click', fetchTopPlayers);
document.getElementById('fetchNews').addEventListener('click', fetchGamingNews);
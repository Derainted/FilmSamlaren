const apiKey = '6f61570b5e439d0714c98202884ac5ff'; // Replace with your TMDB API key
const baseUrl = 'https://api.themoviedb.org/3/';


let favoriteMovies = JSON.parse(localStorage.getItem('favorites')) || [];
let showingPopular = false;

// Fetch movies by search query
async function fetchMovies(query = '') {
  const url = `${baseUrl}search/movie?api_key=${apiKey}&query=${query}&language=en-US&page=1&include_adult=false`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    displayMovies(data.results);
  } catch (error) {
    console.error('Error fetching movies:', error);
  }
}

// Fetch popular movies
async function fetchPopularMovies() {
  const url = `${baseUrl}movie/popular?api_key=${apiKey}&language=en-US&page=1`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    displayMovies(data.results);
  } catch (error) {
    console.error('Error fetching popular movies:', error);
  }
}

// Display movies on the page
function displayMovies(movies) {
  const movieList = document.getElementById('movie-list');
  movieList.innerHTML = '';
  if (movies.length === 0) {
    movieList.innerHTML = '<p>No movies found</p>';
    return;
  }
  movies.forEach(movie => {
    const movieItem = document.createElement('div');
    movieItem.classList.add('movie-item');
    movieItem.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
      <h3>${movie.title}</h3>
      <button onclick="showMovieDetails(${movie.id})">Details</button>
      <button data-movie-id="${movie.id}" onclick="toggleFavorite(${movie.id})">
        ${isFavorite(movie.id) ? 'Remove from' : 'Add to'} Favorites
      </button>
    `;
    movieList.appendChild(movieItem);
  });
}

// Show movie details
function showMovieDetails(movieId) {
  const url = `${baseUrl}movie/${movieId}?api_key=${apiKey}&language=en-US`;
  fetch(url)
    .then(response => response.json())
    .then(movie => {
      const detailsContainer = document.getElementById('movie-details');
      detailsContainer.innerHTML = `
        <h2>${movie.title} (${movie.release_date.split('-')[0]})</h2>
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
        <p><strong>Genre:</strong> ${movie.genres.map(genre => genre.name).join(', ')}</p>
        <p><strong>Description:</strong> ${movie.overview}</p>
      `;
    })
    .catch(error => console.error('Error fetching movie details:', error));
}

// Toggle favorite movies
function toggleFavorite(movieId) {
  const button = document.querySelector(`button[data-movie-id="${movieId}"]`);
  if (isFavorite(movieId)) {
    favoriteMovies = favoriteMovies.filter(id => id !== movieId);
    button.textContent = 'Add to Favorites';
  } else {
    favoriteMovies.push(movieId);
    button.textContent = 'Remove from Favorites';
  }
  localStorage.setItem('favorites', JSON.stringify(favoriteMovies));
}

// Check if a movie is a favorite
function isFavorite(movieId) {
  return favoriteMovies.includes(movieId);
}

// Show favorites
function showFavorites() {
  const movieList = document.getElementById('movie-list');
  movieList.innerHTML = ''; // Clear existing movie list

  // If no favorite movies, show a message
  if (favoriteMovies.length === 0) {
    movieList.innerHTML = '<p>No favorites found.</p>';
    return;
  }

  // Fetch movie details for each favorite
  const favoriteMoviesDetails = favoriteMovies.map(id => {
    const url = `${baseUrl}movie/${id}?api_key=${apiKey}&language=en-US`;
    return fetch(url)
      .then(response => response.json())
      .then(movie => `
        <div class="movie-item">
          <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
          <h3>${movie.title}</h3>
          <button onclick="showMovieDetails(${movie.id})">Details</button>
          <button data-movie-id="${movie.id}" onclick="toggleFavorite(${movie.id})">
            Remove from Favorites
          </button>
        </div>
      `);
  });

  // Render the updated favorites list
  Promise.all(favoriteMoviesDetails)
    .then(favoriteHtml => {
      movieList.innerHTML = favoriteHtml.join('');
    })
    .catch(error => console.error('Error fetching favorite movies:', error));
}

  

// Event listeners for the index page
if (document.getElementById('search')) {
  document.getElementById('search').addEventListener('input', (event) => {
    const query = event.target.value;
    if (!showingPopular) fetchMovies(query);
  });
}

if (document.getElementById('favorite-toggle')) {
  document.getElementById('favorite-toggle').addEventListener('click', showFavorites);
}

if (document.getElementById('show-popular')) {
  document.getElementById('show-popular').addEventListener('click', () => {
    window.location.href = '/html/popularMovies.html'; // Navigate to popular.html
  });
}

// Fetch popular movies on the popular.html page
if (document.body.contains(document.getElementById('movie-list')) && window.location.pathname.includes('/html/popularMovies.html')) {
  fetchPopularMovies();
}

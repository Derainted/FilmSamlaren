const apiKey = '6f61570b5e439d0714c98202884ac5ff';
const baseUrl = 'https://api.themoviedb.org/3/';

const inputSearch = document.getElementById('search');
const favoriteBtn = document.getElementById('favorite-toggle');
const popularBtn = document.getElementById('show-popular');
const movieList = document.getElementById('movie-list');
const loadingIndicator = document.getElementById('loading');



let favoriteMovies = JSON.parse(localStorage.getItem('favorites')) || [];
let showingPopular = false;

// Search query fetch .. 
async function fetchMovies(query = '') {
    const url = `${baseUrl}search/movie?api_key=${apiKey}&query=${query}&language=en-US&page=1&include_adult=false`;
    try {
        // Displays loading indicator
        loadingIndicator.style.display = 'block';

        const response = await fetch(url);

        if (!response.ok) {
            httpStatus(response.status);
            return;
        }

        const data = await response.json();
        displayMovies(data.results);
    } 
    catch (error) {
        console.error('Error fetching movies:', error);
        mainContainer.innerHTML = `<p class="error">Error: ${error.message}</p>`;
    } finally {
        loadingIndicator.style.display = 'none';
    }
}

// Fetch popular movies
async function fetchPopularMovies() {
    const url = `${baseUrl}movie/popular?api_key=${apiKey}&language=en-US&page=1`;
    try {
        // Displays loading indicator
        loadingIndicator.style.display = 'block';

        const response = await fetch(url);

        if (!response.ok) {
            httpStatus(response.status);
            return;
        }

        const data = await response.json();
        displayMovies(data.results);
    } 
    catch (error) {
        console.error('Error fetching popular movies:', error);
        mainContainer.innerHTML = `<p class="error">Error: ${error.message}</p>`;
    } finally {
        loadingIndicator.style.display = 'none';
    }
}

// Display movies for the DOM 
function displayMovies(movies) {
    movieList.innerHTML = '';

    if (movies.length === 0) {
        movieList.innerHTML = '<p>No movies found</p>';
        return;
    }

    movies.forEach(movie => {
        const movieItem = document.createElement('div');
        movieItem.classList.add('movie-item');

        const image = document.createElement('img');
        image.src = movie.backdrop_path
            ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
            : "https://placehold.co/500x281";

        const title = document.createElement('h3');
        title.textContent = movie.title;

        const buttonDetail = document.createElement('button');
        buttonDetail.innerText = 'Details';
        buttonDetail.onclick = () => showMovieDetails(movie.id);

        // Create the favorite button and set its text based on whether the movie is a favorite
        const buttonFavorite = document.createElement('button');
        buttonFavorite.innerText = isFavorite(movie.id) ? 'Remove from Favorites' : 'Add to Favorites';
        buttonFavorite.setAttribute('data-movie-id', movie.id);
        buttonFavorite.onclick = () => toggleFavorite(movie.id);

        movieItem.appendChild(image);
        movieItem.appendChild(title);
        movieItem.appendChild(buttonDetail);
        movieItem.appendChild(buttonFavorite);
        movieList.appendChild(movieItem);
    });
}

// Show movie details
function showMovieDetails(movieId) {
    const url = `${baseUrl}movie/${movieId}?api_key=${apiKey}&language=en-US`;
    fetch(url)
        .then(response => response.json())
        .then(movie => {
            // Elements for popup window/modal window
            const modal = document.getElementById('movie-modal');
            const modalTitle = document.getElementById('modal-title');
            const modalImage = document.getElementById('modal-image');
            const modalGenre = document.getElementById('modal-genre');
            const modalDescription = document.getElementById('modal-description');
            const closeModal = document.getElementById('close-modal');

            // Fill modal with movie details
            modalTitle.textContent = `${movie.title} (${movie.release_date.split('-')[0]})`;
            modalImage.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
            modalGenre.innerHTML = `<strong>Genre:</strong> ${movie.genres.map(genre => genre.name).join(', ')}`;
            modalDescription.innerHTML = `<strong>Description:</strong> ${movie.overview}`;

            modal.style.display = 'block';

            // Close the modal when the user clicks the close button
            closeModal.onclick = function () {
                modal.style.display = 'none';
            }

            // Close the modal if the user clicks outside the modal content
            window.onclick = function (event) {
                if (event.target === modal) {
                    modal.style.display = 'none';
                }
            }
        })
        .catch(error => console.error('Error fetching movie details', error));
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
if (inputSearch) {
    inputSearch.addEventListener('input', (event) => {
        const query = event.target.value;
        showingPopular = false;  // Resetting the flag
        if (query) fetchMovies(query);
    });
}


// Event listeners for the fav toggle
favoriteBtn.addEventListener('click', showFavorites);

// Event listeners for the show poppular page

popularBtn.addEventListener('click', () => {
    window.location.href = '/html/popularMovies.html'; // Navigates to popularmovies.html
});

// Fetch popular movies on the popularMOVIES.html page
if (document.body.contains(movieList) && window.location.pathname.includes('/html/popularMovies.html')) {
    fetchPopularMovies();
}
fetchMovies('popular');

// Handle HTTP status codes
function httpStatus(statusCode) {
    switch (statusCode) {
        case 401: 
            console.error('Authentication failed: You do not have permissions to access the service.');
            break;
        case 404: 
            console.error('Invalid id: The pre-requisite id is invalid or not found.');
            break;
        case 504: 
            console.error('Invalid format: This service does not exist');
            break;
        default:
            console.error('Unknown error, please try again');
    }
}
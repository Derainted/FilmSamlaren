console.log('------ FilmSamlaren js loaded ------');

const apiKey = '6f61570b5e439d0714c98202884ac5ff';
const apiUrl = 'https://api.themoviedb.org/3/';
const inputSearch = document.getElementById('search');
const favoriteToggle = document.getElementById('favorite-toggle');
const showPopularBtn = document.getElementById('show-popular');
const loadingIndicator = document.getElementById('loading');
const mainContainer = document.getElementById('main-container');
const movieList = document.getElementById('movie-list');
const movieDetails = document.getElementById('movie-details');


// Fetching movies by search 
async function fetchMovies(query = '') {
    try {
        // displays loading indicator
        loadingIndicator.style.display = 'block';

        const url = `${apiUrl}search/movie?api_key=${apiKey}&query=${query}&language=en-US&page=1&include_adult=false`;
        const response = await fetch(url);

        if (!response.ok) {
            httpStatus(response.status);
            return;
        }

        const data = await response.json();
        console.log(data);
        displayMovies(data.results);
    } 

    catch (error) {
        mainContainer.innerHTML = `<p class="error">Error: ${error.message}</p>`;
    } finally {
        loadingIndicator.style.display = 'none';
    }
}

// Fetching popular movies
async function fetchPopularMovies() {
    try {
        // displays loading indicator
        loadingIndicator.style.display = 'block';

        const url = `${apiUrl}movie/popular?api_key=${apiKey}&language=en-US&page=1`;
        const response = await fetch(url);

        if (!response.ok) {
            httpStatus(response.status);
            return;
        }

        const data = await response.json();
        console.log(data.results);
        displayMovies(data.results);
    } 

    catch (error) {
        mainContainer.innerHTML = `<p class="error">Error: ${error.message}</p>`;
    } finally {
        loadingIndicator.style.display = 'none';
    }
}

function displayMovies(movies) {
    movieList.innerHTML = ''; 
    if (!movies || movies.length === 0) {
        mainContainer.innerHTML = '<p class="error">No movies found</p>';
        return;
    }

    movies.forEach(movie => {
        const movieItem = document.createElement('div');
        movieItem.classList.add('movie-item');

        const image = document.createElement('img');
        image.src = movie.backdrop_path 
        ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}` 
        : "https://placehold.co/500x281"
        console.log(image);

        const title = document.createElement('h3');
        title.textContent = movie.title;


        const buttonDetail = document.createElement('button');
        buttonDetail.innerText = 'Details';
        buttonDetail.onclick = () => showMovieDetails(movie.id);




        mainContainer.appendChild(movieItem);

        movieItem.appendChild(image);
        movieItem.appendChild(title);
        movieItem.appendChild(buttonDetail);
    });
    
}
fetchMovies('lion');

function showMovieDetails(movieId) {
    const url = `${apiUrl}movie/${movieId}?api_key=${apiKey}&language=en-US`;
    
    fetch(url)
    .then(res => res.json())
    .then(movie => {
        // Get modal elements
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
        
        // Display the modal
        modal.style.display = 'block';

        // Close the modal when the user clicks the close button
        closeModal.onclick = function() {
            modal.style.display = 'none';
        }

        // Close the modal if the user clicks outside the modal content
        window.onclick = function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        }
    })
    .catch(error => console.error('Error fetching movie details', error));
}

















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


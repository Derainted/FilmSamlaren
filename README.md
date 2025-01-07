# FilmSamlaren
FilmSamlaren is a web application that allows users to search for movies and add them to favorite list. 

# How to run Locally
Download the repository to your computer.
Open it in VS Code.
Right-click on index.html and select "Open with Live Server" to launch the page.

# Figma Design
Link: https://www.figma.com/design/YjkMMOpTDU626RgsawPvOQ/Untitled?node-id=0-1&p=f&t=gfsiTpn9emwlHf74-0

# Project Overview

JSON Handling: Used response.json() to convert the response stream into JavaScript objects for easier processing. I have handled JSON data using response.json() to convert the stream into JS objects. All of async function has async/await and try/catch. I am using promise.all an array of promises called favorite movie details. each promise is fetching details about a movie from API.
I have used semantic structure for accessebility and for SEO. A loader has also been used to inform the user when data is being retrived.
This site is fully responsice, with mockups for all screen sizes and mockups are available in figmma and this application uses TMBM API.

I have handled JSON data using response.json to convert the stream into JavaScript objects. Each async function includes a fetch with async/await and a try/catch block. I used Promise.all to fetch all the data at once, saving time for the user. There is a "loading" screen to indicate to the user when loading takes a bit longer. The HTML structure is semantically built, with alt text for images and good contrast for easy readability. The site is fully responsive on all pages, and a mockup exists in Figma for all screens/pages.








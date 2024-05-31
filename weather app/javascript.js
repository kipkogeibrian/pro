document.getElementById('searchBtn').addEventListener('click', function() {
    handleSearch();
});

document.getElementById('locationInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        handleSearch();
    }
});

document.getElementById('locationInput').addEventListener('input', function() {
    const location = document.getElementById('locationInput').value.trim();
    if (location) {
        getSuggestions(location);
    } else {
        clearSuggestions();
    }
});

function handleSearch() {
    const location = document.getElementById('locationInput').value.trim();
    if (!location) {
        alert('Please enter a location.');
    } else {
        getWeather(location);
    }
}

async function getWeather(location) {
    const apiKey = '076ab97f7848490d65a87d408704c732'; // Replace with your OpenWeatherMap API key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Location not found');
        }
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        document.getElementById('weatherResult').innerHTML = `<p>${error.message}</p>`;
    }
}

function displayWeather(data) {
    const weatherResult = document.getElementById('weatherResult');
    const clothingSuggestion = getClothingSuggestion(data.main.temp, data.weather[0].main);
    
    weatherResult.innerHTML = `
        <div class="weather-info">
            <h2>${data.name}, ${data.sys.country}</h2>
            <p>Temperature: ${data.main.temp} °C</p>
            <p>Weather: ${data.weather[0].description}</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind Speed: ${data.wind.speed} m/s</p>
            <p>${clothingSuggestion}</p>
        </div>
    `;
}

function getClothingSuggestion(temp, weatherCondition) {
    if (temp < 0) {
        return 'It\'s freezing outside! Wear heavy winter clothing like a thick coat, gloves, and a hat.';
    } else if (temp < 10) {
        return 'It\'s cold outside. Wear a warm jacket, scarf, and gloves.';
    } else if (temp < 20) {
        return 'The weather is cool. A light jacket or sweater should be sufficient.';
    } else if (temp < 30) {
        return 'It\'s warm outside. Comfortable clothing like a t-shirt and jeans is appropriate.';
    } else {
        return 'It\'s hot outside! Wear light and breathable clothing like shorts and a t-shirt.';
    }
}

async function getSuggestions(query) {
    const apiKey = '076ab97f7848490d65a87d408704c732'; // Replace with your OpenWeatherMap API key
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Error fetching suggestions');
        }
        const data = await response.json();
        displaySuggestions(data);
    } catch (error) {
        console.error(error);
    }
}

function displaySuggestions(suggestions) {
    const suggestionsList = document.getElementById('suggestions');
    clearSuggestions();
    suggestions.forEach(suggestion => {
        const listItem = document.createElement('li');
        listItem.textContent = `${suggestion.name}, ${suggestion.country}`;
        listItem.addEventListener('click', () => {
            document.getElementById('locationInput').value = listItem.textContent;
            clearSuggestions();
        });
        suggestionsList.appendChild(listItem);
    });
}

function clearSuggestions() {
    const suggestionsList = document.getElementById('suggestions');
    suggestionsList.innerHTML = '';
}

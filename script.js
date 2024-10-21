const searchInput = document.getElementById('search');
const resultsList = document.getElementById('results');
let selectedContinent = '';

// Escuchar el cambio de selección en los botones de radio para actualizar el continente seleccionado
document.querySelectorAll('input[name="continent"]').forEach(radio => {
    radio.addEventListener('change', () => {
        selectedContinent = document.querySelector('input[name="continent"]:checked').value;
        filterCountries(); // Llamar a la función para filtrar y mostrar los resultados nuevamente
    });
});

searchInput.addEventListener('input', () => filterCountries());

async function filterCountries() {
    const query = searchInput.value.toLowerCase();
    resultsList.innerHTML = '';

    if (query) {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const countries = await response.json();

        const filteredCountries = countries
            .filter(country => {
                const matchesName = country.name.common.toLowerCase().includes(query);
                const matchesContinent = !selectedContinent || country.region === selectedContinent;
                return matchesName && matchesContinent;
            })
            .sort((a, b) => a.name.common.localeCompare(b.name.common)); // Ordenar alfabéticamente

        filteredCountries.forEach(country => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex align-items-center';

            const flag = document.createElement('img');
            flag.src = country.flags.svg;
            flag.alt = `${country.name.common} flag`;
            flag.style.width = '30px'; // Ajustar tamaño de la bandera
            flag.style.marginRight = '10px';

            li.appendChild(flag);
            li.appendChild(document.createTextNode(country.name.common));
            li.onclick = () => showModal(country);
            resultsList.appendChild(li);
        });
    }
}

function showModal(country) {
    const modalTitle = document.getElementById('modal-title');
    const modalInfo = document.getElementById('modal-info');

    modalTitle.textContent = country.name.common;
    modalInfo.innerHTML = `
        <strong>Capital:</strong> ${country.capital ? country.capital.join(', ') : 'No disponible'}<br>
        <strong>Población:</strong> ${country.population.toLocaleString('es-ES')}<br>
        <strong>Área:</strong> ${country.area.toLocaleString('es-ES')} km²<br>
        <strong>Región:</strong> ${country.region}<br>
        <strong>Subregión:</strong> ${country.subregion ? country.subregion : 'No disponible'}<br>
        <strong>Idiomas:</strong> ${Object.values(country.languages || {}).join(', ')}
    `;

    $('#countryModal').modal('show');
}

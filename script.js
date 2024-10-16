const searchInput = document.getElementById('search');
const resultsList = document.getElementById('results');

searchInput.addEventListener('input', async () => {
    const query = searchInput.value.toLowerCase();
    resultsList.innerHTML = '';

    if (query) {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const countries = await response.json();

        const filteredCountries = countries.filter(country =>
            country.name.common.toLowerCase().includes(query)
        );

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
});

function showModal(country) {
    const modalTitle = document.getElementById('modal-title');
    const modalInfo = document.getElementById('modal-info');

    modalTitle.textContent = country.name.common;
    modalInfo.innerHTML = `
        <strong>Capital:</strong> ${country.capital ? country.capital.join(', ') : 'No disponible'}<br>
        <strong>Población:</strong> ${country.population}<br>
        <strong>Área:</strong> ${country.area} km²<br>
        <strong>Región:</strong> ${country.region}<br>
        <strong>Subregión:</strong> ${country.subregion}<br>
        <strong>Idiomas:</strong> ${Object.values(country.languages || {}).join(', ')}
    `;
    
    $('#countryModal').modal('show');
}

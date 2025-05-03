const apiUrl = 'http://localhost:3000/api/covid';

document.getElementById('searchButton').onclick = async () => {
    const fips = document.getElementById('searchCountyFips').value;
    const res = await fetch(`${apiUrl}/${fips}`);
    const data = await res.json();
    document.getElementById('searchResults').innerText = JSON.stringify(data, null, 2);
};

document.getElementById('insertButton').onclick = async () => {
    const formData = Object.fromEntries(new FormData(document.getElementById('insertForm')));
    const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    });
    document.getElementById('insertResults').innerText = res.status === 201 ? 'Insert successful' : 'Insert failed';
};

document.getElementById('updateButton').onclick = async () => {
    const fips = document.getElementById('updateCountyFips').value;
    const data = {
        county: document.getElementById('updateCounty').value || null,
        state: document.getElementById('updateState').value || null,
        covid_19_community_level: document.getElementById('updateCommunityLevel').value || null,
    };
    const res = await fetch(`${apiUrl}/${fips}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    document.getElementById('updateResults').innerText = res.status === 200 ? 'Update successful' : 'Update failed';
};

document.getElementById('deleteButton').onclick = async () => {
    const fips = document.getElementById('deleteCountyFips').value;
    const res = await fetch(`${apiUrl}/${fips}`, { method: 'DELETE' });
    document.getElementById('deleteResults').innerText = res.status === 200 ? 'Delete successful' : 'Delete failed';
};

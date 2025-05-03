require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/covid-19%20data'
});

// Search by FIPS
app.get('/api/covid/:fips', async (req, res) => {
    const { fips } = req.params;
    const result = await pool.query('SELECT * FROM covid_data WHERE county_fips = $1', [fips]);
    res.json(result.rows);
});

// Insert new data
app.post('/api/covid', async (req, res) => {
    const d = req.body;
    await pool.query(`
        INSERT INTO covid_data VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
    `, [
        d.county, d.county_fips, d.state, d.county_population, d.health_service_area_number,
        d.health_service_area, d.health_service_area_population,
        d.covid_inpatient_bed_utilization, d.covid_hospital_admissions_per_100k,
        d.covid_cases_per_100k, d.covid_19_community_level, d.date_updated
    ]);
    res.sendStatus(201);
});

// Update data
app.put('/api/covid/:fips', async (req, res) => {
    const { fips } = req.params;
    const { county, state, covid_19_community_level } = req.body;
    const result = await pool.query(`
        UPDATE covid_data SET
            county = COALESCE($1, county),
            state = COALESCE($2, state),
            covid_19_community_level = COALESCE($3, covid_19_community_level)
        WHERE county_fips = $4
    `, [county, state, covid_19_community_level, fips]);
    res.sendStatus(result.rowCount > 0 ? 200 : 404);
});

// Delete
app.delete('/api/covid/:fips', async (req, res) => {
    const result = await pool.query('DELETE FROM covid_data WHERE county_fips = $1', [req.params.fips]);
    res.sendStatus(result.rowCount > 0 ? 200 : 404);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));

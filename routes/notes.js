const express = require('express');
const router = express.Router();
const TravelNote = require('../models/travelNote');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function fetchCountryInfo(countryName) {
  const res = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fullText=true`);
  const data = await res.json();
  if (!data || data.length === 0) return null;
  const c = data[0];
  return {
    country: countryName,
    flagUrl: c.flags?.svg || c.flags?.png,
    region: c.region,
    currency: Object.keys(c.currencies || {})[0] || '',
    population: c.population,
    languages: c.languages ? Object.values(c.languages) : []
  };
}

router.get('/', async (req,res)=>{
  const notes = await TravelNote.find().sort({date:-1});
  res.json(notes);
});

router.post('/', async (req,res)=>{
  try {
    const {location,date,memory,tags} = req.body;
    const country = location.split(',').pop().trim();
    const countryInfo = await fetchCountryInfo(country).catch(e => {
      console.error('Country fetch failed:', e);
      return null;
    });
    const note = new TravelNote({
      location,
      date,
      memory,
      tags: tags? tags.split(',').map(t=>t.trim()):[],
      apiInfo: countryInfo || {}
    });

    await note.save();
    res.redirect('/views/listNotes.html?saved=1');
  } catch(e){
    console.error('Error saving note:', e);
    res.status(500).send("Error saving note: " + e.message);
  }
});

module.exports = router;

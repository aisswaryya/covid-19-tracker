import React, { useState, useEffect } from 'react'
import { MenuItem, FormControl, Select } from '@material-ui/core'
import InfoBox from './InfoBox'
import Map from './Map'
import './App.css'

function App() {
  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState('worldwide') //default value
  useEffect(() => {
    const getCountries = async () => {
      await fetch('https://disease.sh/v3/covid-19/countries')
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }))

          setCountries(countries)
        })
    }

    getCountries()
  }, [])

  const onCountryChange = (event) => {
    const countryCode = event.target.value
    setCountry(countryCode)
  }
  return (
    <div className='app'>
      <div className='app__left'>
        <div className='app__header'>
          <h1>Covid-19 Tracker</h1>
          <FormControl className='app_dropdown'>
            <Select
              variant='outlined'
              onChange={onCountryChange}
              value={country}
            >
              <MenuItem value='worldwide'>Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className='app__stats'>
          <InfoBox title='Coronovirus Cases' cases={100} total={2000} />
          <InfoBox title='Recovered' cases={399} total={199} />
          <InfoBox title='Deaths' cases={400} total={198} />
        </div>
        <Map />
      </div>
    </div>
  )
}

export default App

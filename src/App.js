import React, { useState, useEffect } from 'react'
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from '@material-ui/core'
import InfoBox from './InfoBox'
import Map from './Map'
import Table from './Table'
import { sortData } from './util'
import LineGraph from './LineGraph'
import './App.css'

function App() {
  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState('worldwide') //default value
  const [countryInfo, setCountryInfo] = useState({})
  const [tableData, setTableData] = useState([])

  //populate country table for worldwide input
  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data)
      })
  }, [])

  //populate country table for specific country
  useEffect(() => {
    const getCountries = async () => {
      await fetch('https://disease.sh/v3/covid-19/countries')
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }))

          const sortedData = sortData(data)
          setTableData(sortedData)
          setCountries(countries)
        })
    }

    getCountries()
  }, [])

  const onCountryChange = async (event) => {
    const countryCode = event.target.value
    setCountry(countryCode)

    const url =
      country === 'worldwide'
        ? 'https://disease.sh/v3/covid-19/all'
        : `https://disease.sh/v3/cdiov-19/countries/${countryCode}`

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data)
      })
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
          <InfoBox
            title='Coronovirus Cases'
            cases={countryInfo.todayCases}
            total={countryInfo.cases}
          />
          <InfoBox
            title='Recovered'
            cases={countryInfo.recovered}
            total={countryInfo.todayRecovered}
          />
          <InfoBox
            title='Deaths'
            cases={countryInfo.todayDeaths}
            total={countryInfo.deaths}
          />
        </div>
        <Map />
      </div>
      <Card className='app__right'>
        <CardContent>
          {/* table */}
          <h3>Live cases by Country</h3>
          <Table countries={tableData} />
          {/* graph */}
          <h3>Worldwide new Cases</h3>
          <LineGraph></LineGraph>
        </CardContent>
      </Card>
    </div>
  )
}

export default App

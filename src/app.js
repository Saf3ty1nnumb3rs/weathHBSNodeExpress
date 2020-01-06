const path = require('path')
const express = require('express')
const logger = require('morgan')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
// Sets morgan logger
app.use(logger('dev'))

// Define paths
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// sets handlebars engine, views location, partials path
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

const PORT = process.env.PORT || 3000

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
  res.render('index', {
    title: 'Weather OverGround',
    name: 'Josh Sample'
  })
})

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About Me',
    name: 'Josh Sample'
  })
});

app.get('/help', (req, res) => {
  res.render('help', {
    title: 'Help',
    helpMessage: 'Here is where you get help',
    name: 'Josh Sample'
  })
});

app.get('/weather', (req, res, next) => {
  if (!req.query.address) {
    return res.send({ error: 'You must request an address' })
  }

  geocode(req.query.address, (error, { lat, lon, location = 'your location' } = {}) => { // set default to empty object to avoid destructure errors
    if (error) return res.send({ error })
    if (lat && lon) {
      forecast(lat, lon, location, (error, { summ, low, high, degree, temp, rain }) => {
        if (error) res.send({ error })
        if (temp) {
          res.send({
            forecast: { summ, low, high, degree, temp, rain },
            location,
            address: req.query.address
          })
        }
      }, req.query.lang, req.query.temp)
    }
  })
})

app.get('/help/*', (req, res) => {
  res.render('404', {
    title: 'Help',
    notFoundMessage: 'Help article not found.',
    name: 'Josh Sample'
  })
})

app.get('*', (req, res) => {
  res.render('404', {
    title: '404',
    notFoundMessage: 'Page not found.',
    name: 'Josh Sample'
  })
})

app.listen(PORT, () => {
  console.log(`Listening on Port ${PORT}`)
})

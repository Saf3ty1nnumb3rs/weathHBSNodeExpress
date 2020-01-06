const request = require('request')
// mapbox api
const mapToken = 'pk.eyJ1Ijoic2FmM3R5MW5udW1iM3JzIiwiYSI6ImNrNHp1d2M1cTA2d2IzbW5ubTV4dDNwMWYifQ.uKZ2PuKw8fXuD2bnQuuJ_g'

const geocode = (address, callback) => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapToken}&limit=1`

  request({ url, json: true }, (err, { body: { features } }) => {
    if (err) {
      callback('Unable to connect to location services', undefined)
    } else if (features && features.length === 0) {
      callback('Unable to find location. Try another search.', undefined)
    } else {
      const { place_name, center } = features[0]
      callback(undefined, {
        lat: center[1],
        lon: center[0],
        location: place_name
      })
    }
  })
}

module.exports = geocode

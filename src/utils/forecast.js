const request = require('request')
// dark sky API
const keyDarkSky = '0b59d28c5350828fb2dcef15aad7be2a'


const forecast = (lat, lon, location, callback, lang = 'en', unit = 'us') => {
  const url = `https://api.darksky.net/forecast/${keyDarkSky}/${lat},${lon}?lang=${lang}&units=${unit}`
  let current

  request({ url, json: true }, (err, { body } = {}) => {
    if (err) {
      callback('Unable to connect to the weather service', undefined)
    } else if (body.error) {
      callback('Unable to find location', undefined)
    } else {
      try {
        const { currently: { temperature, precipProbability }, daily: { data } } = body
        const { temperatureMin, temperatureMax, summary } = data[0]
        const degree = unit === 'us' ? 'F' : 'C'
        if (temperature && data[0]) {
          current = {
            low: temperatureMin,
            high: temperatureMax,
            summ: summary,
            temp: temperature,
            rain: precipProbability,
            degree,
            location
          }
          callback(undefined, current)
        }
      } catch (error) {
        console.log(error.message)
      }
    }
  })
}

module.exports = forecast
console.log('Client JS loaded!');
const messageOne = document.querySelector('#message-1')
const messageTwo = document.querySelector('#message-2')

messageOne.textContent = ''
messageTwo.textContent = ''

const fetchLocation = (location, temp = 'us', lang = 'en') => {
  if (messageOne.classList.contains('red')) messageOne.classList.remove('red')
  messageOne.textContent = 'Loading...'
  fetch(`/weather?address=${location}&lang=${lang}&temp=${temp}`).then((response) => {
    response.json().then((data) => {
      if (data.error) {
        messageOne.textContent = data.error
        messageOne.classList.add('red')
      } else {
        messageOne.classList.remove('red')
        const { low, high, summ, temp, rain, degree } = data.forecast
        const tempType = degree === 'F' ? '℉' : '℃'
        messageOne.textContent = data.location
        messageTwo.textContent = `${summ} The current temperature is ${temp} ${tempType} with a high of ${high} ${tempType} and a low of ${low} ${tempType}. There is a ${rain} % chance of rain.`
      }
    })
  })
}

// VARS
const weatherForm = document.querySelector('form')
const search = document.querySelector('#location')
const temp = document.querySelector('#temp')

// EVENT LISTENER/ACTION
weatherForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const unit = temp.value === 'F' ? 'us' : 'si'
  fetchLocation(search.value, unit)
})
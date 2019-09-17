const client = io();

client.on('message', (message) => {
    console.log(message);
})

const $messageForm = document.querySelector('#message-form');
const $messageFormInput = document.querySelector('input');
const $messageFormButton = document.querySelector('button');

const $sendLocationButton = document.querySelector('#send-location');


$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();

    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value;

    client.emit('sendMessage', message, (error)=>{
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value=''
        $messageFormInput.focus()

        if(error){
            return console.log(error)
        }
        console.log('This message has been delivered')
    });
})

$sendLocationButton.addEventListener('click', (e) => {
    if(!navigator.geolocation){
        return alert('GeoLocation is not supported by your browser!')
    }

    $sendLocationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position)=>{
        console.log(position);
        client.emit('sendLocation', {
            latitude : position.coords.latitude,
            longitude : position.coords.longitude
        }, ()=>{
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location Shared!')
        })
    })
})
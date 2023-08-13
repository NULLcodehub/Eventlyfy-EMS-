document.addEventListener('DOMContentLoaded', () => {
    const eventPlanerDiv = document.getElementById('event-planer');
    
    // Fetch data from the server
    fetch('/eventdata')
        .then(response => response.json())
        .then(data => {
            console.log("Data fetched:", data);

            // Generate and insert the data into the elements
            data.forEach(result => {
                const eventContainer = document.createElement('div');
                eventContainer.className = 'event-container';

                const eventName = document.createElement('h3');
                eventName.textContent = result.Cname;

                const eventEmail = document.createElement('h6');
                eventEmail.textContent = `Email: ${result.email}`;

                const eventPhone = document.createElement('h6');
                eventPhone.textContent = `Phone: ${result.phone}`;

                const eventAddress = document.createElement('p');
                eventAddress.textContent = `Address: ${result.address}`;

                const profileButton = document.createElement('button');
                profileButton.textContent = 'View Profile';
                profileButton.addEventListener('click', () => {
                    // Redirect to the event planner's profile page
                    window.location.href = `/profile/${result.id}`;


                // const option = document.createElement('option');
                // option.value = eventType.Cname.toLowerCase();
                // option.textContent = eventType.Cname.charAt(0).toUpperCase() + eventType.slice(1);
                // eventTypeSelect.appendChild(option);



                });

                eventContainer.appendChild(eventName);
                eventContainer.appendChild(eventEmail);
                eventContainer.appendChild(eventPhone);
                eventContainer.appendChild(eventAddress);
                eventContainer.appendChild(profileButton)
                eventPlanerDiv.appendChild(eventContainer);
            });
        })
        .catch(error => console.error('Error fetching data:', error));
});


document.addEventListener('DOMContentLoaded', () => {
    const eventTypeSelect = document.getElementById('eventTypeSelect');


    fetch('/eventdata')
        .then(response => response.json())
        .then(data => {
            console.log("Data fetched:", data);

            // Generate and insert the data into the elements
            data.forEach(result => {
            


                const option = document.createElement('option');
                option.value = result.Cname.toLowerCase();
                option.textContent = result.Cname.charAt(0).toUpperCase() + result.Cname.slice(1);
                eventTypeSelect.appendChild(option);



                });

                
            }).catch(error => console.error('Error fetching data:', error));
    });
        

    
    


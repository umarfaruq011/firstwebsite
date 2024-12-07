


let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

// Highlight active section on scroll
window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if (top >= offset && top <= offset + height) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                document.querySelector(`header nav a[href*='${id}']`).classList.add('active');
            });
        }
    });
};

// Toggle menu icon and navbar
menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
};


 // Load stored data when the page loads
 window.onload = function () {
    if (localStorage.getItem('contactData')) {
        const contactData = JSON.parse(localStorage.getItem('contactData'));
        document.getElementById('fullName').value = contactData.name || '';
        document.getElementById('email').value = contactData.email || '';
        document.getElementById('subject').value = contactData.subject || '';
        document.getElementById('message').value = contactData.message || '';
        document.getElementById('displayMessage').innerText = 
            `Name: ${contactData.name}\nEmail: ${contactData.email}\nSubject: ${contactData.subject || "No Subject"}\nMessage: ${contactData.message}`;
    }
};

// Save data and display it
window.onclick = function (e) {
    var id = e.target.id;
    if (id === 'submit') {
        // Get form values
        var name = document.getElementById('fullName').value.trim();
        var email = document.getElementById('email').value.trim();
        var subject = document.getElementById('subject').value.trim();
        var message = document.getElementById('message').value.trim();

        // Validate required fields
        if (!name || !email || !message) {
            document.getElementById('displayMessage').innerText = 'Please fill all required fields (Name, Email, and Message) in English.';
            return;
        }

        // Save data to localStorage
        const contactData = { name, email, subject, message };
        localStorage.setItem('contactData', JSON.stringify(contactData));

        // Display the results
        document.getElementById('displayMessage').innerText = 
            `Name: ${name}\nEmail: ${email}\nSubject: ${subject || "No Subject"}\nMessage: ${message}`;
    }
};

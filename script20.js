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

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// HTML Elements
const form = document.getElementById('contactForm');
const commentsList = document.getElementById('commentsList');

// Form Submit Event Listener
form.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent page reload

    // Collect Form Data
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    // Validation
    if (!fullName || !email || !message) {
        alert("Please fill in all required fields.");
        return;
    }

    // Save to Firebase
    const commentData = {
        fullName,
        email,
        subject,
        message,
        timestamp: Date.now()
    };

    db.ref('comments').push(commentData)
        .then(() => {
            alert("Your comment has been submitted!");
            form.reset();
            loadComments();
        })
        .catch((error) => {
            console.error("Error saving comment: ", error);
            alert("Failed to save your comment. Please try again.");
        });
});

// Load Comments from Firebase
function loadComments() {
    commentsList.innerHTML = ""; // Clear previous comments

    db.ref('comments').once('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const comment = childSnapshot.val();
            const commentKey = childSnapshot.key;

            const commentItem = document.createElement('li');
            commentItem.innerHTML = `
                <strong>${comment.fullName} (${comment.email})</strong>
                <p><strong>Subject:</strong> ${comment.subject}</p>
                <p><strong>Message:</strong> ${comment.message}</p>
                <button class="deleteBtn" data-key="${commentKey}">Delete</button>
            `;
            commentsList.appendChild(commentItem);

            // Add delete functionality
            const deleteBtn = commentItem.querySelector('.deleteBtn');
            deleteBtn.addEventListener('click', () => {
                deleteComment(commentKey, commentItem);
            });
        });
    });
}

// Delete Comment
function deleteComment(key, element) {
    db.ref('comments').child(key).remove()
        .then(() => {
            commentsList.removeChild(element);
            alert("Comment deleted successfully!");
        })
        .catch((error) => {
            console.error("Error deleting comment: ", error);
            alert("Failed to delete comment.");
        });
}

// Load Comments on Page Load
window.onload = loadComments;


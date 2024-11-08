const apiKey = "hZ-WeNZxfjw-7Ngf4x3yvvTThMpxOZXo45WDhxisPIU";

const searchTerms = [
    "natural disaster safety for kids",
    "emergency kit for children",
    "fire safety for kids",
    "earthquake safety for kids",
    "flood safety for kids",
    "storm preparation for kids",
    "wildfire safety for kids",
    "emergency evacuation for kids",
    "safety education for children",
    "disaster response for kids"
];

let currentIndex = 0;

async function fetchImages() {
    const container = document.getElementById('random-image-grid');

    // Create carousel structure
    const carouselContainer = document.createElement('div');
    carouselContainer.className = 'carousel-container';

    try {
        for (const term of searchTerms) {
            const response = await fetch(
                `https://api.unsplash.com/photos/random?query=${term}&orientation=landscape&client_id=${apiKey}`
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            const slide = document.createElement('div');
            slide.className = 'carousel-slide';

            const img = document.createElement('img');
            img.src = data.urls.regular;

            slide.appendChild(img);
            carouselContainer.appendChild(slide);
        }

        // Add navigation buttons
        const prevBtn = document.createElement('button');
        prevBtn.className = 'carousel-btn prev-btn';
        prevBtn.innerHTML = '&#10094;';
        prevBtn.onclick = () => moveSlide(-1);

        const nextBtn = document.createElement('button');
        nextBtn.className = 'carousel-btn next-btn';
        nextBtn.innerHTML = '&#10095;';
        nextBtn.onclick = () => moveSlide(1);

        container.appendChild(carouselContainer);
        container.appendChild(prevBtn);
        container.appendChild(nextBtn);

        // Start auto-slide
        setInterval(() => moveSlide(1), 5000);

    } catch (error) {
        console.error('Error fetching images:', error);
    }
}

function moveSlide(direction) {
    const container = document.querySelector('.carousel-container');
    const slides = document.querySelectorAll('.carousel-slide');
    currentIndex = (currentIndex + direction + slides.length) % slides.length;
    container.style.transform = `translateX(-${currentIndex * 100}%)`;
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', fetchImages);
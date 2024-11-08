const apiKey = "b6fDqRHZmkssv8ClWxhxyIV4nfLhbaOiUZTSz36zNUru5Me1IHQB2Qqf"; // Remplacez par votre clé API Pexels
const searchTerms = [
    "disaster prevention art",
    "safety education art",
    "emergency kit art",
    "fire safety art",
    "earthquake safety art",
    "flood safety art",
    "storm preparation art",
    "wildfire safety art",
    "emergency evacuation art",
    "disaster response art"
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
                `https://api.pexels.com/v1/search?query=${term}&orientation=landscape`,
                {
                    headers: {
                        Authorization: apiKey
                    }
                }
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.photos.length > 0) {
                const slide = document.createElement('div');
                slide.className = 'carousel-slide';

                const img = document.createElement('img');
                img.src = data.photos[0].src.large;

                slide.appendChild(img);
                carouselContainer.appendChild(slide);
            }
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
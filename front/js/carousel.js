const apiKey = "b6fDqRHZmkssv8ClWxhxyIV4nfLhbaOiUZTSz36zNUru5Me1IHQB2Qqf";

const searchTerms = [
    "natural disaster",
    "hurricane damage",
    "earthquake destruction",
    "tsunami waves",
    "volcanic eruption",
    "tornado storm",
    "flood disaster",
    "wildfire forest",
    "landslide disaster",
    "avalanche mountain"
];

let currentIndex = 0;

async function fetchImages() {
    const container = document.getElementById('random-image-grid');

    const carouselContainer = document.createElement('div');
    carouselContainer.className = 'carousel-container';

    try {
        for (const term of searchTerms) {
            const response = await fetch(
                `https://api.pexels.com/v1/search?query=${term}&orientation=landscape&per_page=1`,
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
                img.alt = term;

                const caption = document.createElement('div');
                caption.className = 'slide-caption';
                caption.textContent = term.charAt(0).toUpperCase() + term.slice(1);

                slide.appendChild(img);
                slide.appendChild(caption);
                carouselContainer.appendChild(slide);
            }
        }

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

document.addEventListener('DOMContentLoaded', fetchImages);
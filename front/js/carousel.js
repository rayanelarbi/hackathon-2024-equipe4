const apiKey = "tCq-sjTGPcEEvLA1wq5N5hLSLxaiQ1tSFGty6MoGEyA";
const searchTerms = [
    "safety kids",
    "emergency preparation",
    "fire safety children",
    "natural disaster preparation",
    "safety education"
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
            const data = await response.json();
            
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            
            const img = document.createElement('img');
            img.src = data.urls.regular;
            
            
            const caption = document.createElement('div');
            caption.className = 'carousel-caption';
            
            
            slide.appendChild(img);
            slide.appendChild(caption);
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

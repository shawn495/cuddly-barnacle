const productsDOM = document.querySelector(".products-center");

class Products {
    async getProducts() {
        try {
            const response = await fetch('/Json/index.json'); // adjust path if needed
            const data = await response.json();
            
            // Map Contentful-style JSON
            const products = data.items
                .filter(item => item.fields?.image?.fields?.file) // ensure image exists
                .map(item => {
                    const { title, price, description } = item.fields;
                    const { id } = item.sys;
                    const image = item.fields.image.fields.file.url;
                    return { id, title, price, description, image };
                });

            return products;
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    }
}

class UI {
    displayProducts(products) {
        const slidesHTML = products.map(product => `
            <div class="swiper-slide">
                <div class="product-card">
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.title}" class="product-img">
                    </div>
                    <div class="product-info">
                        <h3 class="product-title">${product.title}</h3>
                        <p class="product-description">${product.description}</p>
                        <span class="product-price">R${product.price}</span>
                    </div>
                </div>
            </div>
        `).join('');

        productsDOM.innerHTML = slidesHTML;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const ui = new UI();
    const products = new Products();
    const productsData = await products.getProducts();

    if (productsData.length === 0) {
        console.warn('No products to display.');
        return;
    }

    ui.displayProducts(productsData);

    // Initialize Swiper with continuous scrolling
    new Swiper('.swiper', {
        slidesPerView: 3,
        spaceBetween: 20,
        loop: true,
        speed: 4000,
        autoplay: {
            delay: 0,
            disableOnInteraction: false
        },
        allowTouchMove: false,
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        }
    });
});

// BURGER MENU TOGGLE
document.addEventListener("DOMContentLoaded", () => {
    const burger = document.getElementById("burger-menu");
    const links = document.getElementById("links-container");
    const buttons = document.getElementById("buttons");

    if (burger) {
        burger.addEventListener("click", () => {
            // toggle visibility
            links.classList.toggle("show-menu");
            buttons.classList.toggle("show-menu");
        });
    }
});


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

    // Build a mobile sidebar (created once)
    function createMobileSidebar() {
        if (document.getElementById('mobile-nav-overlay')) return; // already created

        const overlay = document.createElement('div');
        overlay.id = 'mobile-nav-overlay';
        overlay.tabIndex = -1;

        const sidebar = document.createElement('aside');
        sidebar.id = 'mobile-sidebar';
        sidebar.setAttribute('aria-hidden', 'true');

        const closeBtn = document.createElement('button');
        closeBtn.id = 'mobile-nav-close';
        closeBtn.className = 'mobile-close';
        closeBtn.innerHTML = '✕';
        closeBtn.setAttribute('aria-label', 'Close menu');

        // Clone the logo and links/buttons into the sidebar (shallow clone)
        const logo = document.getElementById('logo');
        if (logo) sidebar.appendChild(logo.cloneNode(true));

        const clonedLinks = document.getElementById('links')?.cloneNode(true);
        if (clonedLinks) clonedLinks.id = 'mobile-links';
        const clonedButtons = document.getElementById('buttons')?.cloneNode(true);
        if (clonedButtons) clonedButtons.id = 'mobile-buttons';

        sidebar.appendChild(closeBtn);
        if (clonedLinks) sidebar.appendChild(clonedLinks);
        if (clonedButtons) sidebar.appendChild(clonedButtons);

        document.body.appendChild(overlay);
        document.body.appendChild(sidebar);

        // Close handlers
        function closeSidebar() {
            overlay.classList.remove('open');
            sidebar.classList.remove('open');
            sidebar.setAttribute('aria-hidden', 'true');
            // return focus to burger
            burger?.focus();
        }

        overlay.addEventListener('click', closeSidebar);
        closeBtn.addEventListener('click', closeSidebar);

        // keyboard escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeSidebar();
        });
    }

    function openSidebar() {
        const overlay = document.getElementById('mobile-nav-overlay');
        const sidebar = document.getElementById('mobile-sidebar');
        if (!overlay || !sidebar) return;
        overlay.classList.add('open');
        sidebar.classList.add('open');
        sidebar.setAttribute('aria-hidden', 'false');
        // move focus to first link
        const firstFocusable = sidebar.querySelector('a, button');
        firstFocusable?.focus();
    }

    if (burger) {
        burger.addEventListener('click', () => {
            // If small screen, open the sliding sidebar; otherwise keep previous behavior
            if (window.innerWidth <= 900) {
                createMobileSidebar();
                openSidebar();
            } else {
                // fallback: toggle inline menu
                links.classList.toggle('show-menu');
                buttons.classList.toggle('show-menu');
            }
        });
    }
});


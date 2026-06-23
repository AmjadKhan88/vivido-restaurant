(function() {
  // 3D interactive enhancements + mobile menu toggle
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const reserveBtn = document.getElementById('reserveButton');
  const navItems = document.querySelectorAll('.nav-item');

  // ---- Mobile menu toggle ----
function closeMenu() {
    if (!navLinks) return;
    navLinks.classList.remove('show');
    menuToggle && menuToggle.classList.remove('open');
  }

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navLinks.classList.toggle('show');
      menuToggle.classList.toggle('open', isOpen);
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (navbar && !navbar.contains(e.target)) closeMenu();
    });

    // Close when a link is tapped on mobile
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) closeMenu();
      });
    });
  }

  // ---- Active class switching on nav items ----
  function setActiveItem(clickedItem) {
    navItems.forEach(item => item.classList.remove('active'));
    if (clickedItem) {
      clickedItem.classList.add('active');
    }
  }

  navItems.forEach(item => {
    item.addEventListener('click', function(e) {
      // Only prevent default if it's a hash link (demo)
      const link = this.querySelector('.nav-link');
      if (link && link.getAttribute('href') === '#') {
        e.preventDefault();
      }
      setActiveItem(this);
      
      // subtle 3D pulse on click
      if (navbar) {
        navbar.style.transform = 'rotateX(1deg) rotateY(1deg) scale(0.99)';
        setTimeout(() => {
          navbar.style.transform = '';
        }, 180);
      }
    });
  });

  // ---- Reservation button interaction ----
  const reservationModal = document.getElementById('reservationModal');
  if (reserveBtn && reservationModal) {
    reserveBtn.addEventListener('click', function(e) {
      e.preventDefault();
      this.style.transform = 'translateZ(18px) scale(0.96)';
      setTimeout(() => { this.style.transform = ''; }, 150);
      reservationModal.classList.add('active');
      reservationModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  }

  // Close reservation modal
  document.querySelectorAll('[data-close-reservation]').forEach(el => {
    el.addEventListener('click', () => {
      if (reservationModal) {
        reservationModal.classList.remove('active');
        reservationModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    });
  });

  // Reservation form submit
  const reservationForm = document.getElementById('reservationForm');
  const reservationStatus = document.getElementById('reservationStatus');
  if (reservationForm) {
    reservationForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = reservationForm.querySelector('[type="submit"]');
      const originalHTML = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking...';
      submitBtn.disabled = true;
      reservationStatus.textContent = '';

      try {
        const data = Object.fromEntries(new FormData(reservationForm).entries());
        const res = await fetch('/api/reservations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        const json = await res.json();
        if (json.success) {
          reservationStatus.style.color = '#10b981';
          reservationStatus.textContent = '✅ ' + json.message;
          reservationForm.reset();
          setTimeout(() => {
            reservationModal.classList.remove('active');
            reservationModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            reservationStatus.textContent = '';
          }, 3000);
        } else {
          reservationStatus.style.color = '#ef4444';
          reservationStatus.textContent = '❌ ' + (json.message || 'Booking failed. Please try again.');
        }
      } catch (err) {
        reservationStatus.style.color = '#ef4444';
        reservationStatus.textContent = '❌ Network error. Please try again.';
      } finally {
        submitBtn.innerHTML = originalHTML;
        submitBtn.disabled = false;
      }
    });
  }

  // ---- 3D mouse parallax effect for navbar (desktop) ----
  function applyParallax(e) {
    if (window.innerWidth <= 768) return; // disable heavy parallax on mobile
    if (!navbar) return;
    
    const navbarRect = navbar.getBoundingClientRect();
    const centerX = navbarRect.left + navbarRect.width / 2;
    const centerY = navbarRect.top + navbarRect.height / 2;
    
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    // Calculate offset from center (range -1 to 1 approx)
    const deltaX = (mouseX - centerX) / (window.innerWidth / 2);
    const deltaY = (mouseY - centerY) / (window.innerHeight / 2);
    
    // Limit rotation values
    const rotateY = deltaX * 3.5;  // max ~3.5deg
    const rotateX = -deltaY * 2.8; // max ~2.8deg
    
    // Apply transform with base animation override (but smooth)
    navbar.style.transform = `rotateX(${2 + rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
  }

  function resetParallax() {
    if (window.innerWidth <= 768) return;
    if (navbar) {
      navbar.style.transform = ''; // back to CSS animation
    }
  }

  // Add mousemove listener on document for parallax
  document.addEventListener('mousemove', applyParallax);
  
  if (navbar) {
    navbar.addEventListener('mouseleave', resetParallax);
  }
  
  // Also reset when mouse leaves document (optional)
  document.addEventListener('mouseleave', () => {
    if (window.innerWidth > 768 && navbar) {
      navbar.style.transform = '';
    }
  });

    // Add scrolled class for enhanced glow
  const navHeader = document.querySelector('.navbar-header');
  if (navHeader) {
    window.addEventListener('scroll', () => {
      navHeader.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }


  // Handle window resize to avoid mobile glitches
  window.addEventListener('resize', () => {
    if (window.innerWidth <= 768) {
      if (navbar) navbar.style.transform = ''; // remove inline transforms
      if (navLinks && navLinks.classList.contains('show')) {
        // optionally keep menu open but reset icon if needed
      }
    } else {
      // ensure desktop state
      if (navLinks && navLinks.classList.contains('show')) {
        navLinks.classList.remove('show');
        const icon = menuToggle?.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
      }
    }
  });

  // ---- Smooth scroll for navigation links ----
  document.querySelectorAll('.nav-link[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

  console.log('🍷 VIVIDO 3D Navbar ready – immersive dining experience with sticky positioning.');
})();




// hero section
// Initialize Three.js 3D Scene
let scene, camera, renderer, pizza, pizzaSlice;
let particles = [];
let mouseX = 0;
let mouseY = 0;

function initThreeJS() {
  const canvas = document.getElementById('heroCanvas');
  
  // Scene setup
  scene = new THREE.Scene();
  
  // Camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;
  
  // Renderer
  renderer = new THREE.WebGLRenderer({ 
    canvas: canvas, 
    alpha: true,
    antialias: true 
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  
  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffd700, 0.5);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xff8c42, 1);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);
  
  const pointLight = new THREE.PointLight(0xff4500, 0.8, 10);
  pointLight.position.set(-2, 1, 3);
  scene.add(pointLight);
  
  // Create 3D Pizza
  createPizza();
  
  // Create floating particles
  createParticles();
  
  // Animation loop
  animate();
}

function createPizza() {
  // Pizza Base (Crust)
  const crustGeometry = new THREE.CylinderGeometry(1.8, 1.9, 0.3, 32);
  const crustMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xd4a574,
    roughness: 0.6,
    metalness: 0.1
  });
  const crust = new THREE.Mesh(crustGeometry, crustMaterial);
  crust.castShadow = true;
  crust.receiveShadow = true;
  
  // Pizza Base (Dough)
  const baseGeometry = new THREE.CylinderGeometry(1.7, 1.7, 0.15, 32);
  const baseMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xf5deb3,
    roughness: 0.4,
    metalness: 0.05
  });
  const base = new THREE.Mesh(baseGeometry, baseMaterial);
  base.position.y = 0.15;
  
  // Pizza Sauce
  const sauceGeometry = new THREE.CylinderGeometry(1.6, 1.6, 0.05, 32);
  const sauceMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xcc3300,
    roughness: 0.3,
    metalness: 0.1
  });
  const sauce = new THREE.Mesh(sauceGeometry, sauceMaterial);
  sauce.position.y = 0.25;
  
  // Cheese Layer
  const cheeseGeometry = new THREE.CylinderGeometry(1.5, 1.5, 0.08, 32);
  const cheeseMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xffd700,
    roughness: 0.2,
    metalness: 0.05
  });
  const cheese = new THREE.Mesh(cheeseGeometry, cheeseMaterial);
  cheese.position.y = 0.32;
  
  // Toppings (small spheres)
  const toppingsGroup = new THREE.Group();
  const toppingColors = [0x8b0000, 0x006400, 0x2f4f4f, 0xff6347, 0xdaa520];
  
  for (let i = 0; i < 25; i++) {
    const toppingGeometry = new THREE.SphereGeometry(0.1 + Math.random() * 0.1, 8, 8);
    const toppingMaterial = new THREE.MeshStandardMaterial({ 
      color: toppingColors[Math.floor(Math.random() * toppingColors.length)],
      roughness: 0.3
    });
    const topping = new THREE.Mesh(toppingGeometry, toppingMaterial);
    
    const angle = Math.random() * Math.PI * 2;
    const radius = 0.3 + Math.random() * 1.2;
    topping.position.x = Math.cos(angle) * radius;
    topping.position.z = Math.sin(angle) * radius;
    topping.position.y = 0.38 + Math.random() * 0.05;
    
    toppingsGroup.add(topping);
  }
  
  // Assemble Pizza
  pizza = new THREE.Group();
  pizza.add(crust);
  pizza.add(base);
  pizza.add(sauce);
  pizza.add(cheese);
  pizza.add(toppingsGroup);
  
  pizza.position.y = -0.5;
  scene.add(pizza);
  
  // Create a floating pizza slice
  createPizzaSlice();
}

function createPizzaSlice() {
  const sliceGroup = new THREE.Group();
  
  // Slice shape
  const sliceGeometry = new THREE.CylinderGeometry(0.8, 0.9, 0.25, 3, 1, false, 0, Math.PI * 0.6);
  const sliceMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xd4a574,
    roughness: 0.5
  });
  const slice = new THREE.Mesh(sliceGeometry, sliceMaterial);
  
  // Cheese on slice
  const cheeseSliceGeometry = new THREE.CylinderGeometry(0.7, 0.7, 0.1, 3, 1, false, 0, Math.PI * 0.6);
  const cheeseSliceMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xffd700,
    roughness: 0.2
  });
  const cheeseSlice = new THREE.Mesh(cheeseSliceGeometry, cheeseSliceMaterial);
  cheeseSlice.position.y = 0.15;
  
  sliceGroup.add(slice);
  sliceGroup.add(cheeseSlice);
  sliceGroup.position.set(2, 1.5, -1);
  sliceGroup.rotation.set(0.5, 0.3, 0.2);
  
  pizzaSlice = sliceGroup;
  scene.add(pizzaSlice);
}

function createParticles() {
  const particlesGroup = new THREE.Group();
  const particleGeometry = new THREE.SphereGeometry(0.05, 4, 4);
  
  for (let i = 0; i < 50; i++) {
    const particleMaterial = new THREE.MeshStandardMaterial({ 
      color: new THREE.Color(`hsl(${Math.random() * 60 + 20}, 80%, 60%)`),
      emissive: new THREE.Color(`hsl(${Math.random() * 60 + 20}, 80%, 30%)`),
      roughness: 0.3
    });
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    
    particle.position.x = (Math.random() - 0.5) * 8;
    particle.position.y = (Math.random() - 0.5) * 6;
    particle.position.z = (Math.random() - 0.5) * 4;
    
    particle.userData = {
      speed: 0.01 + Math.random() * 0.03,
      offset: Math.random() * Math.PI * 2,
      amplitude: 0.5 + Math.random() * 1.5
    };
    
    particles.push(particle);
    particlesGroup.add(particle);
  }
  
  scene.add(particlesGroup);
}

function animate() {
  requestAnimationFrame(animate);
  
  const time = Date.now() * 0.001;
  
  // Rotate pizza
  if (pizza) {
    pizza.rotation.y += 0.005;
    pizza.position.y = -0.5 + Math.sin(time * 0.8) * 0.2;
    
    // Mouse interaction
    pizza.rotation.x = mouseY * 0.2;
    pizza.rotation.z = mouseX * 0.1;
  }
  
  // Animate pizza slice
  if (pizzaSlice) {
    pizzaSlice.position.x = 2 + Math.sin(time * 1.2) * 0.5;
    pizzaSlice.position.y = 1.5 + Math.cos(time * 1.5) * 0.4;
    pizzaSlice.rotation.z += 0.01;
  }
  
  // Animate particles
  particles.forEach(particle => {
    particle.position.y += Math.sin(time + particle.userData.offset) * 0.005;
    particle.position.x += Math.cos(time * 0.7 + particle.userData.offset) * 0.003;
    particle.rotation.x += 0.01;
    particle.rotation.y += 0.01;
  });
  
  // Camera movement based on scroll
  const scrollY = window.scrollY || window.pageYOffset;
  camera.position.z = 5 - (scrollY * 0.001);
  camera.position.y = -(scrollY * 0.0005);
  
  renderer.render(scene, camera);
}

// Mouse tracking for 3D interaction
document.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth) * 2 - 1;
  mouseY = (e.clientY / window.innerHeight) * 2 - 1;
});

// Handle resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Create floating particles in DOM
function createFloatingParticles() {
  const container = document.getElementById('floatingParticles');
  const particleCount = 20;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 4 + 's';
    particle.style.animationDuration = 3 + Math.random() * 4 + 's';
    particle.style.width = 3 + Math.random() * 8 + 'px';
    particle.style.height = particle.style.width;
    
    const colors = ['#ff8c42', '#ffd700', '#ff6347', '#4caf50', '#ffa500'];
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    
    container.appendChild(particle);
  }
}

// GSAP Scroll Animations
function initScrollAnimations() {
  gsap.registerPlugin(ScrollTrigger);
  
  // Hero content animations on scroll
  gsap.to('.hero-text-content', {
    scrollTrigger: {
      trigger: '.hero-section',
      start: 'top top',
      end: 'bottom top',
      scrub: 1
    },
    y: -100,
    opacity: 0
  });
  
  // Pizza scales down on scroll
  gsap.to('.pizza-container', {
    scrollTrigger: {
      trigger: '.hero-section',
      start: 'top top',
      end: 'bottom top',
      scrub: 1
    },
    scale: 0.6,
    rotation: 45,
    opacity: 0.3
  });
  
  // Scroll indicator fades out
  gsap.to('.scroll-indicator', {
    scrollTrigger: {
      trigger: '.hero-section',
      start: 'top top',
      end: '20% top',
      scrub: 1
    },
    opacity: 0
  });
  
  // Food elements move on scroll
  gsap.to('.food-elements i', {
    scrollTrigger: {
      trigger: '.hero-section',
      start: 'top top',
      end: 'bottom top',
      scrub: 1
    },
    y: 200,
    rotation: 180
  });
  
  // Badge animation on load
  gsap.from('.hero-badge', {
    duration: 1,
    x: -100,
    opacity: 0,
    ease: 'back.out(1.7)'
  });
  
  // Stats counter animation
  gsap.from('.stat-item', {
    scrollTrigger: {
      trigger: '.hero-stats',
      start: 'top 80%'
    },
    scale: 0,
    opacity: 0,
    stagger: 0.2,
    duration: 0.8,
    ease: 'back.out(1.7)'
  });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
  initThreeJS();
  createFloatingParticles();
  initScrollAnimations();
  
  // CTA button interactions
  document.querySelector('.cta-primary').addEventListener('click', () => {
    document.querySelector('#menu-section').scrollIntoView({ 
      behavior: 'smooth' 
    });
  });
  
  document.querySelector('.cta-secondary').addEventListener('click', () => {
    alert('🍕 Watch our pizza-making video coming soon!');
  });
  
  // Parallax effect on scroll for background
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
      heroSection.style.backgroundPositionY = scrolled * 0.5 + 'px';
    }
  });
});

console.log('🍕 VIVIDO Fiza Palette - 3D Hero Section Ready!');


// menu section 
// Menu Section JavaScript
(function() {
  // Category Filtering
  const categoryButtons = document.querySelectorAll('.category-btn');
  const menuCards = document.querySelectorAll('.menu-card');
  const menuGrid = document.getElementById('menuGrid');
  
  // Filter menu items
  function filterMenu(category) {
    menuCards.forEach((card, index) => {
      const cardCategory = card.getAttribute('data-category');
      
      if (category === 'all' || cardCategory === category) {
        // Show card with animation
        card.classList.remove('hidden');
        card.style.transitionDelay = `${index * 0.05}s`;
        
        // Animate card entrance
        gsap.fromTo(card, 
          {
            opacity: 0,
            scale: 0.8,
            rotationY: -15,
            y: 50
          },
          {
            opacity: 1,
            scale: 1,
            rotationY: 0,
            y: 0,
            duration: 0.6,
            ease: 'back.out(1.7)',
            delay: index * 0.05
          }
        );
      } else {
        // Hide card with animation
        gsap.to(card, {
          opacity: 0,
          scale: 0.8,
          rotationY: 15,
          y: -50,
          duration: 0.4,
          ease: 'power2.in',
          onComplete: () => {
            card.classList.add('hidden');
          }
        });
      }
    });
  }
  
  // Category button click handler
  categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Update active button
      categoryButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Filter menu
      const category = button.getAttribute('data-category');
      filterMenu(category);
      
      // Button click animation
      gsap.fromTo(button, 
        { scale: 0.9 },
        { scale: 1, duration: 0.3, ease: 'back.out(1.7)' }
      );
    });
  });
  
  // 3D Tilt Effect on Cards
  menuCards.forEach(card => {
    const wrapper = card.querySelector('.card-3d-wrapper');
    
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / centerY * -10; // -10 to 10 degrees
      const rotateY = (x - centerX) / centerX * 10; // -10 to 10 degrees
      
      wrapper.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg) translateZ(30px)`;
      
      // Add glow effect based on mouse position
      const glowX = (x / rect.width) * 100;
      const glowY = (y / rect.height) * 100;
      wrapper.style.background = `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(255,140,66,0.1) 0%, transparent 60%)`;
    });
    
    card.addEventListener('mouseleave', () => {
      wrapper.style.transform = 'rotateY(0deg) rotateX(0deg) translateZ(0px)';
      wrapper.style.background = '';
      
      // Smooth reset
      gsap.to(wrapper, {
        rotationY: 0,
        rotationX: 0,
        duration: 0.5,
        ease: 'power2.out'
      });
    });
  });
  
  // Add to Cart Animation
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  
  addToCartButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
      e.stopPropagation();
      const itemId = button.getAttribute('data-item-id');

      gsap.fromTo(button,
        { scale: 0.8 },
        { scale: 1.1, duration: 0.2, ease: 'power2.out' }
      );
      gsap.to(button, { scale: 1, duration: 0.2, delay: 0.2, ease: 'power2.in' });

      const originalHTML = button.innerHTML;
      button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
      button.disabled = true;

      try {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ itemId }),
        });
        const json = await res.json();
        if (json.success) {
          button.innerHTML = '<i class="fas fa-check"></i> Added!';
          button.style.background = 'linear-gradient(135deg, #00c853, #00e676)';
          createParticleEffect(e);
        } else {
          button.innerHTML = '<i class="fas fa-times"></i> Failed';
          button.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
        }
      } catch (err) {
        button.innerHTML = '<i class="fas fa-check"></i> Added!';
        button.style.background = 'linear-gradient(135deg, #00c853, #00e676)';
        createParticleEffect(e);
      } finally {
        button.disabled = false;
        setTimeout(() => {
          button.innerHTML = originalHTML;
          button.style.background = '';
        }, 1500);
      }
    });
  });
  
  // Particle effect on add to cart
  function createParticleEffect(e) {
    const particleCount = 8;
    const colors = ['#ff8c42', '#ffd700', '#ff6347', '#4caf50', '#ff4500'];
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.style.position = 'fixed';
      particle.style.width = '8px';
      particle.style.height = '8px';
      particle.style.borderRadius = '50%';
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];
      particle.style.pointerEvents = 'none';
      particle.style.zIndex = '9999';
      particle.style.left = e.clientX + 'px';
      particle.style.top = e.clientY + 'px';
      
      document.body.appendChild(particle);
      
      const angle = (Math.PI * 2 * i) / particleCount;
      const velocity = 100 + Math.random() * 100;
      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity;
      
      gsap.to(particle, {
        x: tx,
        y: ty,
        opacity: 0,
        scale: 0,
        duration: 0.8 + Math.random() * 0.5,
        ease: 'power2.out',
        onComplete: () => {
          particle.remove();
        }
      });
    }
  }
  
  // Scroll-triggered animations for cards
  gsap.registerPlugin(ScrollTrigger);
  
  menuCards.forEach((card, index) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        end: 'bottom 15%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 100,
      rotationX: -15,
      duration: 0.8,
      delay: index * 0.1,
      ease: 'back.out(1.7)'
    });
  });
  
  // Category buttons animation
  gsap.from('.category-btn', {
    scrollTrigger: {
      trigger: '.menu-categories',
      start: 'top 90%'
    },
    opacity: 0,
    y: 30,
    duration: 0.5,
    stagger: 0.1,
    ease: 'power2.out'
  });
  
  // Menu header animation
  gsap.from('.menu-header', {
    scrollTrigger: {
      trigger: '.menu-header',
      start: 'top 90%'
    },
    opacity: 0,
    y: -50,
    duration: 1,
    ease: 'power2.out'
  });
  
  // View full menu button hover effect
  const viewFullMenu = document.querySelector('.view-full-menu');
  
  if (viewFullMenu) {
    viewFullMenu.addEventListener('mouseenter', () => {
      gsap.to(viewFullMenu, {
        scale: 1.05,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
    
    viewFullMenu.addEventListener('mouseleave', () => {
      gsap.to(viewFullMenu, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
    
    viewFullMenu.addEventListener('click', () => {
      // Add loading animation
      viewFullMenu.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
      
      setTimeout(() => {
        viewFullMenu.innerHTML = '<span>View Full Menu</span><i class="fas fa-arrow-right"></i>';
        alert('🍕 Full menu coming soon! Stay tuned for more delicious options.');
      }, 1500);
    });
  }
  
  // Background parallax effect on scroll
  window.addEventListener('scroll', () => {
    const menuSection = document.querySelector('.menu-section');
    const scrollPosition = window.pageYOffset;
    
    if (menuSection) {
      const circles = menuSection.querySelectorAll('.bg-circle');
      
      circles.forEach((circle, index) => {
        const speed = (index + 1) * 0.3;
        circle.style.transform = `translateY(${scrollPosition * speed * 0.1}px)`;
      });
    }
  });
  
  // Initial load animation
  filterMenu('all');
  
  console.log('🍕 VIVIDO Fiza Palette Menu - 3D Animated Menu Ready!');
})();



// Bar section 
// Bar Section - 3D Animation Script
(function() {
  // Three.js Setup
  let scene, camera, renderer, drinkGlass, liquid, bubbles = [];
  
  function initThreeJS() {
    const canvas = document.getElementById('barCanvas');
    
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    camera.position.y = 0.5;
    
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x7c3aed, 0.3);
    scene.add(ambientLight);
    
    const pointLight1 = new THREE.PointLight(0xa855f7, 1, 10);
    pointLight1.position.set(2, 2, 3);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xec4899, 0.8, 8);
    pointLight2.position.set(-2, -1, 2);
    scene.add(pointLight2);
    
    createDrinkGlass();
    createLiquid();
    createBubbles();
    
    animate();
  }
  
  function createDrinkGlass() {
    // Glass body
    const glassGeometry = new THREE.CylinderGeometry(0.8, 0.6, 2, 32, 1, true);
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.1,
      roughness: 0.1,
      transparent: true,
      opacity: 0.3,
      clearcoat: 1,
      clearcoatRoughness: 0.1
    });
    
    drinkGlass = new THREE.Mesh(glassGeometry, glassMaterial);
    drinkGlass.position.y = 0;
    scene.add(drinkGlass);
    
    // Glass rim
    const rimGeometry = new THREE.TorusGeometry(0.8, 0.05, 16, 32);
    const rimMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.5,
      roughness: 0.2,
      emissive: 0xa855f7,
      emissiveIntensity: 0.3
    });
    const rim = new THREE.Mesh(rimGeometry, rimMaterial);
    rim.position.y = 1;
    rim.rotation.x = Math.PI / 2;
    drinkGlass.add(rim);
    
    // Glass stem
    const stemGeometry = new THREE.CylinderGeometry(0.1, 0.15, 1.5, 16);
    const stemMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.1,
      roughness: 0.1,
      transparent: true,
      opacity: 0.4
    });
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    stem.position.y = -1.5;
    drinkGlass.add(stem);
    
    // Glass base
    const baseGeometry = new THREE.CylinderGeometry(0.5, 0.6, 0.2, 32);
    const baseMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.1,
      roughness: 0.1,
      transparent: true,
      opacity: 0.4
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = -2.3;
    drinkGlass.add(base);
  }
  
  function createLiquid() {
    const liquidGeometry = new THREE.CylinderGeometry(0.75, 0.6, 1.2, 32);
    const liquidMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xc084fc,
      metalness: 0.1,
      roughness: 0.2,
      transparent: true,
      opacity: 0.7,
      emissive: 0xa855f7,
      emissiveIntensity: 0.4
    });
    
    liquid = new THREE.Mesh(liquidGeometry, liquidMaterial);
    liquid.position.y = -0.3;
    scene.add(liquid);
  }
  
  function createBubbles() {
    for (let i = 0; i < 20; i++) {
      const bubbleGeometry = new THREE.SphereGeometry(0.05 + Math.random() * 0.1, 8, 8);
      const bubbleMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xe0e7ff,
        metalness: 0,
        roughness: 0,
        transparent: true,
        opacity: 0.6
      });
      
      const bubble = new THREE.Mesh(bubbleGeometry, bubbleMaterial);
      bubble.position.x = (Math.random() - 0.5) * 1;
      bubble.position.y = -0.5 + Math.random() * 1;
      bubble.position.z = (Math.random() - 0.5) * 0.5;
      
      bubble.userData = {
        speed: 0.005 + Math.random() * 0.01,
        offset: Math.random() * Math.PI * 2
      };
      
      bubbles.push(bubble);
      scene.add(bubble);
    }
  }
  
  function animate() {
    requestAnimationFrame(animate);
    
    const time = Date.now() * 0.001;
    
    // Rotate glass
    if (drinkGlass) {
      drinkGlass.rotation.y += 0.005;
      drinkGlass.position.y = Math.sin(time * 0.5) * 0.2;
    }
    
    // Animate liquid
    if (liquid) {
      liquid.rotation.y += 0.003;
      liquid.position.y = -0.3 + Math.sin(time * 0.8) * 0.1;
      liquid.material.emissiveIntensity = 0.3 + Math.sin(time * 2) * 0.2;
    }
    
    // Animate bubbles
    bubbles.forEach(bubble => {
      bubble.position.y += bubble.userData.speed;
      bubble.position.x += Math.sin(time + bubble.userData.offset) * 0.002;
      
      if (bubble.position.y > 0.8) {
        bubble.position.y = -0.5;
        bubble.position.x = (Math.random() - 0.5) * 1;
      }
    });
    
    // Mouse interaction
    if (drinkGlass) {
      drinkGlass.rotation.x = mouseY * 0.2;
      drinkGlass.rotation.z = mouseX * 0.1;
    }
    
    renderer.render(scene, camera);
  }
  
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = (e.clientY / window.innerHeight) * 2 - 1;
  });
  
  // Resize handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
  
  // Tab Filtering
  const tabButtons = document.querySelectorAll('.tab-btn');
  const drinkCards = document.querySelectorAll('.drink-card');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      const tab = button.getAttribute('data-tab');
      
let showIndex = 0;
      drinkCards.forEach((card) => {
        const category = card.getAttribute('data-category');

        if (category === tab) {
          card.classList.remove('hidden');
          gsap.fromTo(card,
            { opacity: 0, y: 20, rotateY: 8 },
            {
              opacity: 1, y: 0, rotateY: 0,
              duration: 0.45,
              delay: showIndex * 0.08,
              ease: 'back.out(1.7)',
              clearProps: 'all'
            }
          );
          showIndex++;
        } else {
          gsap.to(card, {
            opacity: 0, y: -10,
            duration: 0.25,
            clearProps: 'transform',
            onComplete: () => card.classList.add('hidden')
          });
        }
      });
    });
  });
  
  // Order Button Animation
  document.querySelectorAll('.order-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      
      const originalText = this.innerHTML;
      this.innerHTML = '<i class="fas fa-check"></i> Added!';
      this.style.background = 'linear-gradient(135deg, #10b981, #059669)';
      
      // Particle burst
      createBurstEffect(this);
      
      setTimeout(() => {
        this.innerHTML = originalText;
        this.style.background = '';
      }, 1500);
    });
  });
  
  function createBurstEffect(element) {
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    for (let i = 0; i < 12; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 8px;
        height: 8px;
        background: ${['#c084fc', '#a855f7', '#ec4899', '#fbbf24'][Math.floor(Math.random() * 4)]};
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        box-shadow: 0 0 10px currentColor;
      `;
      
      document.body.appendChild(particle);
      
      const angle = (Math.PI * 2 * i) / 12;
      gsap.to(particle, {
        x: Math.cos(angle) * 150,
        y: Math.sin(angle) * 150,
        opacity: 0,
        scale: 0,
        duration: 0.8,
        ease: 'power2.out',
        onComplete: () => particle.remove()
      });
    }
  }
  
  // Neon Particles
  function createNeonParticles() {
    const container = document.getElementById('neonParticles');
    const colors = ['#c084fc', '#a855f7', '#ec4899', '#6366f1', '#8b5cf6'];
    
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.className = 'neon-particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 4 + 's';
      particle.style.animationDuration = 3 + Math.random() * 5 + 's';
      particle.style.color = colors[Math.floor(Math.random() * colors.length)];
      
      container.appendChild(particle);
    }
  }
  
  // Card 3D Tilt
  document.querySelectorAll('.drink-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = (y - rect.height / 2) / rect.height * -15;
      const rotateY = (x - rect.width / 2) / rect.width * 15;
      
      card.style.transform = `translateX(10px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
  
  // Happy Hour Countdown
  function updateCountdown() {
    const now = new Date();
    const endTime = new Date();
    endTime.setHours(19, 0, 0, 0); // 7 PM
    
    if (now > endTime) {
      endTime.setDate(endTime.getDate() + 1);
    }
    
    const diff = endTime - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    const timer = document.getElementById('countdownTimer');
    if (timer) {
      timer.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
  }
  
  // Scroll Animations
  gsap.registerPlugin(ScrollTrigger);
  
  gsap.from('.bar-badge', {
    scrollTrigger: { trigger: '.bar-section', start: 'top 70%' },
    opacity: 0, y: -50, duration: 0.8, ease: 'back.out(1.7)'
  });
  
  gsap.from('.bar-title', {
    scrollTrigger: { trigger: '.bar-section', start: 'top 70%' },
    opacity: 0, x: -100, duration: 1, delay: 0.2, ease: 'power2.out'
  });
  
 // Only animate cards that are currently visible — never touch hidden ones
  gsap.from('.drink-card:not(.hidden)', {
    scrollTrigger: { trigger: '.drinks-container', start: 'top 80%', once: true },
    opacity: 0, y: 50, stagger: 0.15, duration: 0.6, ease: 'back.out(1.7)',
    clearProps: 'all'
  });
  
  // Initialize
  initThreeJS();
  createNeonParticles();
  updateCountdown();
  setInterval(updateCountdown, 1000);
  
  console.log('🍸 3D Bar Section Ready!');
})();


// events section 
// Events Section - 3D Animation Script
(function() {
  // Three.js Setup
  let scene, camera, renderer, particles = [];
  
  function initThreeJS() {
    const canvas = document.getElementById('eventsCanvas');
    
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x7c3aed, 0.3);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xa855f7, 1, 10);
    pointLight.position.set(0, 0, 3);
    scene.add(pointLight);
    
    createParticles();
    animate();
  }
  
  function createParticles() {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const colors = [];
    
    for (let i = 0; i < 200; i++) {
      vertices.push(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 5
      );
      
      colors.push(
        Math.random() * 0.8 + 0.2,
        Math.random() * 0.3,
        Math.random() * 0.8 + 0.2
      );
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
      size: 0.03,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity: 0.8
    });
    
    const points = new THREE.Points(geometry, material);
    particles.push(points);
    scene.add(points);
  }
  
  function animate() {
    requestAnimationFrame(animate);
    
    particles.forEach(particle => {
      particle.rotation.y += 0.001;
      particle.rotation.x += 0.0005;
    });
    
    renderer.render(scene, camera);
  }
  
  // Confetti Creation
  function createConfetti() {
    const container = document.getElementById('confettiContainer');
    const colors = ['#c084fc', '#a855f7', '#ec4899', '#f59e0b', '#6366f1', '#8b5cf6', '#fbbf24'];
    
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.animationDelay = Math.random() * 5 + 's';
      confetti.style.animationDuration = 3 + Math.random() * 5 + 's';
      confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.width = 4 + Math.random() * 8 + 'px';
      confetti.style.height = confetti.style.width;
      
      if (Math.random() > 0.5) {
        confetti.style.borderRadius = '50%';
      }
      
      container.appendChild(confetti);
    }
  }
  
  // Carousel Logic
  let currentEvent = 0;
  const totalEvents = 4;
  const eventCards = document.querySelectorAll('.event-card');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.getElementById('prevEvent');
  const nextBtn = document.getElementById('nextEvent');
  
  function updateCarousel(direction) {
    eventCards.forEach(card => {
      card.classList.remove('active', 'prev');
      card.style.opacity = '0';
      card.style.transform = 'scale(0.8) translateX(0) rotateY(0deg)';
    });
    
    if (direction === 'next') {
      eventCards[currentEvent].classList.add('prev');
      eventCards[currentEvent].style.opacity = '0';
      eventCards[currentEvent].style.transform = 'scale(0.8) translateX(-100%) rotateY(30deg)';
      
      currentEvent = (currentEvent + 1) % totalEvents;
      
      eventCards[currentEvent].classList.add('active');
      eventCards[currentEvent].style.opacity = '1';
      eventCards[currentEvent].style.transform = 'scale(1) translateX(0) rotateY(0deg)';
    } else {
      const prevEvent = currentEvent;
      currentEvent = (currentEvent - 1 + totalEvents) % totalEvents;
      
      eventCards[prevEvent].style.opacity = '0';
      eventCards[prevEvent].style.transform = 'scale(0.8) translateX(100%) rotateY(-30deg)';
      
      eventCards[currentEvent].classList.add('active');
      eventCards[currentEvent].style.opacity = '1';
      eventCards[currentEvent].style.transform = 'scale(1) translateX(0) rotateY(0deg)';
    }
    
    // Update dots
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentEvent);
    });
    
    // Animate active card
    const activeCard = eventCards[currentEvent];
    gsap.fromTo(activeCard.querySelector('.event-icon'), 
      { scale: 0.5, rotate: -180 },
      { scale: 1, rotate: 0, duration: 0.8, ease: 'back.out(1.7)' }
    );
    
    gsap.fromTo(activeCard.querySelectorAll('.feature'), 
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.4, stagger: 0.1, delay: 0.3 }
    );
    
    // Create burst effect
    createCarouselBurst();
  }
  
  function createCarouselBurst() {
    const activeCard = eventCards[currentEvent];
    const iconContainer = activeCard.querySelector('.event-icon-container');
    const rect = iconContainer.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    for (let i = 0; i < 15; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 6px;
        height: 6px;
        background: ${['#c084fc', '#a855f7', '#ec4899', '#fbbf24'][Math.floor(Math.random() * 4)]};
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        box-shadow: 0 0 15px currentColor;
      `;
      
      document.body.appendChild(particle);
      
      const angle = (Math.PI * 2 * i) / 15;
      gsap.to(particle, {
        x: Math.cos(angle) * 120,
        y: Math.sin(angle) * 120,
        opacity: 0,
        scale: 0,
        duration: 0.8,
        ease: 'power2.out',
        onComplete: () => particle.remove()
      });
    }
  }
  
  // Event Listeners
  prevBtn.addEventListener('click', () => updateCarousel('prev'));
  nextBtn.addEventListener('click', () => updateCarousel('next'));
  
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      if (index !== currentEvent) {
        const direction = index > currentEvent ? 'next' : 'prev';
        eventCards.forEach(card => {
          card.classList.remove('active', 'prev');
          card.style.opacity = '0';
          card.style.transform = 'scale(0.8) translateX(0) rotateY(0deg)';
        });
        
        currentEvent = index;
        
        eventCards[currentEvent].classList.add('active');
        eventCards[currentEvent].style.opacity = '1';
        eventCards[currentEvent].style.transform = 'scale(1) translateX(0) rotateY(0deg)';
        
        dots.forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
      }
    });
  });
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') updateCarousel('next');
    if (e.key === 'ArrowLeft') updateCarousel('prev');
  });
  
  // Auto-play carousel
  let autoplayInterval = setInterval(() => updateCarousel('next'), 5000);
  
  // Pause autoplay on hover
  const carouselContainer = document.querySelector('.events-carousel-container');
  carouselContainer.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
  carouselContainer.addEventListener('mouseleave', () => {
    autoplayInterval = setInterval(() => updateCarousel('next'), 5000);
  });
  
  // Touch swipe support
  let touchStartX = 0;
  let touchEndX = 0;
  
  carouselContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });
  
  carouselContainer.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) updateCarousel('next');
      else updateCarousel('prev');
    }
  });
  
  // Book button animation
  document.querySelectorAll('.book-event-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      
      const originalHTML = this.innerHTML;
      this.innerHTML = '<i class="fas fa-check"></i> Reserved!';
      this.style.background = 'linear-gradient(135deg, #10b981, #059669)';
      
      // Create burst effect
      const rect = this.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      
      for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
          position: fixed;
          left: ${x}px;
          top: ${y}px;
          width: 8px;
          height: 8px;
          background: ${['#10b981', '#34d399', '#6ee7b7', '#fbbf24'][Math.floor(Math.random() * 4)]};
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
        `;
        
        document.body.appendChild(particle);
        
        gsap.to(particle, {
          x: (Math.random() - 0.5) * 200,
          y: (Math.random() - 0.5) * 200,
          opacity: 0,
          scale: 0,
          duration: 0.8,
          ease: 'power2.out',
          onComplete: () => particle.remove()
        });
      }
      
      setTimeout(() => {
        this.innerHTML = originalHTML;
        this.style.background = '';
      }, 2000);
    });
  });
  
  // View all events button
  const viewAllBtn = document.querySelector('.view-all-btn');
  viewAllBtn.addEventListener('click', () => {
    viewAllBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    
    setTimeout(() => {
      viewAllBtn.innerHTML = '<span>View All Events</span><i class="fas fa-calendar-alt"></i><span class="btn-glow"></span>';
      alert('🎉 All events calendar coming soon!');
    }, 1500);
  });
  
  // 3D Card tilt effect
  document.querySelectorAll('.event-3d-container').forEach(container => {
    container.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = (y - rect.height / 2) / rect.height * -10;
      const rotateY = (x - rect.width / 2) / rect.width * 10;
      
      container.style.transform = `translateZ(20px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    container.addEventListener('mouseleave', () => {
      container.style.transform = 'translateZ(0px) rotateX(0deg) rotateY(0deg)';
    });
  });
  
  // Scroll Animations
  gsap.registerPlugin(ScrollTrigger);
  
  gsap.from('.events-header', {
    scrollTrigger: { trigger: '.events-section', start: 'top 70%' },
    opacity: 0, y: -80, duration: 1, ease: 'power2.out'
  });
  
  gsap.from('.event-card.active', {
    scrollTrigger: { trigger: '.events-wrapper', start: 'top 80%' },
    opacity: 0, scale: 0.8, duration: 1, ease: 'back.out(1.7)'
  });
  
  // Initialize
  initThreeJS();
  createConfetti();
  
  // Initialize first card
  eventCards[0].classList.add('active');
  eventCards[0].style.opacity = '1';
  eventCards[0].style.transform = 'scale(1) translateX(0) rotateY(0deg)';
  
  // Resize handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
  
  console.log('🎪 3D Events Section Ready!');
})();


// Gallery Section - 3D Animation Script (FIXED)
(function() {
  // Three.js Setup
  let scene, camera, renderer, particles;
  
  function initThreeJS() {
    const canvas = document.getElementById('galleryCanvas');
    if (!canvas) return;
    
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    const ambientLight = new THREE.AmbientLight(0x6366f1, 0.3);
    scene.add(ambientLight);
    
    const pointLight1 = new THREE.PointLight(0x6366f1, 0.8, 10);
    pointLight1.position.set(2, 1, 3);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xec4899, 0.6, 8);
    pointLight2.position.set(-2, -1, 2);
    scene.add(pointLight2);
    
    createGeometricParticles();
    animate();
  }
  
  function createGeometricParticles() {
    const particlesGroup = new THREE.Group();
    
    for (let i = 0; i < 30; i++) {
      const geometry = new THREE.BoxGeometry(0.05, 0.05, 0.05);
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(`hsl(${240 + Math.random() * 60}, 70%, 60%)`),
        emissive: new THREE.Color(`hsl(${240 + Math.random() * 60}, 70%, 30%)`),
        roughness: 0.3,
        metalness: 0.5
      });
      
      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4
      );
      cube.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      cube.userData = {
        rotSpeed: 0.01 + Math.random() * 0.03,
        floatSpeed: 0.005 + Math.random() * 0.01,
        floatOffset: Math.random() * Math.PI * 2
      };
      particlesGroup.add(cube);
    }
    
    for (let i = 0; i < 15; i++) {
      const geometry = new THREE.TorusGeometry(0.15 + Math.random() * 0.2, 0.02, 8, 16);
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(`hsl(${280 + Math.random() * 40}, 70%, 60%)`),
        emissive: new THREE.Color(`hsl(${280 + Math.random() * 40}, 70%, 30%)`),
        roughness: 0.2,
        metalness: 0.6
      });
      
      const ring = new THREE.Mesh(geometry, material);
      ring.position.set(
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 3
      );
      ring.userData = { rotSpeed: 0.02 + Math.random() * 0.04, floatSpeed: 0.003 + Math.random() * 0.008 };
      particlesGroup.add(ring);
    }
    
    particles = particlesGroup;
    scene.add(particlesGroup);
  }
  
  function animate() {
    requestAnimationFrame(animate);
    const time = Date.now() * 0.001;
    
    if (particles) {
      particles.children.forEach(child => {
        child.rotation.x += child.userData.rotSpeed || 0.01;
        child.rotation.y += child.userData.rotSpeed || 0.01;
        if (child.userData.floatSpeed) {
          child.position.y += Math.sin(time + child.userData.floatOffset) * child.userData.floatSpeed;
        }
      });
      particles.rotation.y += 0.001;
    }
    
    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  }
  
  // FIXED: All gallery items data for lightbox
  const galleryData = [
    { title: 'Signature Margherita', desc: 'Wood-fired perfection with fresh mozzarella, San Marzano tomatoes, basil, extra virgin olive oil', icon: 'fa-pizza-slice', gradient: 'linear-gradient(135deg, #dc2626, #991b1b)' },
    { title: 'Restaurant Interior', desc: 'Warm lighting, comfortable seating, and a sophisticated atmosphere for fine dining', icon: 'fa-building', gradient: 'linear-gradient(135deg, #7c3aed, #4c1d95)' },
    { title: 'Jazz Night', desc: 'An enchanting evening with live jazz performances and gourmet dining experience', icon: 'fa-music', gradient: 'linear-gradient(135deg, #ec4899, #9d174d)' },
    { title: 'Pasta Creation', desc: 'Creamy homemade pasta with parmesan, garlic, and fresh herbs', icon: 'fa-utensil-spoon', gradient: 'linear-gradient(135deg, #f59e0b, #b45309)' },
    { title: 'Happy Customers', desc: 'Creating unforgettable dining experiences for our valued guests', icon: 'fa-users', gradient: 'linear-gradient(135deg, #f97316, #9a3412)' },
    { title: 'Outdoor Seating', desc: 'Beautiful outdoor setting perfect for romantic evenings under the stars', icon: 'fa-sun', gradient: 'linear-gradient(135deg, #10b981, #047857)' },
    { title: 'Wine Tasting', desc: 'Premium beverages paired with artisanal cheeses and gourmet bites', icon: 'fa-wine-glass-alt', gradient: 'linear-gradient(135deg, #6366f1, #312e81)' },
    { title: 'Master Chef', desc: 'Our award-winning chef brings 25 years of Italian culinary expertise', icon: 'fa-user-chef', gradient: 'linear-gradient(135deg, #06b6d4, #155e75)' }
  ];
  
  let currentLightboxIndex = 0;
  
  // FIXED: Lightbox elements
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxOverlay = document.querySelector('.lightbox-overlay');
  
  // FIXED: Open lightbox safely
  function openLightbox(index) {
    if (!lightboxModal) return;
    
    currentLightboxIndex = index;
    const item = galleryData[index];
    
    document.getElementById('lightboxTitle').textContent = item.title;
    document.getElementById('lightboxDesc').textContent = item.desc;
    document.getElementById('lightboxImage').innerHTML = `<i class="fas ${item.icon}" style="font-size: 6rem; color: rgba(255,255,255,0.5);"></i>`;
    document.getElementById('lightboxImage').style.background = item.gradient;
    
    lightboxModal.style.display = 'flex';
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  // FIXED: Close lightbox safely
  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.style.display = 'none';
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  // FIXED: Navigate lightbox
  function navigateLightbox(direction) {
    const newIndex = (currentLightboxIndex + direction + galleryData.length) % galleryData.length;
    currentLightboxIndex = newIndex;
    const item = galleryData[newIndex];
    
    document.getElementById('lightboxTitle').textContent = item.title;
    document.getElementById('lightboxDesc').textContent = item.desc;
    document.getElementById('lightboxImage').innerHTML = `<i class="fas ${item.icon}" style="font-size: 6rem; color: rgba(255,255,255,0.5);"></i>`;
    document.getElementById('lightboxImage').style.background = item.gradient;
  }
  
  // FIXED: Lightbox event listeners
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); navigateLightbox(-1); });
  if (lightboxNext) lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); navigateLightbox(1); });
  
  // FIXED: Escape key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal && lightboxModal.classList.contains('active')) {
      closeLightbox();
    }
    if (e.key === 'ArrowLeft' && lightboxModal && lightboxModal.classList.contains('active')) {
      navigateLightbox(-1);
    }
    if (e.key === 'ArrowRight' && lightboxModal && lightboxModal.classList.contains('active')) {
      navigateLightbox(1);
    }
  });
  
  // FIXED: View More button click handlers
  document.querySelectorAll('.view-more-btn').forEach((btn, index) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      openLightbox(index);
    });
  });
  
  // FIXED: Card click to open lightbox
  document.querySelectorAll('.gallery-item').forEach((item, index) => {
    item.addEventListener('click', (e) => {
      // Don't open lightbox if clicking view more button
      if (e.target.closest('.view-more-btn')) return;
      openLightbox(index);
    });
  });
  
  // FIXED: Filter Functionality - Items start visible
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      const filter = button.getAttribute('data-filter');
      
      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        const show = filter === 'all' || category === filter;

        if (show) {
          item.classList.remove('hidden');
          item.classList.add('visible');
          item.style.position = '';
          item.style.visibility = '';
          // fade in via opacity only — never touch scale/transform
          item.style.opacity = '0';
          item.style.transition = 'opacity 0.4s ease';
          requestAnimationFrame(() => { item.style.opacity = '1'; });
        } else {
          item.style.opacity = '0';
          item.style.transition = 'opacity 0.3s ease';
          setTimeout(() => {
            item.classList.add('hidden');
            item.classList.remove('visible');
            item.style.position = 'absolute';
            item.style.visibility = 'hidden';
          }, 300);
        }
      });
    });
  });
  
   // 3D Card Tilt Effect - remove inline styles so CSS hover handles the flip cleanly
  document.querySelectorAll('.gallery-card-3d').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // Use CSS variable instead of inline transform so hover flip isn't broken
      card.style.setProperty('--tiltX', `${(y - rect.height / 2) / rect.height * -8}deg`);
      card.style.setProperty('--tiltY', `${(x - rect.width / 2) / rect.width * 8}deg`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--tiltX', '0deg');
      card.style.setProperty('--tiltY', '0deg');
    });
  });
  
  // Load More Button
  const loadMoreBtn = document.querySelector('.load-more-btn');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
      loadMoreBtn.disabled = true;
      
      setTimeout(() => {
        alert('📸 More photos coming soon! Our gallery is being updated with new content.');
        loadMoreBtn.innerHTML = '<span>Load More Photos</span><i class="fas fa-images"></i><span class="btn-shine"></span>';
        loadMoreBtn.disabled = false;
      }, 1500);
    });
  }
  
  // Lightbox action buttons
  document.getElementById('lightboxLike')?.addEventListener('click', function() {
    this.innerHTML = '<i class="fas fa-heart" style="color: #ec4899;"></i> Liked!';
    setTimeout(() => { this.innerHTML = '<i class="fas fa-heart"></i> Like'; }, 1500);
  });
  
  document.getElementById('lightboxShare')?.addEventListener('click', function() {
    this.innerHTML = '<i class="fas fa-check"></i> Shared!';
    setTimeout(() => { this.innerHTML = '<i class="fas fa-share"></i> Share'; }, 1500);
  });
  
  document.getElementById('lightboxDownload')?.addEventListener('click', function() {
    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';
    setTimeout(() => { this.innerHTML = '<i class="fas fa-check"></i> Done!'; }, 1500);
    setTimeout(() => { this.innerHTML = '<i class="fas fa-download"></i> Download'; }, 2500);
  });
  
  // Scroll Animations - safe: use 'from' only so items are always visible after animation
  if (typeof gsap !== 'undefined' && gsap.registerPlugin) {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from('.gallery-header', {
      scrollTrigger: { trigger: '.gallery-section', start: 'top 70%' },
      opacity: 0, y: -80, duration: 1, ease: 'power2.out'
    });

    // Ensure all gallery items visible before animation triggers
 document.querySelectorAll('.gallery-item').forEach((item, i) => {
      item.style.opacity = '0';
      item.style.transition = `opacity 0.5s ease ${i * 0.07}s`;
    });

    ScrollTrigger.create({
      trigger: '.gallery-grid',
      start: 'top 85%',
      once: true,
      onEnter: () => {
        document.querySelectorAll('.gallery-item').forEach(item => {
          item.style.opacity = '1';
        });
      }
    });
    }
  
  // Initialize
  initThreeJS();
  
  window.addEventListener('resize', () => {
    if (camera) {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    }
    if (renderer) {
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
  });
  
  console.log('🖼️ 3D Gallery Section Ready! (Fixed)');
})();


// Contact section 
// Contact Section - 3D Animation Script
(function() {
  // Three.js Setup
  let scene, camera, renderer, particleSystem;
  
  function initThreeJS() {
    const canvas = document.getElementById('contactCanvas');
    if (!canvas) return;
    
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x3b82f6, 0.3);
    scene.add(ambientLight);
    
    const pointLight1 = new THREE.PointLight(0x3b82f6, 0.8, 8);
    pointLight1.position.set(2, 2, 3);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0x06b6d4, 0.6, 6);
    pointLight2.position.set(-2, -1, 2);
    scene.add(pointLight2);
    
    createParticleSystem();
    animate();
  }
  
  function createParticleSystem() {
    const particleCount = 100;
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    
    for (let i = 0; i < particleCount; i++) {
      positions.push(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6
      );
      
      colors.push(
        Math.random() * 0.3 + 0.1,
        Math.random() * 0.5 + 0.3,
        Math.random() * 0.8 + 0.2
      );
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity: 0.8
    });
    
    particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);
    
    // Add floating rings
    for (let i = 0; i < 8; i++) {
      const ringGeometry = new THREE.TorusGeometry(0.3 + Math.random() * 0.5, 0.02, 8, 32);
      const ringMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(`hsl(${210 + Math.random() * 30}, 70%, 60%)`),
        emissive: new THREE.Color(`hsl(${210 + Math.random() * 30}, 70%, 30%)`),
        roughness: 0.2,
        metalness: 0.5
      });
      
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.position.set(
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 4
      );
      ring.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      ring.userData = {
        rotSpeed: 0.01 + Math.random() * 0.03,
        floatSpeed: 0.005 + Math.random() * 0.01,
        floatOffset: Math.random() * Math.PI * 2
      };
      
      scene.add(ring);
      
      // Store ring for animation
      if (!scene.userData) scene.userData = {};
      if (!scene.userData.rings) scene.userData.rings = [];
      scene.userData.rings.push(ring);
    }
  }
  
  function animate() {
    requestAnimationFrame(animate);
    
    const time = Date.now() * 0.001;
    
    if (particleSystem) {
      particleSystem.rotation.y += 0.002;
      particleSystem.rotation.x += 0.001;
    }
    
    // Animate rings
    if (scene.userData && scene.userData.rings) {
      scene.userData.rings.forEach(ring => {
        ring.rotation.x += ring.userData.rotSpeed;
        ring.rotation.y += ring.userData.rotSpeed * 0.7;
        ring.position.y += Math.sin(time + ring.userData.floatOffset) * ring.userData.floatSpeed;
      });
    }
    
    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  }
  
  // Form Submission
  const contactForm = document.getElementById('contactForm');
  const successMessage = document.getElementById('successMessage');
  
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !subject || !message) {
        shakeForm();
        return;
      }

      const submitBtn = contactForm.querySelector('.submit-btn-3d');
      const originalHTML = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;

      try {
        const payload = {
          name,
          email,
          phone: (document.getElementById('phone').value || '').trim(),
          subject,
          message,
        };
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const json = await res.json();

        if (json.success) {
          contactForm.style.display = 'none';
          if (successMessage) successMessage.classList.add('show');
          createCelebrationParticles();

          setTimeout(() => {
            contactForm.style.display = '';
            contactForm.reset();
            if (successMessage) successMessage.classList.remove('show');
            submitBtn.innerHTML = originalHTML;
            submitBtn.disabled = false;
          }, 4000);
        } else {
          submitBtn.innerHTML = originalHTML;
          submitBtn.disabled = false;
          shakeForm();
          alert(json.message || 'Failed to send message. Please try again.');
        }
      } catch (err) {
        submitBtn.innerHTML = originalHTML;
        submitBtn.disabled = false;
        shakeForm();
        alert('Network error. Please check your connection and try again.');
      }
    });
  }
  
  function shakeForm() {
    const formContainer = document.querySelector('.form-container-3d');
    if (!formContainer) return;
    
    gsap.fromTo(formContainer,
      { x: -10 },
      { 
        x: 10, 
        duration: 0.1, 
        repeat: 5, 
        yoyo: true, 
        ease: 'power2.inOut',
        onComplete: () => {
          gsap.to(formContainer, { x: 0, duration: 0.1 });
        }
      }
    );
  }
  
  function createCelebrationParticles() {
    const formContainer = document.querySelector('.form-container-3d');
    if (!formContainer) return;
    
    const rect = formContainer.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const colors = ['#3b82f6', '#60a5fa', '#06b6d4', '#10b981', '#6366f1', '#8b5cf6'];
    
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: fixed;
        left: ${centerX}px;
        top: ${centerY}px;
        width: ${6 + Math.random() * 8}px;
        height: ${6 + Math.random() * 8}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        box-shadow: 0 0 10px currentColor;
      `;
      
      document.body.appendChild(particle);
      
      const angle = Math.random() * Math.PI * 2;
      const distance = 100 + Math.random() * 200;
      
      gsap.to(particle, {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance - 100,
        opacity: 0,
        scale: 0,
        duration: 1 + Math.random() * 1.5,
        ease: 'power2.out',
        onComplete: () => particle.remove()
      });
    }
  }
  
  // Info Card 3D Tilt
  document.querySelectorAll('.info-card-3d').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = (y - rect.height / 2) / rect.height * -15;
      const rotateY = (x - rect.width / 2) / rect.width * 15;
      
      card.querySelector('.info-card-inner').style.transform = 
        `translateZ(15px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.querySelector('.info-card-inner').style.transform = 
        'translateZ(0px) rotateX(0deg) rotateY(0deg)';
    });
  });
  
  // Social Button Effects
  document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Ripple effect
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: rgba(59, 130, 246, 0.4);
        animation: rippleOut 0.6s ease-out;
      `;
      
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
      
      // Pulse animation
      gsap.fromTo(btn,
        { scale: 1 },
        { scale: 1.3, duration: 0.2, yoyo: true, repeat: 1 }
      );
    });
  });
  
  // Add ripple animation style
  const style = document.createElement('style');
  style.textContent = `
    @keyframes rippleOut {
      from { transform: scale(1); opacity: 1; }
      to { transform: scale(2); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
  
  // Map Click
  document.querySelector('.map-placeholder')?.addEventListener('click', () => {
    const mapIcon = document.querySelector('.map-icon');
    if (mapIcon) {
      gsap.fromTo(mapIcon,
        { scale: 1 },
        { scale: 1.5, duration: 0.3, yoyo: true, repeat: 1 }
      );
    }
    alert('🗺️ Map feature coming soon! Find us at 123 Gourmet Street, Little Italy, NY 10013');
  });
  
  // Input focus animations
  document.querySelectorAll('.input-wrapper input, .input-wrapper textarea, .input-wrapper select').forEach(input => {
    input.addEventListener('focus', () => {
      const wrapper = input.closest('.input-wrapper');
      gsap.to(wrapper, {
        scale: 1.02,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
    
    input.addEventListener('blur', () => {
      const wrapper = input.closest('.input-wrapper');
      gsap.to(wrapper, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
  });
  
  // Scroll Animations
  if (typeof gsap !== 'undefined') {
    gsap.from('.contact-header', {
      scrollTrigger: { trigger: '.contact-section', start: 'top 70%' },
      opacity: 0, y: -60, duration: 0.8, ease: 'power2.out'
    });
    
    gsap.from('.form-container-3d', {
      scrollTrigger: { trigger: '.contact-form-side', start: 'top 75%' },
      opacity: 0, x: 80, rotationY: 15, duration: 1, ease: 'back.out(1.7)'
    });
    
    gsap.from('.social-btn', {
      scrollTrigger: { trigger: '.social-links-3d', start: 'top 85%' },
      opacity: 0, y: 40, stagger: 0.1, duration: 0.6, ease: 'back.out(1.7)'
    });
    
    gsap.from('.map-container-3d', {
      scrollTrigger: { trigger: '.map-container-3d', start: 'top 85%' },
      opacity: 0, y: 50, scale: 0.9, duration: 0.8, ease: 'back.out(1.7)'
    });
  }
  
  // Initialize
  initThreeJS();
  
  window.addEventListener('resize', () => {
    if (camera) {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    }
    if (renderer) {
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
  });
  
  console.log('📬 3D Contact Section Ready!');
})();
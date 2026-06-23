const categories = [
  { id: 'all', label: 'All', icon: 'fa-star' },
  { id: 'pizza', label: 'Pizza', icon: 'fa-pizza-slice' },
  { id: 'pasta', label: 'Pasta', icon: 'fa-utensil-spoon' },
  { id: 'drinks', label: 'Drinks', icon: 'fa-wine-glass-alt' },
  { id: 'desserts', label: 'Desserts', icon: 'fa-ice-cream' }
];

const menuItems = [
  {
    id: 1,
    category: 'pizza',
    icon: 'fa-pizza-slice',
    name: 'Margherita Royale',
    description: 'San Marzano tomatoes, fresh mozzarella, basil, extra virgin olive oil.',
    price: 18.99,
    badge: { label: 'Best Seller', icon: 'fa-fire', type: 'hot' },
    image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 2,
    category: 'pizza',
    icon: 'fa-pizza-slice',
    name: 'Pepperoni Passion',
    description: 'Double pepperoni, smoked provolone, spicy tomato sauce, oregano.',
    price: 22.99,
    badge: { label: 'New', icon: 'fa-sparkles', type: 'new' },
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 3,
    category: 'pizza',
    icon: 'fa-pizza-slice',
    name: 'Truffle Mushroom',
    description: 'Wild mushrooms, black truffle, fontina, thyme, garlic cream.',
    price: 26.99,
    image: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 4,
    category: 'pizza',
    icon: 'fa-pizza-slice',
    name: 'Diavola Inferno',
    description: 'Spicy salami, chili flakes, hot honey, red onions, mozzarella.',
    price: 21.99,
    badge: { label: 'Spicy', icon: 'fa-fire', type: 'hot' },
    image: 'https://images.unsplash.com/photo-1548369937-47519962c11a?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 5,
    category: 'pasta',
    icon: 'fa-utensil-spoon',
    name: 'Fettuccine Alfredo',
    description: 'Homemade pasta, parmesan cream, garlic, butter, black pepper.',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 6,
    category: 'pasta',
    icon: 'fa-utensil-spoon',
    name: 'Lobster Ravioli',
    description: 'Lobster filled pasta, saffron cream, cherry tomatoes, basil.',
    price: 32.99,
    badge: { label: 'Popular', icon: 'fa-sparkles', type: 'new' },
    image: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 7,
    category: 'drinks',
    icon: 'fa-wine-glass-alt',
    name: 'Italian Red Wine',
    description: 'Chianti Classico, cherry notes, aged oak, full-bodied.',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 8,
    category: 'drinks',
    icon: 'fa-cocktail',
    name: 'Aperol Spritz',
    description: 'Aperol, prosecco, soda, fresh orange, refreshing classic.',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 9,
    category: 'desserts',
    icon: 'fa-ice-cream',
    name: 'Tiramisu Classico',
    description: 'Mascarpone, espresso, cocoa, ladyfingers, Italian tradition.',
    price: 11.99,
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 10,
    category: 'desserts',
    icon: 'fa-ice-cream',
    name: 'Cannoli Siciliani',
    description: 'Crispy shell, sweet ricotta, pistachio, chocolate chips.',
    price: 10.99,
    badge: { label: 'Signature', icon: 'fa-crown', type: 'hot' },
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80'
  }
];

const galleryFilters = [
  { id: 'all', label: 'All', icon: 'fa-th-large' },
  { id: 'food', label: 'Food', icon: 'fa-utensils' },
  { id: 'ambiance', label: 'Ambiance', icon: 'fa-building' },
  { id: 'events', label: 'Events', icon: 'fa-calendar-check' },
  { id: 'people', label: 'People', icon: 'fa-users' }
];

const galleryItems = [
  {
    category: 'food',
    icon: 'fa-pizza-slice',
    title: 'Signature Margherita',
    subtitle: 'Wood-fired perfection',
    backTitle: 'Margherita Royale',
    description: 'Fresh mozzarella, San Marzano tomatoes, basil, extra virgin olive oil.',
    likes: '2.4k',
    views: '5.8k',
    badge: { label: 'Featured', icon: 'fa-star', type: '' },
    imageClass: 'food-1',
    gradient: 'linear-gradient(135deg, #dc2626, #991b1b)'
  },
  {
    category: 'ambiance',
    icon: 'fa-building',
    title: 'Restaurant Interior',
    subtitle: 'Elegant dining space',
    backTitle: 'Main Dining Area',
    description: 'Warm lighting, comfortable seating, and a sophisticated atmosphere.',
    likes: '3.1k',
    views: '7.2k',
    badge: { label: 'New', icon: 'fa-sparkles', type: 'new' },
    imageClass: 'ambiance-1',
    gradient: 'linear-gradient(135deg, #7c3aed, #4c1d95)'
  },
  {
    category: 'events',
    icon: 'fa-music',
    title: 'Jazz Night',
    subtitle: 'Live music experience',
    backTitle: 'Jazz Under Stars',
    description: 'An enchanting evening with live jazz performances and gourmet dining.',
    likes: '4.5k',
    views: '9.1k',
    badge: { label: 'Popular', icon: 'fa-fire', type: 'popular' },
    imageClass: 'events-1',
    gradient: 'linear-gradient(135deg, #ec4899, #9d174d)'
  },
  {
    category: 'food',
    icon: 'fa-utensil-spoon',
    title: 'Pasta Creation',
    subtitle: 'Homemade delicacy',
    backTitle: 'Fettuccine Alfredo',
    description: 'Creamy homemade pasta with parmesan, garlic, and fresh herbs.',
    likes: '1.8k',
    views: '4.3k',
    imageClass: 'food-2',
    gradient: 'linear-gradient(135deg, #f59e0b, #b45309)'
  },
  {
    category: 'people',
    icon: 'fa-users',
    title: 'Happy Customers',
    subtitle: 'Memorable moments',
    backTitle: 'Customer Joy',
    description: 'Creating unforgettable dining experiences for our valued guests.',
    likes: '5.2k',
    views: '11.3k',
    badge: { label: 'Loved', icon: 'fa-heart', type: '' },
    imageClass: 'people-1',
    gradient: 'linear-gradient(135deg, #f97316, #9a3412)'
  },
  {
    category: 'ambiance',
    icon: 'fa-sun',
    title: 'Outdoor Seating',
    subtitle: 'Al fresco dining',
    backTitle: 'Terrace Dining',
    description: 'Beautiful outdoor setting perfect for romantic evenings.',
    likes: '2.9k',
    views: '6.7k',
    imageClass: 'ambiance-2',
    gradient: 'linear-gradient(135deg, #10b981, #047857)'
  },
  {
    category: 'events',
    icon: 'fa-wine-glass-alt',
    title: 'Wine Tasting',
    subtitle: 'Exclusive evening',
    backTitle: 'Grand Tasting Event',
    description: 'Premium beverages paired with artisanal cheeses and gourmet bites.',
    likes: '3.7k',
    views: '8.4k',
    badge: { label: 'Recent', icon: 'fa-sparkles', type: 'new' },
    imageClass: 'events-2',
    gradient: 'linear-gradient(135deg, #6366f1, #312e81)'
  },
  {
    category: 'people',
    icon: 'fa-user-chef',
    title: 'Master Chef',
    subtitle: 'Culinary artistry',
    backTitle: 'Chef Marco Rossi',
    description: 'Our award-winning chef brings 25 years of Italian culinary expertise.',
    likes: '6.8k',
    views: '14.2k',
    badge: { label: 'Chef', icon: 'fa-crown', type: 'popular' },
    imageClass: 'people-2',
    gradient: 'linear-gradient(135deg, #06b6d4, #155e75)'
  }
];

module.exports = {
  categories,
  menuItems,
  galleryFilters,
  galleryItems
};

const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const { categories, menuItems, galleryFilters, galleryItems } = require('./data/siteData');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static assets by explicit directory
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js',  express.static(path.join(__dirname, 'js')));
app.use('/images', express.static(path.join(__dirname, 'images')));

// Helpers
async function appendRecord(fileName, record) {
  const filePath = path.join(DATA_DIR, fileName);
  await fs.mkdir(DATA_DIR, { recursive: true });
  let existing = [];
  try {
    existing = JSON.parse(await fs.readFile(filePath, 'utf8'));
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }
  const saved = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    createdAt: new Date().toISOString(),
    ...record,
  };
  existing.push(saved);
  await fs.writeFile(filePath, JSON.stringify(existing, null, 2));
  return saved;
}

function requireFields(body, fields) {
  const missing = fields.filter(f => !String(body[f] || '').trim());
  if (missing.length) {
    const err = new Error('Missing required fields: ' + missing.join(', '));
    err.statusCode = 400;
    throw err;
  }
}

function asyncRoute(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

// Pages
app.get('/', (req, res) => {
  res.render('index', {
    title: 'VIVIDO | Italian Restaurant',
    categories,
    menuItems,
    galleryFilters,
    galleryItems,
  });
});

// API: Menu
app.get('/api/menu', (req, res) => {
  const { category } = req.query;
  const items = (category && category !== 'all')
    ? menuItems.filter(i => i.category === category)
    : menuItems;
  res.json({ success: true, items });
});

// API: Gallery
app.get('/api/gallery', (req, res) => {
  const { category } = req.query;
  const items = (category && category !== 'all')
    ? galleryItems.filter(i => i.category === category)
    : galleryItems;
  res.json({ success: true, items });
});

// API: Contact
app.post('/api/contact', asyncRoute(async (req, res) => {
  requireFields(req.body, ['name', 'email', 'subject', 'message']);
  const record = await appendRecord('messages.json', {
    name:    req.body.name.trim(),
    email:   req.body.email.trim(),
    phone:   (req.body.phone || '').trim(),
    subject: req.body.subject.trim(),
    message: req.body.message.trim(),
  });
  res.status(201).json({
    success: true,
    message: "Thanks for reaching out! We'll reply within 24 hours.",
    data: record,
  });
}));

// API: Reservations
app.post('/api/reservations', asyncRoute(async (req, res) => {
  requireFields(req.body, ['name', 'email', 'date', 'time', 'guests']);
  const record = await appendRecord('reservations.json', {
    name:   req.body.name.trim(),
    email:  req.body.email.trim(),
    phone:  (req.body.phone || '').trim(),
    date:   req.body.date.trim(),
    time:   req.body.time.trim(),
    guests: Number(req.body.guests),
    notes:  (req.body.notes || '').trim(),
  });
  res.status(201).json({
    success: true,
    message: `Table booked for ${record.guests} guest(s) on ${record.date} at ${record.time}. Confirmation sent to ${record.email}.`,
    data: record,
  });
}));

// API: Orders (add to cart)
app.post('/api/orders', asyncRoute(async (req, res) => {
  requireFields(req.body, ['itemId']);
  const item = menuItems.find(i => i.id === Number(req.body.itemId));
  if (!item) return res.status(404).json({ success: false, message: 'Menu item not found.' });
  const record = await appendRecord('orders.json', {
    itemId:   item.id,
    itemName: item.name,
    category: item.category,
    price:    item.price,
  });
  res.status(201).json({
    success: true,
    message: item.name + ' added to your order!',
    data: record,
  });
}));

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.statusCode ? err.message : 'Something went wrong on our end.',
  });
});

app.listen(PORT, () => {
  console.log('VIVIDO restaurant running at http://localhost:' + PORT);
});

// server.js - Express app: public site + admin panel.
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const path = require('path');
const store = require('./data');
const resources = require('./resources');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'purapaw-admin-secret-2024',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 8 }
}));

// ---- helpers ----
function isAuth(req) { return !!req.session.user; }
function requireAuth(req, res, next) {
  if (isAuth(req)) return next();
  return res.redirect('/admin/login');
}
function marqueeArr(s) {
  if (Array.isArray(s)) return s;
  return String(s).split('-').map(function (x) { return x.trim(); }).filter(Boolean);
}

// ---- public homepage ----
app.get('/', function (req, res) {
  const data = store.get();
  data.settings._marquee = marqueeArr(data.settings.marquee);
  res.render('index', { d: data, authed: isAuth(req), flash: null });
});

// ---- public contact form submit ----
app.post('/submit-inquiry', function (req, res) {
  const data = store.get();
  const inq = {
    name: (req.body.name || '').slice(0, 120),
    email: (req.body.email || '').slice(0, 160),
    product: (req.body.product || '').slice(0, 120),
    tonnage: (req.body.tonnage || '').slice(0, 60),
    message: (req.body.message || '').slice(0, 2000),
    createdAt: new Date().toISOString()
  };
  data.inquiries.push(inq);
  store.save(data);
  data.settings._marquee = marqueeArr(data.settings.marquee);
  res.render('index', { d: data, authed: isAuth(req), flash: 'Thank you! We received your inquiry and will reply within 24 hours.' });
});

// ---- admin auth ----
const ADMIN_USER = 'admin';
const ADMIN_PASS_HASH = bcrypt.hashSync('admin123', 10); // default password

app.get('/admin/login', function (req, res) {
  if (isAuth(req)) return res.redirect('/admin');
  res.render('admin/login', { error: null });
});

app.post('/admin/login', function (req, res) {
  const u = req.body.username || '';
  const p = req.body.password || '';
  if (u === ADMIN_USER && bcrypt.compareSync(p, ADMIN_PASS_HASH)) {
    req.session.user = u;
    return res.redirect('/admin');
  }
  res.render('admin/login', { error: 'Wrong username or password.' });
});

app.post('/admin/logout', function (req, res) {
  req.session.destroy(function () { res.redirect('/admin/login'); });
});

// ---- admin dashboard ----
app.get('/admin', requireAuth, function (req, res) {
  const data = store.get();
  res.render('admin/dashboard', { d: data, resources: resources, user: req.session.user });
});

// ---- settings edit ----
app.get('/admin/settings', requireAuth, function (req, res) {
  const data = store.get();
  res.render('admin/settings', { d: data, resources: resources, user: req.session.user, flash: null });
});
app.post('/admin/settings', requireAuth, function (req, res) {
  const data = store.get();
  Object.keys(req.body).forEach(function (k) {
    data.settings[k] = req.body[k];
  });
  store.save(data);
  res.render('admin/settings', { d: data, resources: resources, user: req.session.user, flash: 'Settings saved.' });
});

// ---- generic resource list ----
app.get('/admin/:resource', requireAuth, function (req, res) {
  const key = req.params.resource;
  const cfg = resources[key];
  if (!cfg) return res.status(404).send('Not found');
  const data = store.get();
  const items = data[key] || [];
  res.render('admin/resource', { d: data, key: key, cfg: cfg, items: items, resources: resources, user: req.session.user, flash: null });
});

// ---- generic create ----
app.post('/admin/:resource/create', requireAuth, function (req, res) {
  const key = req.params.resource;
  const cfg = resources[key];
  if (!cfg) return res.status(404).send('Not found');
  const data = store.get();
  const items = data[key] || [];
  const maxId = items.reduce(function (m, it) { return Math.max(m, it.id || 0); }, 0);
  const item = { id: maxId + 1 };
  cfg.fields.forEach(function (f) {
    if (f.type === 'list') {
      item[f.name] = String(req.body[f.name] || '').split('\n').map(function (x) { return x.trim(); }).filter(Boolean);
    } else if (f.type === 'checkbox') {
      item[f.name] = req.body[f.name] === 'on';
    } else if (f.type === 'number') {
      item[f.name] = Number(req.body[f.name]) || 0;
    } else {
      item[f.name] = req.body[f.name] || '';
    }
  });
  items.push(item);
  data[key] = items;
  store.save(data);
  res.redirect('/admin/' + key);
});

// ---- generic update ----
app.post('/admin/:resource/:id/update', requireAuth, function (req, res) {
  const key = req.params.resource;
  const id = Number(req.params.id);
  const cfg = resources[key];
  if (!cfg) return res.status(404).send('Not found');
  const data = store.get();
  const items = data[key] || [];
  const idx = items.findIndex(function (it) { return it.id === id; });
  if (idx === -1) return res.redirect('/admin/' + key);
  cfg.fields.forEach(function (f) {
    if (f.type === 'list') {
      items[idx][f.name] = String(req.body[f.name] || '').split('\n').map(function (x) { return x.trim(); }).filter(Boolean);
    } else if (f.type === 'checkbox') {
      items[idx][f.name] = req.body[f.name] === 'on';
    } else if (f.type === 'number') {
      items[idx][f.name] = Number(req.body[f.name]) || 0;
    } else {
      items[idx][f.name] = req.body[f.name] || '';
    }
  });
  data[key] = items;
  store.save(data);
  res.redirect('/admin/' + key);
});

// ---- generic delete ----
app.post('/admin/:resource/:id/delete', requireAuth, function (req, res) {
  const key = req.params.resource;
  const id = Number(req.params.id);
  const cfg = resources[key];
  if (!cfg) return res.status(404).send('Not found');
  const data = store.get();
  data[key] = (data[key] || []).filter(function (it) { return it.id !== id; });
  store.save(data);
  res.redirect('/admin/' + key);
});

app.listen(PORT, '0.0.0.0', function () {
  console.log('PuraPaw running at http://0.0.0.0:' + PORT);
});

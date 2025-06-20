// Importuri esențiale
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { Sequelize, where } = require('sequelize');

// Importuri locale
const sequelize = require('./config/db');
const Plangeri = require('./Models/PLANGERII');
const Comentarii = require('./Models/Comentarii');
const sendEmail = require('./utils/emailer');
const setupAssociations = require('./config/association');

// Configurează relațiile dintre modelele Sequelize
setupAssociations();

const app = express();
const port = 3000;

// Configuri de cale
const credsPath = './creds.json';
const viewsPath = path.join(__dirname, '../jews');
const assetsPath = path.join(__dirname, '../jews/assets');

// Middleware global pentru logare rute
app.use((req, res, next) => {
  console.log(`Requested path: ${req.path}`);
  next();
});

// Middleware pentru parse request body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware CORS
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Middleware pentru cookie-uri și sesiuni
app.use(cookieParser());
app.use(session({
  secret: 'ACEST_MELODIE_ESTE_PENTRU_ALEX_PRENDESCU_CARE_AGATA_ORICE_TRUP_DE_FEMEIE_NUMAI_CU_BARBA_LUI',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // Schimbă în true în producție cu HTTPS
    maxAge: 24 * 60 * 60 * 1000, // 24 ore
    sameSite: 'Lax'
  }
}));

// Configurare view engine și directoare statice
app.set('view engine', 'ejs');
app.set('views', viewsPath);
app.use('/assets', express.static(assetsPath));

// Setare header pentru fișiere JS
app.use(express.static(viewsPath, {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

// Middleware de autentificare
function checkAuth(req, res, next) {
  if (!req.session.authenticated || !req.session.userId) {
    return res.status(403).send('Access denied. Please login first.');
  }
  next();
}

// RUTĂ: Pagina de autentificare
app.get('/crocoanonim', (req, res) => {
  if (req.session.authenticated) {
    return res.redirect('/crocoanonim/home');
  }
  res.sendFile(path.join(viewsPath, 'homepage.html'));
});

// RUTĂ: Pagina principală după autentificare
app.get('/crocoanonim/home', (req, res) => {
  res.sendFile(path.join(viewsPath, 'main_page.html'));
});

// RUTĂ: Autentificare (login)
app.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;
    const credsData = fs.readFileSync(credsPath, 'utf8');
    const credsJSON = JSON.parse(credsData);

    const user = credsJSON.users.find(u => u.username === username && u.password === password);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'mai baga o fisa'
      });
    }

    // Setare sesiune
    req.session.authenticated = true;
    req.session.userId = user.id;
    req.session.username = user.username;

    res.json({
      success: true,
      userId: user.id,
      redirect: '/crocoanonim/home'
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'NOI AM BELITO IDK AIA E' });
  }
});

// RUTĂ: Afișare plângeri publice
app.get('/crocoanonim/Plangeri', checkAuth, async (req, res) => {
  try {
    const plangeri = await Plangeri.findAll({
      where: {
        departament: 5,
        private: false
      },
      order: [['id_plangere', 'DESC']]
    });

    res.render('Plangeri', { plangeri });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error');
  }
});

// RUTĂ: Afișare plângere publică după ID
app.get('/crocoanonim/plangere/:id', checkAuth, async (req, res) => {
  try {
    const id = req.params.id;
    const plangere = await Plangeri.findByPk(id, {
      include: [{
        model: Comentarii,
        as: 'comentarii',
        required: false
      }]
    });

    if (!plangere) return res.status(404).send('Plângere nu a fost găsită.');
    if (plangere.private === true) return res.status(403).send('Această plângere este privată.');

    res.render('Plangere_plangere', {
      plangere: plangere.get({ plain: true }),
      comentarii: plangere.comentarii
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Eroare server.');
  }
});

// RUTĂ: Afișare plângere privată după UUID
app.get('/crocoanonim/plangere/privat/:uuid', checkAuth, async (req, res) => {
  try {
    const uuid = req.params.uuid;
    const plangere = await Plangeri.findOne({ where: { uuid } });

    if (!plangere) return res.status(404).send('Plângerea nu a fost găsită.');

    res.render('Plangere_plangere', {
      plangere: plangere.get({ plain: true }),
      comentarii: plangere.comentarii
    });
  } catch (error) {
    console.error('Eroare:', error);
    res.status(500).send('Eroare server.');
  }
});

// RUTĂ: Formular creare plângere
app.get('/crocoanonim/creazaplangere', checkAuth, (req, res) => {
  res.sendFile(path.join(viewsPath, 'creazaPlangere.html'));
});

// RUTĂ: Procesare creare plângere nouă
app.post('/crocoanonim/creazaplangere', checkAuth, async (req, res) => {
  try {
    const { titlu, scurta_descriere, descriere, isPrivate } = req.body;

    if (!titlu?.trim() || !scurta_descriere?.trim() || !descriere?.trim() || typeof isPrivate !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'Toate câmpurile sunt obligatorii'
      });
    }

    const uuid = uuidv4();
    const newPlangere = await Plangeri.create({
      departament: 5,
      titlu: titlu.trim(),
      short_description: scurta_descriere.trim(),
      description: descriere.trim(),
      created_by: req.session.userId,
      created_at: new Date(),
      private: isPrivate,
      uuid
    });

    // Trimitere email asincron (fără a aștepta)

    const redirectUrl = isPrivate
      ? `/crocoanonim/Plangere/privat/${uuid}`
      : `/crocoanonim/Plangere/${newPlangere.id_plangere}`;

    return res.json({
      success: true,
      message: 'Plângerea a fost înregistrată cu succes!',
      redirectUrl
    });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({
      success: false,
      message: 'Eroare server'
    });
  }
});

// RUTĂ: Adăugare comentariu la o plângere
app.post('/crocoanonim/plangeri/:id/comentarii', checkAuth, async (req, res) => {
  try {
    const { content, username, culoare } = req.body;
    const plangereId = req.params.id;

    if (!content) {
      return res.status(400).json({ success: false, message: 'Conținutul comentariului este obligatoriu' });
    }

    const newComment = await Comentarii.create({
      id_plangere: plangereId,
      description: content,
      created_by: req.session.userId,
      username,
      created_at: new Date(),
      culoare
    });

    // Trimitere email de notificare
  

    res.redirect(`/crocoanonim/plangere/${plangereId}`);
  } catch (error) {
    console.error('Eroare comentariu:', error);
    res.status(500).json({
      success: false,
      message: 'Eroare server'
    });
  }
});
// Pornire server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}/crocoanonim`);
});

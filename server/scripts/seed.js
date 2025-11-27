const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const { query, init } = require('../db/database');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function writeBase64File(targetPath, base64) {
  const buffer = Buffer.from(base64, 'base64');
  fs.writeFileSync(targetPath, buffer);
}

async function run() {
  await init();

  const uploadsRoot = path.join(__dirname, '../uploads');
  const booksDir = path.join(uploadsRoot, 'books');
  ensureDir(booksDir);

  // Two tiny valid PDFs (1-page) in base64
  const pdf1 = 'JVBERi0xLjQKJcTl8uXrp/Og0MTGCjEgMCBvYmoKPDwvVHlwZS9DYXRhbG9nL1BhZ2VzIDIgMCBSCj4+CmVuZG9iagoKMiAwIG9iago8PC9UeXBlL1BhZ2VzL0NvdW50IDEvS2lkc1sgMyAwIFJdPj4KZW5kb2JqCgozIDAgb2JqCjw8L1R5cGUvUGFnZS9NZWRpYUJveFswIDAgNTk1IDg0Ml0vUGFyZW50IDIgMCBSL1Jlc291cmNlczw8Pj4vQ29udGVudHMgNCAwIFI+PgplbmRvYmoKCjQgMCBvYmoKPDwvTGVuZ3RoIDYxPj4Kc3RyZWFtCkJUCjcwIDc3MCBUZAooTUVMSTE6IEhlbGxvLCBNWUxpYiEhKSBUIDEwMCA3NTAgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagoKeHJlZgowIDYKMDQwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4gCjAwMDAwMDAwNzAgMDAwMDAgbiAKMDAwMDAwMDE1NiAwMDAwMCBuIAowMDAwMDAwMjU0IDAwMDAwIG4gCnRyYWlsZXIKPDwvUm9vdCAxIDAgUi9TaXplIDY+PgpzdGFydHhyZWYKMzY0CiUlRU9G';
  const pdf2 = 'JVBERi0xLjQKJcTl8uXrp/Og0MTGCjEgMCBvYmoKPDwvVHlwZS9DYXRhbG9nL1BhZ2VzIDIgMCBSCj4+CmVuZG9iagoKMiAwIG9iago8PC9UeXBlL1BhZ2VzL0NvdW50IDEvS2lkc1sgMyAwIFJdPj4KZW5kb2JqCgozIDAgb2JqCjw8L1R5cGUvUGFnZS9NZWRpYUJveFswIDAgNTk1IDg0Ml0vUGFyZW50IDIgMCBSL1Jlc291cmNlczw8Pj4vQ29udGVudHMgNCAwIFI+PgplbmRvYmoKCjQgMCBvYmoKPDwvTGVuZ3RoIDY1Pj4Kc3RyZWFtCkJUCjcwIDc3MCBUZAooTUVMSTI6IEVkdWNhdGlvbiAmIExlYWRlcnNoaXApIFQgMTAwIDc1MCBUagpFVAplbmRzdHJlYW0KZW5kb2JqCgp4cmVmCjAgNgowNDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTAgMDAwMDAgbiAKMDAwMDAwMDA3MCAwMDAwMCBuIAowMDAwMDAwMTU2IDAwMDAwIG4gCjAwMDAwMDAyNTkgMDAwMDAgbiAKdHJhaWxlcgo8PC9Sb290IDEgMCBSL1NpemUgNj4+CnN0YXJ0eHJlZgozNjgKJSVFT0Y=';

  const file1 = path.join(booksDir, 'mylib_hello.pdf');
  const file2 = path.join(booksDir, 'mylib_leadership.pdf');
  writeBase64File(file1, pdf1);
  writeBase64File(file2, pdf2);

  const [teacher] = await query('SELECT id FROM users WHERE username = ?', ['teacher1']);
  if (!teacher) {
    const hash = bcrypt.hashSync('teacher123', 10);
    await query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [
      'teacher1',
      hash,
      'teacher'
    ]);
    console.log('Seed: teacher1/teacher123 created');
  }

  const now = new Date();
  const [admin] = await query('SELECT id FROM users WHERE username = ?', ['admin']);
  const uploadedBy = admin ? admin.id : null;

  // Skip inserting test books - they were for testing only

  await query(
    'INSERT INTO mental_health_resources (title, type, content, description) VALUES (?, ?, ?, ?)',
    ['Respiration consciente (avec bulles)', 'exercise', 'Asseyez-vous confortablement. Inspirez lentement par le nez en comptant jusqu\'à 4, retenez 1, puis soufflez en faisant des bulles ou en imaginant souffler une bougie en comptant jusqu\'à 6. Répétez 6 à 10 fois. Concentrez-vous sur la sensation de l\'air qui entre et sort. Cette activité combine la respiration consciente et un geste doux pour apaiser le système nerveux.', 'Pratique simple pour calmer le corps et l\'esprit en utilisant la respiration et une activité ludique.']
  );
  await query(
    'INSERT INTO mental_health_resources (title, type, content, description) VALUES (?, ?, ?, ?)',
    ['Ancrage 5-4-3-2-1', 'exercise', 'Regardez autour de vous et nommez 5 choses que vous voyez. Touchez 4 objets et notez leurs textures. Écoutez et identifiez 3 sons. Sentez 2 odeurs ou notez deux choses que vous pourriez sentir. Dégustez ou imaginez 1 goût. Respirez profondément entre chaque étape. Cette méthode aide à réduire l\'anxiété en ancrant l\'attention sur l\'instant présent.', 'Technique de grounding pour ramener l\'attention au présent à l\'aide des sens.']
  );
  await query(
    'INSERT INTO mental_health_resources (title, type, content, description) VALUES (?, ?, ?, ?)',
    ['Expression par le dessin', 'exercise', 'Prenez du papier et des crayons. Dessinez ce que vous ressentez en couleurs, formes ou symboles, sans chercher à être parfait. Après 10–15 minutes, observez le dessin : quelles émotions apparaissent ? Cela permet d\'extérioriser et de mieux comprendre ses ressentis.', 'Exprimez vos émotions sans mots — utile pour enfants et adultes.']
  );
  await query(
    'INSERT INTO mental_health_resources (title, type, content, description) VALUES (?, ?, ?, ?)',
    ['Bocal de gratitude', 'exercise', 'Chaque jour, notez une petite chose positive sur un papier et mettez-la dans un bocal. Quand vous vous sentez triste ou stressé, ouvrez quelques papiers et relisez-les. Ce geste renforce la vision positive et aide à reconnaître les ressources personnelles.', 'Petit rituel pour cultiver la gratitude et le bien-être au quotidien.']
  );
  await query(
    'INSERT INTO mental_health_resources (title, type, content, description) VALUES (?, ?, ?, ?)',
    ['Affirmations Je suis', 'exercise', 'Devant un miroir, dites à voix haute 3 affirmations commençant par Je suis (par ex. Je suis capable, Je suis digne d\'écoute, Je suis en sécurité). Répétez chaque affirmation lentement 3 fois. Vous pouvez les écrire et les garder sur un papier visible.', 'Renforce l\'estime et la confiance par des énoncés positifs.']
  );
  await query(
    'INSERT INTO mental_health_resources (title, type, content, description) VALUES (?, ?, ?, ?)',
    ['L\'histoire de la petite bulle', 'story', 'Il était une fois une petite bulle qui voyageait doucement dans l\'air. Quand elle grandissait, elle inspirait calme et lumière ; quand elle rétrécissait, elle emportait avec elle les nuages sombres. Chaque fois que le vent soufflait trop fort, la bulle apprenait à respirer plus lentement et retrouvait son chemin. La bulle rappelle que prendre une respiration lente nous aide à retrouver notre calme.', 'Une courte histoire pour aider à comprendre la respiration consciente.']
  );
  await query(
    'INSERT INTO mental_health_resources (title, type, content, description) VALUES (?, ?, ?, ?)',
    ['Le jardin des 5 sens', 'story', 'Dans un jardin, un enfant explore cinq chemins: un sentier coloré (vue), un tapis rugueux (toucher), une fontaine qui chante (son), un coin de fleurs parfumées (odorat) et une boîte de biscuits (goût). En visitant chacun, l\'enfant apprend à revenir au présent et à se sentir en sécurité dans son corps. Ce jardin symbolise comment nos sens nous reconnectent à l\'instant.', 'Conte court pour pratiquer l\'ancrage sensoriel.']
  );
  await query(
    'INSERT INTO mental_health_resources (title, type, content, description) VALUES (?, ?, ?, ?)',
    ['La boîte à dessins magique', 'story', 'Une boîte à dessins magique transformait chaque trait en couleur d\'émotion. Quand un enfant dessinait sa colère, la couleur devenait lumière et se calmait. En dessinant la joie, la pièce s\'illuminait. La boîte rappelle que mettre des émotions sur papier les rend plus faciles à comprendre et à partager.', 'Histoire encourageant l\'expression des émotions par l\'art.']
  );

  await query(
    'INSERT INTO entrepreneurship_content (title, type, content, description) VALUES (?, ?, ?, ?)',
    ['Leçon 1: Identifier les Problèmes', 'lesson', 'La première étape de l\'entrepreneuriat est d\'identifier les problèmes dans votre communauté. Regardez autour de vous : quels sont les défis quotidiens que les gens rencontrent ? Notez au moins 3 problèmes concrets que vous observez. Chaque problème est une opportunité de créer une solution qui peut devenir une entreprise. Par exemple : transport difficile, accès à l\'eau potable, manque de services éducatifs, etc.', 'Introduction à la pensée entrepreneuriale']
  );
  await query(
    'INSERT INTO entrepreneurship_content (title, type, content, description) VALUES (?, ?, ?, ?)',
    ['Leçon 2: Créer des Solutions Innovantes', 'lesson', 'Une fois que vous avez identifié un problème, réfléchissez à des solutions créatives. Posez-vous ces questions : Qui souffre de ce problème ? Comment pouvez-vous le résoudre simplement ? Quelles ressources avez-vous déjà ? Commencez petit et testez vos idées avec votre entourage avant d\'investir du temps et de l\'argent.', 'Développer la créativité entrepreneuriale']
  );
  await query(
    'INSERT INTO entrepreneurship_content (title, type, content, description) VALUES (?, ?, ?, ?)',
    ['Leçon 3: Gérer les Finances', 'lesson', 'La gestion financière est cruciale pour toute entreprise. Apprenez à suivre vos revenus et dépenses. Créez un budget simple : notez ce qui entre et ce qui sort. Économisez une partie de vos profits pour réinvestir dans votre entreprise. N\'empruntez que si nécessaire et remboursez à temps pour construire une bonne réputation.', 'Bases de la gestion financière']
  );
  await query(
    'INSERT INTO entrepreneurship_content (title, type, content, description) VALUES (?, ?, ?, ?)',
    ['Étude de Cas: Le Petit Marché', 'case_study', 'Marie, 16 ans, a remarqué que les légumes au marché local se gâtaient rapidement. Elle a créé un système simple : acheter des légumes le matin, les vendre le jour même avec une petite marge. En 3 mois, elle avait économisé assez pour acheter un réfrigérateur portable, doublant ses profits. Son secret : qualité constante et service rapide.', 'Comment une jeune entrepreneure a transformé un problème en opportunité']
  );
  await query(
    'INSERT INTO entrepreneurship_content (title, type, content, description) VALUES (?, ?, ?, ?)',
    ['Étude de Cas: Transport Communautaire', 'case_study', 'Un groupe d\'étudiants a identifié que leurs voisins avaient du mal à transporter l\'eau. Ils ont créé un service de livraison d\'eau à vélo pour une petite somme. En s\'organisant par équipes et horaires, ils ont servi 50 familles en 6 mois. Leçon clé : le travail d\'équipe et la fiabilité créent la confiance des clients.', 'Innovation dans le service communautaire']
  );
  await query(
    'INSERT INTO entrepreneurship_content (title, type, content, description) VALUES (?, ?, ?, ?)',
    ['Étude de Cas: Réparation de Téléphones', 'case_study', 'Jean a appris à réparer des téléphones en regardant des vidéos. Il a commencé en réparant gratuitement pour ses amis, puis a facturé des prix modestes. En économisant pour acheter des outils professionnels, il est devenu le réparateur de confiance du quartier. Aujourd\'hui, il forme d\'autres jeunes. Leçon : les compétences + la persévérance = succès.', 'Du hobby à l\'entreprise rentable']
  );

  console.log('Seed: demo data inserted');
  process.exit(0);
}

run().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});

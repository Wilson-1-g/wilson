const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth()
});

const menuPrincipal = `
👋 Bienvenue chez WILS BET !

Je suis ton assistant de paris sportifs. Dis-moi ce que tu veux faire :

1️⃣ Découvrir le code promo
2️⃣ Savoir où l'utiliser
3️⃣ Comment l'utiliser
4️⃣ Rejoindre le groupe VIP
5️⃣ Tout savoir sur les bonus
6️⃣ Aide & Contact

_Tape le chiffre correspondant à ton choix._`;

const sousMenus = {
    "1": `🎁 Ton code promo exclusif est : WILS15 🎁

Utilise-le à l'inscription pour recevoir un BONUS de bienvenue incroyable !

Souhaitez-vous :
a. Savoir comment l'utiliser ?
b. Savoir où l'utiliser ?
_Tape "a" ou "b"._`,

    "2": `🌍 Tu peux utiliser le code WILS15 sur :
- 1XBET : https://1xbet.com
- MELBET : https://melbet.com
- BETWINNER : https://betwinner.com
- 888STARZ : https://888starz.bet

Souhaitez-vous :
a. Télécharger les applications ?
b. Voir les étapes d'inscription ?
_Tape "a" ou "b"._`,

    "3": `✅ Comment utiliser ton code WILS15 :
1. Clique sur un lien du site (ex : https://1xbet.com)
2. Clique sur "S’inscrire"
3. Remplis les infos
4. Mets le code promo : WILS15
5. Reçois ton bonus automatiquement !

_Tu veux de l'aide pour t’inscrire ? Tape "a"_`,

    "4": `👑 Rejoindre le groupe VIP WILS BET :
1. Inscris-toi avec le code promo WILS15
2. Réponds ici "fait"
3. Tu recevras le lien d’invitation dans quelques minutes.

_Tu veux rejoindre maintenant ? Tape "fait"_`,

    "5": `💎 Types de bonus disponibles :
a. Bonus de bienvenue
b. Bonus de dépôt
c. Bonus d’anniversaire
d. Paris gratuits

_Tape la lettre correspondant à ce que tu veux découvrir._`,

    "6": `📩 Assistance & Contact
Tu peux me poser une question ou taper :
- "support" pour être mis en contact
- "aide" pour le menu d’assistance

Exemples :
- "Je n’arrive pas à m’inscrire"
- "Je ne trouve pas l’endroit pour mettre le code"`,
};

// Gérer les étapes pour chaque utilisateur
let etatUtilisateurs = {};

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Bot prêt !');
});

client.on('message', async message => {
    const numero = message.from;
    const texte = message.body.trim().toLowerCase();

    // Si nouveau ou relance
    if (!etatUtilisateurs[numero]) {
        etatUtilisateurs[numero] = { niveau: 'menu' };
        await message.reply(menuPrincipal);
        return;
    }

    // Réponses selon le niveau
    const etat = etatUtilisateurs[numero];

    if (etat.niveau === 'menu') {
        if (sousMenus[texte]) {
            etat.niveau = texte;
            await message.reply(sousMenus[texte]);
        } else {
            await message.reply("❌ Je n’ai pas compris. Choisis un chiffre du menu.\n" + menuPrincipal);
        }
    } else {
        await message.reply("✅ Merci ! Tu peux taper un chiffre pour revenir au menu :\n" + menuPrincipal);
        etatUtilisateurs[numero] = { niveau: 'menu' };
    }
});

client.initialize();
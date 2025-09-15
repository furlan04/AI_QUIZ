# QuizSocialAI 🎉

QuizSocialAI è una web-app sociale che combina interazione tra utenti e intelligenza artificiale. Gli utenti possono stringere amicizie, creare quiz semplicemente indicando l'argomento e sfidare i propri amici o la community.

## 🚀 Funzionalità principali

- 👥 **Social network**: aggiungi altri utenti come amici e interagisci con loro
- 🧠 **Creazione quiz con AI**: basta scrivere l'argomento, l'intelligenza artificiale genera automaticamente le domande e le risposte
- 🎮 **Gioca e sfida**: affronta i quiz creati da te, dai tuoi amici o dalla community
- 🏆 **Classifiche e punteggi**: scala la leaderboard dimostrando le tue conoscenze

## 🛠️ Stack Tecnologico

- **Frontend**: React
- **Backend**: C# con ASP.NET Core Web API
- **Database**: MySQL
- **AI Integration**: nel progetto sono state usate le API fornite da GROQ
- **Autenticazione**: JWT

## 📦 Installazione

### Requisiti

- .NET 8 SDK
- Node.js >= 18
- SQL Server / PostgreSQL attivo
- Chiave API di un LLM

### Setup Backend (C# ASP.NET Core)

```bash
# Posizionati nella cartella backend
cd server-web

# Ripristina i pacchetti NuGet
dotnet restore

# Avvia l'API
dotnet run
```

### Setup Frontend (React)

```bash
# Posizionati nella cartella frontend
cd client-web

# Installa le dipendenze
npm install

# Avvia il frontend
npm start
```

Il frontend sarà disponibile su http://localhost:3000.

## 🔑 Variabili d'ambiente

Nel file `.env` del frontend:

```env
REACT_APP_ENDPOINT=http://localhost:5000
```

Nel backend, modificare il file `appsettings.json` per configurare endpoint, database e altre impostazioni.

## 🌐 Demo

Il sito è disponibile per una demo a: https://easyquiz.up.railway.app

## 🤝 Contributi

I contributi sono benvenuti!

1. Fai il fork del progetto
2. Crea un branch feature (`git checkout -b feature/nuova-feature`)
3. Fai commit delle modifiche (`git commit -m 'Aggiunta nuova feature'`)
4. Fai push sul branch (`git push origin feature/nuova-feature`)
5. Apri una Pull Request

## 📜 Licenza

Questo progetto è distribuito sotto licenza MIT.
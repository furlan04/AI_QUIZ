# Refactoring dei Servizi - AI Quiz Network

## Panoramica

Questo documento descrive il refactoring completo dell'architettura dei servizi dell'applicazione AI Quiz Network. Tutte le chiamate API sono state separate dai componenti e organizzate in servizi dedicati per migliorare la manutenibilità, la riusabilità e la pulizia del codice.

## Struttura dei Servizi

### 1. CommonService.js
Servizio comune che fornisce utility condivise:
- **Gestione token**: `getAuthToken()`, `isAuthenticated()`, `logout()`
- **Gestione errori**: `handleHttpError()`, `handleNetworkError()`
- **Headers comuni**: `createAuthHeaders()`, `createHeaders()`
- **Timeout richieste**: `createFetchWithTimeout()`

### 2. AuthService.js
Gestisce tutte le operazioni di autenticazione:
- **register(email, password)**: Registrazione nuovo utente
- **login(email, password)**: Accesso utente esistente

### 3. QuizService.js
Gestisce tutte le operazioni sui quiz:
- **createQuiz(topic, token)**: Crea un nuovo quiz
- **getMyQuizzes(token)**: Ottiene i quiz dell'utente corrente
- **getQuizzes(token, userId)**: Ottiene i quiz di un utente specifico
- **getQuizById(quizId, token)**: Ottiene un quiz specifico per ID

### 4. QuizAttemptService.js
Gestisce tutti i tentativi dei quiz:
- **submitQuizAttempt(submitData, token)**: Invia un tentativo completato
- **getLeaderboard(quizId, token)**: Ottiene la classifica di un quiz
- **getMyAttempts(quizId, token)**: Ottiene i tentativi dell'utente per un quiz
- **getAttemptReview(attemptId, token)**: Ottiene la revisione di un tentativo

### 5. FriendshipService.js
Gestisce tutte le operazioni sulle amicizie:
- **getFriendshipRequests(token)**: Ottiene le richieste di amicizia in arrivo
- **sendFriendshipRequest(email, token)**: Invia una richiesta di amicizia
- **acceptFriendshipRequest(friendshipId, token)**: Accetta una richiesta di amicizia
- **getFriendsList(token)**: Ottiene la lista degli amici
- **removeFriendship(friendshipId, token)**: Rimuove un'amicizia

### 6. NotificationService.js
Sistema di notifiche centralizzato:
- **Tipi supportati**: success, error, warning, info
- **Gestione automatica**: rimozione automatica dopo durata configurata
- **Pattern observer**: notifica i componenti dei cambiamenti

## Configurazione

### config/config.js
File di configurazione centralizzato che contiene:
- Endpoint API
- Timeout HTTP
- Configurazioni autenticazione
- Configurazioni quiz
- Configurazioni UI
- Configurazioni notifiche

## Benefici del Refactoring

### 1. Separazione delle Responsabilità
- I componenti si occupano solo della logica di presentazione
- I servizi gestiscono tutta la logica di business e comunicazione API
- Configurazione centralizzata e facilmente modificabile

### 2. Riutilizzabilità
- I servizi possono essere utilizzati da più componenti
- Logica di business condivisa e consistente
- Facile aggiungere nuove funzionalità

### 3. Manutenibilità
- Codice più pulito e organizzato
- Gestione errori centralizzata e consistente
- Facile debugging e testing

### 4. Scalabilità
- Struttura modulare che facilita l'espansione
- Pattern observer per notifiche in tempo reale
- Configurazione flessibile per diversi ambienti

## Utilizzo nei Componenti

### Prima (Chiamate API dirette)
```javascript
const response = await fetch(`${process.env.REACT_APP_ENDPOINT}/Auth/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});
```

### Dopo (Uso dei servizi)
```javascript
import { login } from "../services/AuthService";
const result = await login(email, password);
```

## Gestione Errori

Tutti i servizi implementano una gestione errori consistente:
- **Errori HTTP**: gestiti tramite `handleHttpError()`
- **Errori di rete**: gestiti tramite `handleNetworkError()`
- **Fallback**: i componenti possono implementare logica di fallback
- **Logging**: tutti gli errori sono loggati per debugging

## Configurazione Ambiente

Le configurazioni sono gestite tramite variabili d'ambiente:
```bash
REACT_APP_ENDPOINT=https://api.example.com
```

## Prossimi Passi

1. **Testing**: Implementare test unitari per tutti i servizi
2. **Caching**: Aggiungere sistema di cache per le richieste frequenti
3. **Retry Logic**: Implementare logica di retry per richieste fallite
4. **WebSocket**: Aggiungere supporto per aggiornamenti in tempo reale
5. **Offline Support**: Implementare supporto per modalità offline

## Conclusione

Il refactoring ha trasformato l'applicazione da un'architettura monolitica a una modulare e scalabile. I componenti sono ora più puliti e focalizzati sulla loro responsabilità principale, mentre i servizi forniscono un'API consistente e riutilizzabile per tutte le operazioni di business.

const express = require('express');
const path = require('path');
const carrosRoutes = require('./rotas/carros');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rotas
app.use('/api/carros', carrosRoutes);

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', projeto: 'car-api2', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`🚗 car-api2 rodando na porta ${PORT}`);
    console.log(`📊 Acesse: http://localhost:${PORT}`);
});
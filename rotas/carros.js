const express = require('express');
const fs = require('fs');
const path = require('path');
const { validarCarro } = require('../middleware/validacao');

const router = express.Router();
const dadosPath = path.join(__dirname, '../dados/carros.json');

// Helper para ler carros
const lerCarros = () => {
    try {
        if (!fs.existsSync(dadosPath)) {
            return [];
        }
        const data = fs.readFileSync(dadosPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Erro ao ler carros:', error);
        return [];
    }
};

// Helper para salvar carros
const salvarCarros = (carros) => {
    try {
        fs.writeFileSync(dadosPath, JSON.stringify(carros, null, 2));
    } catch (error) {
        console.error('Erro ao salvar carros:', error);
    }
};

// GET /api/carros - Listar todos os carros
router.get('/', (req, res) => {
    try {
        const carros = lerCarros();
        res.json({
            success: true,
            count: carros.length,
            data: carros
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Erro interno do servidor' 
        });
    }
});

// GET /api/carros/:id - Buscar carro por ID
router.get('/:id', (req, res) => {
    try {
        const carros = lerCarros();
        const carro = carros.find(c => c.id == req.params.id);
        
        if (!carro) {
            return res.status(404).json({ 
                success: false, 
                error: 'Carro não encontrado' 
            });
        }
        
        res.json({ success: true, data: carro });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Erro interno do servidor' 
        });
    }
});

// POST /api/carros - Criar novo carro
router.post('/', validarCarro, (req, res) => {
    try {
        const carros = lerCarros();
        const novoCarro = {
            id: Date.now(),
            marca: req.body.marca,
            modelo: req.body.modelo,
            ano: parseInt(req.body.ano),
            placa: req.body.placa.toUpperCase(),
            cor: req.body.cor,
            dataCriacao: new Date().toISOString()
        };
        
        carros.push(novoCarro);
        salvarCarros(carros);
        
        res.status(201).json({ 
            success: true, 
            message: 'Carro criado com sucesso',
            data: novoCarro 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Erro ao criar carro' 
        });
    }
});

// PUT /api/carros/:id - Atualizar carro
router.put('/:id', validarCarro, (req, res) => {
    try {
        const carros = lerCarros();
        const index = carros.findIndex(c => c.id == req.params.id);
        
        if (index === -1) {
            return res.status(404).json({ 
                success: false, 
                error: 'Carro não encontrado' 
            });
        }
        
        carros[index] = {
            ...carros[index],
            marca: req.body.marca,
            modelo: req.body.modelo,
            ano: parseInt(req.body.ano),
            placa: req.body.placa.toUpperCase(),
            cor: req.body.cor,
            dataAtualizacao: new Date().toISOString()
        };
        
        salvarCarros(carros);
        
        res.json({ 
            success: true, 
            message: 'Carro atualizado com sucesso',
            data: carros[index] 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Erro ao atualizar carro' 
        });
    }
});

// DELETE /api/carros/:id - Deletar carro
router.delete('/:id', (req, res) => {
    try {
        let carros = lerCarros();
        const carroIndex = carros.findIndex(c => c.id == req.params.id);
        
        if (carroIndex === -1) {
            return res.status(404).json({ 
                success: false, 
                error: 'Carro não encontrado' 
            });
        }
        
        const carroRemovido = carros.splice(carroIndex, 1)[0];
        salvarCarros(carros);
        
        res.json({ 
            success: true, 
            message: 'Carro removido com sucesso',
            data: carroRemovido 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Erro ao remover carro' 
        });
    }
});

module.exports = router;
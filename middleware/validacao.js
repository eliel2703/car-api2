const validarCarro = (req, res, next) => {
    const { marca, modelo, ano, placa, cor } = req.body;
    
    // Verificar campos obrigatórios
    if (!marca || !modelo || !ano || !placa || !cor) {
        return res.status(400).json({ 
            error: 'Todos os campos são obrigatórios',
            campos: { marca, modelo, ano, placa, cor }
        });
    }
    
    // Validar ano
    if (isNaN(ano) || ano < 1886 || ano > new Date().getFullYear() + 1) {
        return res.status(400).json({ 
            error: 'Ano deve ser entre 1886 e o ano atual + 1' 
        });
    }
    
    // Validr placa
    if (placa.length < 6 || placa.length > 8) {
        return res.status(400).json({ 
            error: 'Placa deve ter entre 6 e 8 caracteres' 
        });
    }
    
    next();
};

module.exports = { validarCarro };
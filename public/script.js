class CarAPI2 {
    constructor() {
        this.API_URL = '/api/carros';
        this.editandoId = null;
        this.inicializar();
    }

    inicializar() {
        this.carregarCarros();
        this.configurarEventos();
    }

    configurarEventos() {
        document.getElementById('carro-form').addEventListener('submit', (e) => this.salvarCarro(e));
        document.getElementById('btn-cancelar').addEventListener('click', () => this.cancelarEdicao());
    }

    async carregarCarros() {
        this.mostrarLoading(true);
        
        try {
            const response = await fetch(this.API_URL);
            const data = await response.json();
            
            if (data.success) {
                this.exibirCarros(data.data);
                this.atualizarContador(data.data.length);
            } else {
                this.mostrarErro('Erro ao carregar carros');
            }
        } catch (error) {
            this.mostrarErro('Erro de conexão com o servidor');
        } finally {
            this.mostrarLoading(false);
        }
    }

    exibirCarros(carros) {
        const container = document.getElementById('lista-carros');
        
        if (carros.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>Nenhum carro cadastrado</h3>
                    <p>Comece cadastrando o primeiro veículo!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = carros.map(carro => `
            <div class="car-card">
                <h3>${carro.marca} ${carro.modelo}</h3>
                <div class="car-info">
                    <p><strong>Ano:</strong> ${carro.ano}</p>
                    <p><strong>Placa:</strong> ${carro.placa}</p>
                    <p><strong>Cor:</strong> ${carro.cor}</p>
                    <p><strong>ID:</strong> ${carro.id}</p>
                </div>
                <div class="car-actions">
                    <button class="btn-edit" onclick="carApi2.editarCarro(${carro.id})">
                        Editar
                    </button>
                    <button class="btn-delete" onclick="carApi2.excluirCarro(${carro.id})">
                        Excluir
                    </button>
                </div>
            </div>
        `).join('');
    }

    async salvarCarro(event) {
        event.preventDefault();
        
        const carroData = {
            marca: document.getElementById('marca').value.trim(),
            modelo: document.getElementById('modelo').value.trim(),
            ano: document.getElementById('ano').value,
            placa: document.getElementById('placa').value.trim(),
            cor: document.getElementById('cor').value.trim()
        };

        try {
            const url = this.editandoId ? `${this.API_URL}/${this.editandoId}` : this.API_URL;
            const method = this.editandoId ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(carroData)
            });

            const data = await response.json();

            if (data.success) {
                this.limparFormulario();
                this.carregarCarros();
                this.mostrarMensagem(data.message);
            } else {
                this.mostrarErro(data.error);
            }
        } catch (error) {
            this.mostrarErro('Erro ao salvar carro');
        }
    }

    async editarCarro(id) {
        try {
            const response = await fetch(`${this.API_URL}/${id}`);
            const data = await response.json();
            
            if (data.success) {
                const carro = data.data;
                
                document.getElementById('carro-id').value = carro.id;
                document.getElementById('marca').value = carro.marca;
                document.getElementById('modelo').value = carro.modelo;
                document.getElementById('ano').value = carro.ano;
                document.getElementById('placa').value = carro.placa;
                document.getElementById('cor').value = carro.cor;
                
                document.getElementById('form-title').textContent = 'Editar Carro';
                document.getElementById('btn-text').textContent = 'Atualizar Carro';
                document.getElementById('btn-cancelar').style.display = 'block';
                
                this.editandoId = id;
                
                document.querySelector('.form-section').scrollIntoView({ 
                    behavior: 'smooth' 
                });
            }
        } catch (error) {
            this.mostrarErro('Erro ao carregar dados do carro');
        }
    }

    async excluirCarro(id) {
        if (!confirm('Tem certeza que deseja excluir este carro?')) {
            return;
        }

        try {
            const response = await fetch(`${this.API_URL}/${id}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (data.success) {
                this.carregarCarros();
                this.mostrarMensagem(data.message);
            } else {
                this.mostrarErro(data.error);
            }
        } catch (error) {
            this.mostrarErro('Erro ao excluir carro');
        }
    }

    cancelarEdicao() {
        this.limparFormulario();
        this.editandoId = null;
        document.getElementById('form-title').textContent = 'Cadastrar Novo Carro';
        document.getElementById('btn-text').textContent = 'Cadastrar Carro';
        document.getElementById('btn-cancelar').style.display = 'none';
    }

    limparFormulario() {
        document.getElementById('carro-form').reset();
        document.getElementById('carro-id').value = '';
    }

    atualizarContador(total) {
        document.getElementById('total-carros').textContent = 
            `${total} carro${total !== 1 ? 's' : ''}`;
    }

    mostrarLoading(mostrar) {
        document.getElementById('loading').style.display = 
            mostrar ? 'block' : 'none';
    }

    mostrarMensagem(mensagem) {
        alert(`${mensagem}`);
    }

    mostrarErro(mensagem) {
        alert(`${mensagem}`);
    }
}

const carApi2 = new CarAPI2();
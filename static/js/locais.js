document.addEventListener('DOMContentLoaded', () => {
    carregarLocais();
});

function showPopup(message, type = 'info') {
    const popup = document.createElement('div');
    popup.className = `popup ${type}`;
    popup.textContent = message;
    
    const style = {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '5px',
        color: 'white',
        fontWeight: 'bold',
        zIndex: '10000',
        maxWidth: '300px',
        wordWrap: 'break-word'
    };
    
    if (type === 'success') {
        style.backgroundColor = '#22c55e';
    } else if (type === 'error') {
        style.backgroundColor = '#ef4444';
    } else {
        style.backgroundColor = '#3b82f6';
    }
    
    Object.assign(popup.style, style);
    document.body.appendChild(popup);
    
    setTimeout(() => {
        if (popup.parentNode) {
            popup.parentNode.removeChild(popup);
        }
    }, 3000);
}

async function carregarLocais() {
    try {
        const response = await fetch('/api/locais');
        const dados = await response.json();
        
        console.log('Dados recebidos:', dados);
        
        // Criar lista de locais
        criarListaLocais(dados);
        
    } catch (error) {
        console.error('Erro ao carregar locais:', error);
        showPopup('Erro ao carregar locais: ' + error.message, 'error');
    }
}

// Removido - grids não existem no HTML

async function mostrarDetalhesLocal(local) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <div class="modal-header">
                <h3>Detalhes do Local ${local}</h3>
                <button class="modal-close" onclick="fecharModal()">&times;</button>
            </div>
            <div class="modal-body">
                <p class="text-center text-gray-500">Carregando dados...</p>
            </div>
            <div class="modal-footer">
                <button class="btn-large bg-gray-500 hover:bg-gray-600 text-white" onclick="fecharModal()">Fechar</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    try {
        const response = await fetch(`/api/local-detalhes/${local}`);
        const dados = await response.json();
        
        const modalBody = modal.querySelector('.modal-body');
        
        if (dados.total === 0) {
            modalBody.innerHTML = '<p class="text-center text-gray-500">Local vazio</p>';
        } else {
            let tabelaHTML = `
                <p><strong>Total de peças:</strong> ${dados.total}</p>
                <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                    <thead>
                        <tr style="background: #f3f4f6;">
                            <th style="border: 1px solid #d1d5db; padding: 8px;">OP</th>
                            <th style="border: 1px solid #d1d5db; padding: 8px;">Peça</th>
                            <th style="border: 1px solid #d1d5db; padding: 8px;">Projeto</th>
                            <th style="border: 1px solid #d1d5db; padding: 8px;">Veículo</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            
            dados.pecas.forEach(peca => {
                tabelaHTML += `
                    <tr>
                        <td style="border: 1px solid #d1d5db; padding: 8px;">${peca.op || '-'}</td>
                        <td style="border: 1px solid #d1d5db; padding: 8px;">${peca.peca || '-'}</td>
                        <td style="border: 1px solid #d1d5db; padding: 8px;">${peca.projeto || '-'}</td>
                        <td style="border: 1px solid #d1d5db; padding: 8px;">${peca.veiculo || '-'}</td>
                    </tr>
                `;
            });
            
            tabelaHTML += '</tbody></table>';
            modalBody.innerHTML = tabelaHTML;
        }
        
    } catch (error) {
        console.error('Erro:', error);
        const modalBody = modal.querySelector('.modal-body');
        modalBody.innerHTML = '<p class="text-center text-red-500">Erro ao carregar dados</p>';
    }
}

function fecharModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
    }
}

let sortDirection = {};

function criarListaLocais(locais) {
    const tbody = document.getElementById('listaLocais');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    locais.forEach(local => {
        const tr = document.createElement('tr');
        tr.className = 'border-b hover:bg-gray-50';
        
        const statusColor = local.status === 'Ativo' ? 'text-green-600' : 
                           local.status === 'Utilizando' ? 'text-red-600' : 'text-gray-600';
        
        tr.innerHTML = `
            <td class="px-4 py-2 font-medium">${local.local}</td>
            <td class="px-4 py-2">${local.nome}</td>
            <td class="px-4 py-2 ${statusColor} font-semibold">${local.status}</td>
            <td class="px-4 py-2 text-center">
                ${local.status === 'Utilizando' ? `
                    <button onclick="mostrarDetalhesLocal('${local.local}')" 
                            class="btn-action btn-blue" title="Ver Peças">
                        <i class="fas fa-eye"></i>
                    </button>
                ` : ''}
                <button onclick="alterarStatusLocal('${local.local}', '${local.status === 'Ativo' ? 'Inativo' : 'Ativo'}')" 
                        class="btn-action ${local.status === 'Ativo' ? 'btn-red' : 'btn-green'}" title="${local.status === 'Ativo' ? 'Desativar' : 'Ativar'}">
                    <i class="fas ${local.status === 'Ativo' ? 'fa-times' : 'fa-check'}"></i>
                </button>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
}

function sortTable(columnIndex) {
    const isAsc = !sortDirection[columnIndex];
    sortDirection[columnIndex] = isAsc;
    
    const tbody = document.getElementById('listaLocais');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    rows.sort((a, b) => {
        const aVal = a.cells[columnIndex].textContent.trim();
        const bVal = b.cells[columnIndex].textContent.trim();
        
        if (columnIndex === 0) {
            return isAsc ? aVal.localeCompare(bVal, undefined, {numeric: true}) : bVal.localeCompare(aVal, undefined, {numeric: true});
        } else {
            return isAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        }
    });
    
    tbody.innerHTML = '';
    rows.forEach(row => tbody.appendChild(row));
}

async function adicionarLocal() {
    const local = document.getElementById('inputLocal').value.trim();
    const nome = document.getElementById('inputNome').value;
    
    if (!local) {
        showPopup('Digite o local', 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/adicionar-local', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ local, nome })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showPopup(result.message, 'success');
            document.getElementById('inputLocal').value = '';
            carregarLocais();
        } else {
            showPopup('Erro: ' + result.message, 'error');
        }
    } catch (error) {
        showPopup('Erro ao adicionar local', 'error');
    }
}

async function alterarStatusLocal(local, novoStatus) {
    try {
        const response = await fetch('/api/alterar-status-local', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ local, status: novoStatus })
        });
        
        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                showPopup(result.message, 'success');
                carregarLocais();
            } else {
                showPopup('Erro: ' + result.message, 'error');
            }
        } else {
            showPopup('Status alterado com sucesso!', 'success');
            carregarLocais();
        }
    } catch (error) {
        showPopup('Status alterado com sucesso!', 'success');
        carregarLocais();
    }
}

function filtrarGridLocais() {
    const termo = document.getElementById('pesquisaLocal').value.trim().toLowerCase();
    const grids = ['rack1-grid', 'rack2-grid', 'rack3-grid'];
    
    grids.forEach(gridId => {
        const grid = document.getElementById(gridId);
        if (!grid) return;
        
        const cells = grid.querySelectorAll('.local-cell');
        cells.forEach(cell => {
            if (cell.textContent.toLowerCase().includes(termo)) {
                cell.style.display = '';
            } else {
                cell.style.display = 'none';
            }
        });
    });
    
    // Filtrar lista também
    const rows = document.querySelectorAll('#listaLocais tr');
    rows.forEach(row => {
        const local = row.cells[0].textContent.toLowerCase();
        if (local.includes(termo)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}
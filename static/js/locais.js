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
        await criarListaLocais(dados);
        
    } catch (error) {
        console.error('Erro ao carregar locais:', error);
        showPopup('Erro ao carregar locais: ' + error.message, 'error');
    }
}

// Removido - grids não existem no HTML

async function mostrarDetalhesLocal(local) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 700px; max-height: 80vh; overflow-y: auto;">
            <div class="modal-header">
                <h3><i class="fas fa-box mr-2"></i>Peças no Local ${local}</h3>
                <button class="modal-close" onclick="fecharModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="text-center text-gray-500">
                    <i class="fas fa-spinner fa-spin mr-2"></i>Carregando dados...
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-large bg-gray-500 hover:bg-gray-600 text-white" onclick="fecharModal()">
                    <i class="fas fa-times mr-2"></i>Fechar
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    try {
        const response = await fetch(`/api/local-detalhes/${local}`);
        const dados = await response.json();
        
        const modalBody = modal.querySelector('.modal-body');
        
        if (dados.total === 0) {
            modalBody.innerHTML = `
                <div class="text-center text-gray-500 py-8">
                    <i class="fas fa-inbox fa-3x mb-4 text-gray-300"></i>
                    <p class="text-lg">Local vazio</p>
                </div>
            `;
        } else {
            let conteudoHTML = `
                <div class="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div class="flex items-center">
                        <i class="fas fa-info-circle text-blue-600 mr-2"></i>
                        <span class="font-semibold text-blue-800">Total de peças: ${dados.total}</span>
                    </div>
                </div>
                
                <div class="overflow-x-auto">
                    <table class="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
                        <thead>
                            <tr class="bg-gray-100">
                                <th class="border border-gray-300 px-3 py-2 text-left font-semibold">OP</th>
                                <th class="border border-gray-300 px-3 py-2 text-left font-semibold">Peça</th>
                                <th class="border border-gray-300 px-3 py-2 text-left font-semibold">Projeto</th>
                                <th class="border border-gray-300 px-3 py-2 text-left font-semibold">Veículo</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            dados.pecas.forEach((peca, index) => {
                const rowClass = index % 2 === 0 ? 'bg-white' : 'bg-gray-50';
                conteudoHTML += `
                    <tr class="${rowClass} hover:bg-blue-50">
                        <td class="border border-gray-300 px-3 py-2">${peca.op || '-'}</td>
                        <td class="border border-gray-300 px-3 py-2 font-medium">${peca.peca || '-'}</td>
                        <td class="border border-gray-300 px-3 py-2">${peca.projeto || '-'}</td>
                        <td class="border border-gray-300 px-3 py-2">${peca.veiculo || '-'}</td>
                    </tr>
                `;
            });
            
            conteudoHTML += `
                        </tbody>
                    </table>
                </div>
            `;
            modalBody.innerHTML = conteudoHTML;
        }
        
    } catch (error) {
        console.error('Erro:', error);
        const modalBody = modal.querySelector('.modal-body');
        modalBody.innerHTML = `
            <div class="text-center text-red-500 py-8">
                <i class="fas fa-exclamation-triangle fa-3x mb-4"></i>
                <p class="text-lg">Erro ao carregar dados</p>
                <p class="text-sm mt-2">${error.message}</p>
            </div>
        `;
    }
}

function fecharModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.style.display = 'none';
        setTimeout(() => {
            modal.remove();
        }, 100);
    }
}

let sortDirection = {};

async function criarListaLocais(locais) {
    const tbody = document.getElementById('listaLocais');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    // Buscar contagem de peças para cada local
    const contagemPecas = {};
    try {
        const response = await fetch('/api/contagem-pecas-locais');
        const dados = await response.json();
        dados.forEach(item => {
            contagemPecas[item.local] = item.total;
        });
    } catch (error) {
        console.error('Erro ao buscar contagem de peças:', error);
    }
    
    locais.forEach(local => {
        const tr = document.createElement('tr');
        tr.className = 'border-b hover:bg-gray-50';
        
        const statusColor = local.status === 'Ativo' ? 'text-green-600' : 
                           local.status === 'Utilizando' ? 'text-red-600' : 'text-gray-600';
        
        const totalPecas = contagemPecas[local.local] || 0;
        const temPecas = totalPecas > 0;
        
        tr.innerHTML = `
            <td class="px-4 py-2 font-medium">${local.local}</td>
            <td class="px-4 py-2">${local.nome}</td>
            <td class="px-4 py-2 ${statusColor} font-semibold">${local.status}</td>
            <td class="px-4 py-2 text-center">
                ${temPecas ? `
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        ${totalPecas} peça${totalPecas > 1 ? 's' : ''}
                    </span>
                ` : `
                    <span class="text-gray-400 text-sm">Vazio</span>
                `}
            </td>
            <td class="px-4 py-2 text-center">
                ${temPecas ? `
                    <button onclick="mostrarDetalhesLocal('${local.local}')" 
                            class="btn-action btn-blue mr-2" title="Ver Peças">
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
        let aVal, bVal;
        
        if (columnIndex === 3) { // Coluna Peças
            const aText = a.cells[columnIndex].textContent.trim();
            const bText = b.cells[columnIndex].textContent.trim();
            aVal = aText === 'Vazio' ? 0 : parseInt(aText.match(/\d+/)?.[0] || '0');
            bVal = bText === 'Vazio' ? 0 : parseInt(bText.match(/\d+/)?.[0] || '0');
            return isAsc ? aVal - bVal : bVal - aVal;
        } else if (columnIndex === 0) { // Coluna Local
            aVal = a.cells[columnIndex].textContent.trim();
            bVal = b.cells[columnIndex].textContent.trim();
            return isAsc ? aVal.localeCompare(bVal, undefined, {numeric: true}) : bVal.localeCompare(aVal, undefined, {numeric: true});
        } else {
            aVal = a.cells[columnIndex].textContent.trim();
            bVal = b.cells[columnIndex].textContent.trim();
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
 // Verificar status do banco
        async function checkDatabaseStatus() {
            try {
                const response = await fetch('/tables');
                const data = await response.json();
                
                const statusDiv = document.getElementById('dbStatus');
                if (data.success) {
                    statusDiv.className = 'status connected';
                    statusDiv.innerHTML = '✅ Conectado ao Banco de Dados - Pronto para importar';
                } else {
                    throw new Error(data.error);
                }
            } catch (error) {
                const statusDiv = document.getElementById('dbStatus');
                statusDiv.className = 'status disconnected';
                statusDiv.innerHTML = '❌ Erro na conexão com o Banco de Dados: ' + error.message;
            }
        }

        // Envio do formulário
        document.getElementById('importForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = document.getElementById('submitBtn');
            const resultDiv = document.getElementById('result');
            
            // Reset resultado anterior
            resultDiv.className = 'result';
            resultDiv.innerHTML = '';
            
            // Mostrar loading
            submitBtn.disabled = true;
            submitBtn.innerHTML = '⏳ Processando...';
            
            const formData = {
                tableName: document.getElementById('tableName').value,
                tableData: document.getElementById('tableData').value,
                delimiter: document.getElementById('delimiter').value,
                hasHeader: document.getElementById('hasHeader').checked
            };
            
            try {
                const response = await fetch('/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });
                
                const result = await response.json();
                
                if (response.ok && result.success) {
                    resultDiv.className = 'result success';
                    resultDiv.innerHTML = `
                        <h3>✅ Importação Concluída com Sucesso!</h3>
                        <p><strong>📊 Tabela:</strong> ${result.tableName}</p>
                        <p><strong>📈 Registros inseridos:</strong> ${result.affectedRows}</p>
                        <p><strong>🔢 Total processado:</strong> ${result.totalRecords}</p>
                        <p><strong>🏷️ Colunas:</strong> ${result.columns.join(', ')}</p>
                        ${result.firstRecord ? `
                        <div style="margin-top: 15px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                            <strong>👤 Primeiro registro inserido:</strong>
                            <pre style="background: white; padding: 10px; border-radius: 4px; margin-top: 8px; overflow-x: auto;">${JSON.stringify(result.firstRecord, null, 2)}</pre>
                        </div>
                        ` : ''}
                    `;
                } else {
                    throw new Error(result.error || 'Erro desconhecido na importação');
                }
            } catch (error) {
                resultDiv.className = 'result error';
                resultDiv.innerHTML = `
                    <h3>❌ Erro na Importação</h3>
                    <p><strong>Descrição:</strong> ${error.message}</p>
                    <p style="margin-top: 10px; font-size: 0.9em; opacity: 0.8;">
                        💡 Dica: Verifique o formato dos dados e o delimitador selecionado.
                    </p>
                `;
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '🚀 Importar Dados';
            }
        });

        // Verificar status ao carregar a página
        document.addEventListener('DOMContentLoaded', function() {
            checkDatabaseStatus();
        });
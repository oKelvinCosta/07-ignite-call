# Ignite Call

Aplicação de agendamento de chamadas desenvolvida durante o Ignite da Rocketseat.

## Começando

### Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn
- Git (opcional, mas recomendado)

### Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/ignite-call.git
   cd ignite-call
   ```

2. **Instale as dependências**
   ```bash
   npm install
   # ou
   yarn
   ```

## Configuração do Banco de Dados (SQLite)

1. **Inicialize o Prisma**
   ```bash
   npx prisma init --datasource-provider SQLite
   ```

2. **Instale as dependências do Prisma**
   ```bash
   npm install prisma @prisma/client
   ```

3. **Instale o SQLite (opcional, mas recomendado como devDependency)**
   ```bash
   npm install sqlite3 --save-dev
   ```

4. **Configure o arquivo `.env`**
   Crie ou edite o arquivo `.env` na raiz do projeto:
   ```env
   DATABASE_URL="file:./dev.db"
   GOOGLE_CLIENT_ID="xxxx"
   GOOGLE_CLIENT_SECRET="xxxx"

   # Anything:
   NEXTAUTH_SECRET="xxxx" 
   ```

5. **Execute as migrações**
   Quando alterar algo no schema.prisma usar:
   ```bash
   npx prisma migrate dev --name init
   ```
   
   Use este comando quando:
   - For a primeira vez configurando o banco de dados
   - Fizer alterações no `schema.prisma` (adicionar/remover modelos, campos, etc.)
   - Precisar reiniciar o banco de dados de desenvolvimento

6. **Acesse o Prisma Studio (opcional)**
   ```bash
   npx prisma studio
   ```
   Isso abrirá uma interface web para visualizar e gerenciar seus dados.

## Iniciando a Aplicação

1. **Modo de Desenvolvimento**
   ```bash
   npm run dev
   # ou
   yarn dev
   ```
   A aplicação estará disponível em `http://localhost:3000`

2. **Build para Produção**
   ```bash
   npm run build
   npm start
   # ou
   yarn build
   yarn start
   ```

## Notas Importantes

- O SQLite é usado por padrão para desenvolvimento. Para produção, considere usar PostgreSQL ou MySQL.
- O comando `npx prisma migrate dev` já instala automaticamente o cliente do Prisma, mas é recomendado manter a instalação explícita.
- Mantenha suas variáveis de ambiente seguras e nunca as comite no controle de versão.


## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

Desenvolvido com  por [Seu Nome]
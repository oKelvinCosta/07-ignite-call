Prisma com SQLite:

1. Inicialização do Prisma
bash
npx prisma init --datasource-provider SQLite


2. Instalação das dependências
bash
npm i prisma @prisma/client


3. Instalação do SQLite (opcional, mas recomendado como devDependency)
bash
npm install sqlite3 --save-dev


4. Configuração do arquivo 
.env
Edite o arquivo 
.env
 para usar SQLite:

DATABASE_URL="file:./dev.db"


5. Crie e aplique as migrações
bash
npx prisma migrate dev --name init

Quando usar:
Primeira vez que está configurando o banco de dados
Sempre que alterar seu 
schema.prisma
 (adicionar/remover modelos, campos, etc.)
Quando precisar reiniciar o banco de dados de desenvolvimento



6. (Opcional) Inicie o Prisma Studio para visualizar os dados
bash
npx prisma studio
Notas importantes:
O --save-dev é opcional para o sqlite3, mas recomendado se for usar apenas em desenvolvimento
O npx prisma migrate dev já instala automaticamente o cliente do Prisma, mas é bom manter a instalação explícita
O SQLite é ótimo para desenvolvimento, mas considere PostgreSQL ou MySQL para produção
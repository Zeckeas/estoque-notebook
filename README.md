# Sistema de Gerenciamento de Estoque de Notebooks

Este projeto é um sistema de gerenciamento de estoque de notebooks que utiliza React, TypeScript e Supabase.

## Configuração do Ambiente

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   - Copie o arquivo `.env.example` para `.env`
   - Preencha as variáveis com suas credenciais do Supabase:
     ```
     VITE_SUPABASE_URL=sua-url-do-projeto-supabase
     VITE_SUPABASE_ANON_KEY=sua-chave-anonima-do-supabase
     ```

4. Configuração do Banco de Dados:
   - Acesse o painel do Supabase
   - Vá para SQL Editor
   - Execute o script SQL localizado em `supabase/migrations/00000000000000_initial_schema.sql`

5. Configuração da Autenticação:
   - No painel do Supabase, vá para Authentication > Settings
   - Habilite Email Auth Provider
   - Configure as políticas de acesso em Database > Policies
   - Crie um usuário inicial através do painel do Supabase:
     - Authentication > Users > Invite User
     - O usuário receberá um email para definir sua senha

## Estrutura do Banco de Dados

O banco de dados consiste em três tabelas principais:

1. `locais`: Armazena os locais disponíveis (Sala de TI e Servidor)
2. `notebooks`: Mantém o controle do estoque de notebooks em cada local
3. `entregas`: Registra o histórico de entregas de notebooks

## Segurança

O sistema implementa:
- Autenticação de usuários via email/senha
- Proteção de rotas para usuários não autenticados
- Políticas de acesso ao banco de dados baseadas no usuário

## Desenvolvimento

Para iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

## Build e Deploy

Para criar uma build de produção:

```bash
npm run build
```
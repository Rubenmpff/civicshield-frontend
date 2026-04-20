# 🛡️ CivicShield

> **Plataforma digital de apoio comunitário para coordenação de ajuda em situações de emergência.**

CivicShield é uma aplicação web em tempo real que liga voluntários, pessoas vulneráveis e entidades locais, permitindo gerir pedidos de ajuda de forma segura, rastreável e eficiente. Desenvolvida como Projeto de Trabalho Final de Curso no IADE, a plataforma combina inteligência geoespacial, validação física por QR Code e políticas de segurança avançadas (Row Level Security) para garantir que o auxílio chega a quem mais precisa.

---

## 📋 Índice

- [Descrição do Projeto](#-descrição-do-projeto)
- [Funcionalidades](#-funcionalidades)
- [Stack Tecnológica](#-stack-tecnológica)
- [Arquitetura Técnica](#-arquitetura-técnica)
- [Estrutura de Ficheiros](#-estrutura-de-ficheiros)
- [Instalação e Configuração](#-instalação-e-configuração)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Utilização](#-utilização)
- [KPIs e Métricas](#-kpis-e-métricas)
- [Segurança e Privacidade](#-segurança-e-privacidade)
- [Autores](#-autores)

---

## 📖 Descrição do Projeto

O CivicShield surge como resposta estratégica à crescente vulnerabilidade das populações perante fenómenos naturais extremos e às falhas de comunicação no socorro. A saturação dos canais de emergência convencionais e a ausência de ferramentas que coordenem o voluntariado de forma segura impedem frequentemente que a ajuda chegue eficazmente aos cidadãos mais vulneráveis.

A plataforma foca-se na identificação e assistência a grupos vulneráveis — como idosos e pessoas com mobilidade reduzida — que frequentemente ficam "invisíveis" perante os serviços de emergência tradicionais. O sistema abrange desde a gestão de voluntários locais até à monitorização em tempo real pelas autoridades.

### Problema

**Invisibilidade de populações vulneráveis e ineficiência na coordenação de voluntários civis durante crises.**

### Solução

Um protótipo funcional que utiliza tecnologias web em tempo real e inteligência geoespacial para mediar e auditar o apoio comunitário, complementado por um protocolo de validação física através de pulseiras QR Code que garante a prova de assistência no local.

---

## ✨ Funcionalidades

### Para Cidadãos
- **Registo de pedidos de ajuda** com título, descrição, prioridade, morada e contacto
- **Acompanhamento em tempo real** do estado do pedido (pendente → em curso → concluído)
- **Dashboard personalizado** com resumo da atividade e estado da candidatura

### Para Voluntários
- **Candidatura a voluntário** com submissão de documentos obrigatórios (Cartão de Cidadão e Registo Criminal)
- **Aceitação de missões** disponíveis na área
- **Conclusão de missões** com registo histórico
- **Mapa interativo** com visualização geoespacial de pedidos e voluntários disponíveis
- **Acesso à rede de voluntários** após aprovação

### Para Administradores
- **Validação de documentos** de candidatos a voluntário com aprovação/rejeição individual
- **Gestão de utilizadores** — ativar/desativar contas, promover a entidade institucional
- **Painel de monitorização** com KPIs operacionais em tempo real
- **Controlo total de permissões** por papel (role-based access control)

### Sistema de Validação QR
- Pulseiras físicas com UUID em formato QR Code
- Confirmação de presença no local da missão
- Rastreabilidade completa de cada intervenção comunitária

---

## 🧰 Stack Tecnológica

| Camada | Tecnologia | Versão | Propósito |
|---|---|---|---|
| **Frontend** | React | 18+ | Interface de utilizador reativa |
| **Routing** | React Router DOM | v6 | Navegação entre páginas |
| **Estilização** | Tailwind CSS | v3 | Design responsivo e utilitário |
| **Backend as a Service** | Supabase | — | Base de dados, autenticação e storage |
| **Base de Dados** | PostgreSQL + PostGIS | — | Dados relacionais e geoespaciais |
| **Tempo Real** | Supabase Realtime (WebSockets) | — | Propagação de eventos em < 1 segundo |
| **Mapas** | Leaflet.js + React-Leaflet | — | Visualização geoespacial interativa |
| **Tiles de Mapa** | OpenStreetMap | — | Cartografia base open-source |
| **Notificações** | Sonner | — | Toasts de feedback ao utilizador |
| **Ícones** | Lucide React | — | Biblioteca de ícones SVG |
| **Offline** | Progressive Web App (PWA) | — | Resiliência operacional sem rede |
| **Segurança** | Row Level Security (RLS) | — | Controlo de acesso ao nível da BD |
| **Tipografia** | Plus Jakarta Sans | — | Fonte principal da interface |

---

## 🏗️ Arquitetura Técnica

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                      │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Páginas │  │Components│  │ Context  │  │   UI     │   │
│  │          │  │          │  │          │  │ Library  │   │
│  │ Home     │  │ Sidebar  │  │ AuthCtx  │  │ Button   │   │
│  │ Dashboard│  │ Navbar   │  │          │  │ Input    │   │
│  │ Requests │  │ Layout   │  │          │  │ Table    │   │
│  │ Map      │  │ LeafletMap│ │          │  │ Dialog   │   │
│  │ Volunteers│ │          │  │          │  │ ...      │   │
│  │ Admin... │  │          │  │          │  │          │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────┬───────────────────────────────────┘
                          │ Supabase Client SDK
┌─────────────────────────▼───────────────────────────────────┐
│                    SUPABASE (BaaS)                           │
│                                                              │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │    Auth     │  │   Realtime   │  │     Storage      │   │
│  │             │  │  WebSockets  │  │                  │   │
│  │ JWT Sessions│  │  < 1s latency│  │ volunteer-docs   │   │
│  │ Email/Pass  │  │              │  │ (PDFs, imagens)  │   │
│  └─────────────┘  └──────────────┘  └──────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              PostgreSQL + PostGIS                     │   │
│  │                                                       │   │
│  │  profiles │ user_roles │ help_requests │ missions    │   │
│  │  volunteer_documents │ volunteer_status              │   │
│  │                                                       │   │
│  │  Row Level Security (RLS) — acesso por contexto      │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Fluxo de Autenticação e Papéis

```
Utilizador regista-se
        │
        ▼
  Cria perfil em "profiles"
  Atribui role em "user_roles"
        │
        ├── requester     → Pode criar pedidos de ajuda
        ├── volunteer     → Pode aceitar missões (após aprovação)
        ├── institution_admin → Vista de gestão
        └── platform_admin   → Acesso total + administração
```

### Fluxo de Candidatura a Voluntário

```
Registo com "isVolunteer: true"
        │
        ▼
volunteer_status: "pending"
        │
        ▼
Submissão de documentos
(Cartão de Cidadão + Registo Criminal)
        │
        ▼
Revisão pelo platform_admin
        │
        ├── Aprovado → role "volunteer" atribuído
        └── Rejeitado → utilizador notificado para corrigir
```

---

## 📁 Estrutura de Ficheiros

```
civicshield/
│
├── public/
│   └── index.html
│
├── src/
│   ├── App.jsx                        # Routing principal e providers
│   ├── main.jsx                       # Entry point da aplicação
│   ├── index.css                      # Estilos globais e Tailwind
│   │
│   ├── assets/
│   │   └── logo.png                   # Logótipo CivicShield
│   │
│   ├── context/
│   │   └── AuthContext.jsx            # Contexto global de autenticação
│   │
│   ├── lib/
│   │   └── supabase.js                # Cliente Supabase configurado
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── DashboardLayout.jsx    # Layout com sidebar para páginas autenticadas
│   │   │   ├── Sidebar.jsx            # Menu lateral dinâmico (por role)
│   │   │   └── Navbar.jsx             # Barra de navegação da landing page
│   │   │
│   │   ├── map/
│   │   │   └── LeafletMap.jsx         # Mapa interativo com marcadores dinâmicos
│   │   │
│   │   └── ui/
│   │       ├── button.jsx             # Componente Button reutilizável
│   │       ├── input.jsx              # Componente Input
│   │       ├── label.jsx              # Componente Label
│   │       ├── dialog.jsx             # Componente Dialog/Modal
│   │       ├── select.jsx             # Componente Select
│   │       ├── table.jsx              # Componente Table
│   │       ├── textarea.jsx           # Componente Textarea
│   │       └── toaster.jsx            # Componente Toaster
│   │
│   ├── pages/
│   │   ├── Home.jsx                   # Landing page pública
│   │   ├── Login.jsx                  # Página de autenticação
│   │   ├── Register.jsx               # Registo com opções de perfil
│   │   ├── Dashboard.jsx              # Painel principal do utilizador
│   │   ├── Requests.jsx               # Gestão de pedidos de ajuda
│   │   ├── MapPage.jsx                # Mapa de crises em tempo real
│   │   ├── Volunteers.jsx             # Rede de voluntários
│   │   ├── VolunteerDocuments.jsx     # Submissão de documentos pelo candidato
│   │   ├── AdminUsers.jsx             # Administração de utilizadores
│   │   └── AdminDocuments.jsx         # Validação de documentos pelo admin
│   │
│   └── services/
│       └── api.js                     # Abstração de chamadas à API
│
├── .env                               # Variáveis de ambiente (não versionar)
├── .env.example                       # Exemplo de variáveis necessárias
├── package.json
└── README.md
```

---

## ⚙️ Instalação e Configuração

### Pré-requisitos

- **Node.js** v18 ou superior
- **npm** v9 ou superior (ou **yarn**)
- Conta no [Supabase](https://supabase.com) com projeto criado

### 1. Clonar o repositório

```bash
git clone https://github.com/teu-utilizador/civicshield.git
cd civicshield
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar as variáveis de ambiente

Copia o ficheiro de exemplo e preenche com as tuas credenciais do Supabase:

```bash
cp .env.example .env
```

Edita o ficheiro `.env` com os valores do teu projeto Supabase (ver secção abaixo).

### 4. Configurar a base de dados no Supabase

No painel do Supabase, executa os seguintes scripts SQL para criar as tabelas necessárias:

```sql
-- Perfis de utilizador
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  account_type TEXT DEFAULT 'individual',
  organization_name TEXT,
  organization_type TEXT,
  verification_status TEXT,
  is_active BOOLEAN DEFAULT true,
  admin_request BOOLEAN DEFAULT false,
  wants_volunteer BOOLEAN DEFAULT false,
  volunteer_status TEXT DEFAULT 'none',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Papéis de utilizador
CREATE TABLE user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  role TEXT NOT NULL,
  UNIQUE(user_id, role)
);

-- Pedidos de ajuda
CREATE TABLE help_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'pending',
  address TEXT,
  contact_phone TEXT,
  latitude FLOAT,
  longitude FLOAT,
  assigned_volunteer_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Missões
CREATE TABLE missions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  help_request_id UUID REFERENCES help_requests(id),
  volunteer_id UUID REFERENCES profiles(id),
  status TEXT DEFAULT 'in_progress',
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Estado dos voluntários
CREATE TABLE volunteer_status (
  user_id UUID REFERENCES profiles(id) PRIMARY KEY,
  status TEXT DEFAULT 'offline',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documentos de voluntário
CREATE TABLE volunteer_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  document_type TEXT NOT NULL,
  file_path TEXT,
  original_name TEXT,
  mime_type TEXT,
  file_size INTEGER,
  status TEXT DEFAULT 'pending',
  rejection_reason TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, document_type)
);
```

### 5. Configurar o Storage no Supabase

Cria um bucket privado chamado `volunteer-documents` no painel do Supabase Storage.

### 6. Ativar a extensão PostGIS (opcional, para consultas geoespaciais avançadas)

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
```

### 7. Iniciar o servidor de desenvolvimento

```bash
npm start
```

A aplicação ficará disponível em [http://localhost:3000](http://localhost:3000).

### 8. Build para produção

```bash
npm run build
```

---

## 🔐 Variáveis de Ambiente

Cria um ficheiro `.env` na raiz do projeto com o seguinte conteúdo:

```env
REACT_APP_SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxx.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> ⚠️ **Nunca** adiciones o ficheiro `.env` ao controlo de versões. Adiciona-o ao `.gitignore`.

Encontras estes valores em: **Supabase Dashboard → Project Settings → API**.

---

## 🚀 Utilização

### Conta de demonstração (ambiente local)

| Tipo | Email | Password |
|---|---|---|
| Super Admin | `admin@civicshield.com` | `admin123` |

### Fluxo base de utilização

**Como cidadão a pedir ajuda:**
1. Regista-te em `/register`
2. Acede ao Dashboard e clica em **Pedidos de Ajuda**
3. Cria um novo pedido com título, descrição e prioridade
4. Acompanha o estado em tempo real

**Como voluntário:**
1. Regista-te em `/register` com a opção "Quero candidatar-me a voluntário"
2. Acede a **A minha candidatura** e submete o Cartão de Cidadão e o Registo Criminal
3. Após aprovação pelo administrador, aceita missões em **Pedidos de Ajuda**
4. Conclui a missão no terreno e valida com QR Code

**Como administrador:**
1. Acede a **Administração** para gerir utilizadores e permissões
2. Acede a **Documentos** para validar candidaturas de voluntários

---

## 📊 KPIs e Métricas

O sucesso operacional do CivicShield é medido através de três indicadores fundamentais de desempenho, definidos no âmbito académico do projeto:

| KPI | Valor Alvo | Tecnologia | Descrição |
|---|---|---|---|
| **Latência Real-time** | < 1 segundo | WebSockets (Supabase Realtime) | Tempo de propagação de um pedido de auxílio até ao mapa do voluntário |
| **Precisão Geoespacial** | < 10 metros | PostGIS | Margem de erro no posicionamento e cálculo de distâncias |
| **Taxa de Validação QR** | 100% | Hardware passivo (QR Code) | Sucesso na confirmação de presença em missões simuladas |
| **Usabilidade (SUS)** | > 70 / 100 | Testes com utilizadores reais | Pontuação na System Usability Scale — limiar mínimo de operabilidade intuitiva |
| **Cobertura RLS** | 100% | Row Level Security (PostgreSQL) | Eficácia das políticas de acesso a dados sensíveis |

---

## 🔒 Segurança e Privacidade

O CivicShield foi desenhado com o princípio de **Privacy by Design**, em conformidade com o RGPD:

### Row Level Security (RLS)
Todas as tabelas com dados sensíveis (localização, contactos, documentos) têm políticas RLS ativas ao nível do motor de base de dados. Os dados de geolocalização de um cidadão vulnerável **só são revelados ao voluntário designado** e apenas após a aceitação formal da missão.

### Acesso a Documentos
Os documentos submetidos (Cartão de Cidadão, Registo Criminal) estão num bucket privado no Supabase Storage. O acesso é feito exclusivamente através de **URLs assinados com expiração de 60 segundos**, gerados no momento da consulta.

### Resiliência Offline (PWA)
A arquitetura Progressive Web App com Service Workers garante que a aplicação funciona mesmo sem ligação à internet, sincronizando os dados quando a conectividade é restabelecida — essencial em cenários de catástrofe onde as redes podem estar saturadas.

---

## 👥 Autores

Projeto desenvolvido no âmbito do **Trabalho Final de Curso** no **IADE — Faculdade de Design, Tecnologia e Comunicação**, sob orientação da **Prof. Alexandra Fidalgo**.

| Nome | Nº Estudante | Email |
|---|---|---|
| Catarina Sofia Coelho Cardoso | 20231654 | 20231654@iade.pt |
| Rúben Marcelo Pinto Frias Ferreira | 20231584 | 20231584@iade.pt |
| Sofia Rebolo Leandro | 20231604 | 20231604@iade.pt |

---

## 📚 Referências

- Gao, H. et al. (2011). *Harnessing the Crowdsourcing Power of Social Media for Disaster Relief.*
- Meier, P. (2012). *Crisis Mapping in Ecological Networks*. Em Digital Humanitarians. Routledge.
- Zook, M. et al. (2010). *Volunteered Geographic Information and Crowdsourcing Disaster Relief.*
- [Leaflet.js Documentation](https://leafletjs.com/)
- [PostGIS Documentation](https://postgis.net/docs/)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)
- [React Documentation](https://react.dev/)
- [PostgreSQL Row Level Security](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [W3C Service Workers](https://www.w3.org/TR/service-workers/)

---

<div align="center">
  <sub>© 2025 CivicShield — IADE, Faculdade de Design, Tecnologia e Comunicação</sub>
</div>

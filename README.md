# CivicShield

Plataforma digital de apoio comunitário para coordenação de voluntariado em situações de crise.

---

## Visão Geral

O CivicShield é uma plataforma web desenvolvida para melhorar a coordenação entre voluntários, populações vulneráveis e entidades locais em cenários de emergência.

O projeto responde a um problema crítico:  
falta de comunicação eficiente e coordenação na última linha de apoio comunitário.

A solução combina:
- Comunicação em tempo real
- Inteligência geoespacial
- Validação física através de QR Code

---

## Objetivos

### Objetivo Geral
Desenvolver um protótipo funcional de uma plataforma que permita gerir e validar apoio comunitário de forma eficiente, segura e auditável.

### Objetivos Específicos

- Desenvolver uma aplicação web com React e Supabase
- Implementar comunicação em tempo real (WebSockets)
- Integrar geolocalização com PostGIS
- Criar um sistema de validação por QR Code
- Desenvolver um dashboard de monitorização
- Validar a solução em ambiente controlado

---

## Problema

- Populações vulneráveis tornam-se invisíveis em situações de crise
- Serviços de emergência encontram-se frequentemente saturados
- Falta de ferramentas seguras para coordenação de voluntários

---

## Solução

O CivicShield permite:

- Visualização de pedidos de ajuda num mapa em tempo real  
- Coordenação eficiente de voluntários  
- Validação presencial através de QR Code  
- Proteção de dados com Row Level Security (RLS)  

---

## Funcionalidades

- Gestão de voluntários  
- Acompanhamento de missões  
- Mapa interativo de pedidos  
- Sistema de verificação por QR Code  
- Dashboard administrativo  
- Segurança e controlo de acessos  

---

## Tecnologias

- Frontend: React  
- Backend: Supabase  
- Base de Dados: PostgreSQL + PostGIS  
- Tempo Real: WebSockets (Supabase Realtime)  
- Mapas: Leaflet  
- Segurança: Row Level Security (RLS)  
- Arquitetura: Progressive Web App (PWA)  

---

## Métricas (KPIs)

- Latência real-time: < 1 segundo  
- Precisão geográfica: < 10 metros  
- Segurança: 100% RLS  
- Usabilidade (SUS): > 70/100  
- Validação QR: 100% sucesso  

---

## Riscos e Mitigações

### Instabilidade de Rede
- Implementação de PWA com cache offline  
- Sincronização automática quando a ligação regressa  

### Privacidade de Dados
- Políticas rigorosas de Row Level Security  
- Dados sensíveis apenas acessíveis após aceitação da missão  
- Conformidade com RGPD  

---

## Planeamento

- Março 2026 → Arquitetura e base de dados  
- Abril 2026 → Frontend e autenticação  
- Maio 2026 → Real-time e testes com utilizadores  
- Junho 2026 → Entrega final e defesa  

---

## Entregáveis

- Protótipo funcional (MVP)  
- Sistema de pulseiras QR Code  
- Base de dados geoespacial (PostGIS)  
- Documentação técnica  
- Relatório final  

---

## Metodologia

- Metodologia Agile (Scrum)  
- Desenvolvimento incremental  
- Foco em UX/UI acessível  
- Testes em ambiente simulado  

---

## Impacto Esperado

- Melhor resposta a emergências  
- Maior coordenação de voluntários  
- Inclusão de populações vulneráveis  
- Redução de custos operacionais (~90%)  

---

## Referências

- Meier, P. (2012). Digital Humanitarians  
- Gao et al. (2011). Social media in disasters  
- Zook et al. (2010). Volunteered Geographic Information  

### Documentação
- https://react.dev/  
- https://supabase.com/docs  
- https://postgis.net/docs/  
- https://leafletjs.com/  
- https://www.postgresql.org/docs/current/ddl-rowsecurity.html  

---

## Autores

- Catarina Sofia Coelho Cardoso  
- Ruben Marcelo Pinto Frias Ferreira  
- Sofia Rebolo Leandro  

---

## Estado do Projeto

Protótipo em desenvolvimento

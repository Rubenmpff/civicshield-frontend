# 🛡️ CivicShield

**Plataforma digital de apoio comunitário e para coordenação de voluntariado em situações de crise.** 🚨

O **CivicShield** é um ecossistema de ajuda mútua que conecta cidadãos vulneráveis, voluntários e autoridades. 🤝 Através de hardware inclusivo (**pulseiras QR**), idosos e pessoas com mobilidade reduzida recebem auxílio. 👵 Estes pedidos são geridos por uma rede de voluntários via aplicação móvel e monitorizados em tempo real por entidades como a **Proteção Civil** e Juntas de Freguesia, que utilizam dashboards geoespaciais para garantir uma resposta comunitária eficiente, segura e auditável. 🏛️

---

## 📖 Visão Geral
O projeto responde a um problema crítico: falta de comunicação eficiente e coordenação na última linha de apoio comunitário. 🆘

## 🛠️ Problema
- 🌫️ Populações vulneráveis tornam-se invisíveis em situações de crise
- 📈 Serviços de emergência encontram-se frequentemente saturados
- 🔐 Falta de ferramentas seguras para coordenação de voluntários

## 💡 Solução
O CivicShield permite:
- 📍 Visualização de pedidos de ajuda num mapa em tempo real  
- 🤝 Coordenação eficiente de voluntários  
- ✅ Validação presencial através de QR Code  
- 🛡️ Proteção de dados com Row Level Security (RLS)  

---

## 🎯 Objetivos

### Objetivo Geral
Desenvolver um protótipo funcional de uma plataforma que permita gerir e validar apoio comunitário de forma eficiente, segura e auditável. 🏁

### Objetivos Específicos
* **💻 Desenvolvimento:** Criar uma aplicação web robusta com React e Supabase.
* **⚡ Real-time:** Implementar comunicação instantânea via WebSockets.
* **🗺️ Geoespacial:** Integrar geolocalização precisa com PostGIS.
* **✅ Validação:** Criar um sistema de verificação física por QR Code.
* **📊 Monitorização:** Desenvolver um dashboard administrativo para autoridades.
* **🧪 Validação:** Testar a solução em ambiente controlado e simulado.

---

## 👥 Público-Alvo
* **👵 Beneficiários:** Idosos e pessoas isoladas ou com mobilidade reduzida que utilizam hardware passivo (pulseiras) para assistência.
* **🙋 Voluntários:** Cidadãos solidários que utilizam a app para missões de proximidade (entregas, apoio logístico, bem-estar).
* **🏛️ Entidades Gestoras:** Proteção Civil, Juntas de Freguesia e ONGs que necessitam de uma visão macro da situação.

---

## ✨ Funcionalidades
- 👥 Gestão de voluntários  
- 🚀 Acompanhamento de missões  
- 🗺️ Mapa interativo de pedidos  
- 🔍 Sistema de verificação por QR Code  
- 🖥️ Dashboard administrativo  
- 🔐 Segurança e controlo de acessos  

---

## 🏗️ Arquitetura
* **Frontend:** React (PWA - Progressive Web App) ⚛️
* **Backend:** Supabase (BaaS) ⚡
* **Base de Dados:** PostgreSQL + PostGIS 🗺️
* **Tempo Real:** WebSockets (Supabase Realtime) 🚀
* **Mapas:** Leaflet 📍
* **Segurança:** Row Level Security (RLS) 🛡️
* **Arquitetura:** Progressive Web App (PWA) 📱

---

## ⚙️ Metodologia
- 🏃 Metodologia Agile (Scrum)  
- 🧩 Desenvolvimento incremental  
- 🎨 Foco em UX/UI acessível  
- 🧪 Testes em ambiente simulado  

---

## 🌟 Impacto Esperado
- 🚑 Melhor resposta a emergências  
- 🤝 Maior coordenação de voluntários  
- 🌍 Inclusão de populações vulneráveis  
- 💰 Redução de custos operacionais (~90%)  

---

## 📈 Métricas de Sucesso (KPIs)
* **⏱️ Latência:** < 1 segundo em atualizações real-time.
* **🎯 Precisão:** < 10 metros em dados geográficos.
* **🛡️ Segurança:** 100% de cobertura via políticas RLS.
* **📱 Usabilidade:** Pontuação SUS > 70/100.
* **✅ Validação:** 100% de sucesso na leitura de QR Codes.
* **💎 Impacto:** Redução estimada de 90% nos custos operacionais.

---

## ⚠️ Riscos e Mitigações
* **📶 Instabilidade de Rede:** Implementação de cache offline e sincronização automática pós-crise através de Service Workers.
* **🔒 Privacidade de Dados:** Implementação de políticas RLS; dados sensíveis apenas acessíveis após a aceitação formal da missão (Conformidade RGPD).

---

## 📅 Planeamento e Entregáveis

<img width="418" height="392" alt="image" src="https://github.com/user-attachments/assets/b02d6d99-b05a-4d47-8c3d-44ba8e19216d" />

<img width="1006" height="402" alt="image" src="https://github.com/user-attachments/assets/a4ebed05-af03-4035-a368-ba5b57173648" />


* **📅 Março 2026:** Arquitetura e Base de Dados.
* **📅 Abril 2026:** Frontend e Autenticação.
* **📅 Maio 2026:** Real-time e Testes de Utilizador.
* **📅 Junho 2026:** Entrega Final e Defesa.


---

## 📚 Referências Bibliográficas

Gao, H., Barbier, G., & Goolsby, R. (2011). Harnessing the crowdsourcing power of social media for disaster relief. *IEEE Intelligent Systems*, *26*(3), 10–14. https://doi.org/10.1109/MIS.2011.52

Leaflet JS Authors. (2026). *Leaflet: An open-source JavaScript library for interactive maps*. https://leafletjs.com/

Meier, P. (2012). *Digital humanitarians: How big data is changing the face of humanitarian response*. Routledge.

PostGIS Steering Committee. (2026). *PostGIS documentation*. https://postgis.net/docs/

PostgreSQL Global Development Group. (2026). *Row level security policies*. https://www.postgresql.org/docs/current/ddl-rowsecurity.html

React Open Source Team. (2026). *React documentation*. https://react.dev/

Supabase. (2026). *Supabase documentation*. https://supabase.com/docs

Zook, M., Graham, M., Shelton, T., & Gorman, S. (2010). Volunteered geographic information and crowdsourcing disaster relief: A case study of the Haitian earthquake. *World Medical & Health Policy*, *2*(2), 7–33. https://doi.org/10.2202/1948-4682.1069

---

## 👥 Autores
| Nome | Nº Estudante | Email |
| :--- | :--- | :--- |
| **Catarina Sofia Coelho Cardoso** | 20231654 | 20231654@iade.pt |
| **Rúben Marcelo Pinto Frias Ferreira** | 20231584 | 20231584@iade.pt |
| **Sofia Rebolo Leandro** | 20231604 | 20231604@iade.pt |

---

## 🏗️ Estado do Projeto
Protótipo em desenvolvimento 🚧

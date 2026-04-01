// Estratégia — inicia o fluxo, distribui para múltiplas áreas
export const flowTemplates = [
  {
    id: 1, label: "Diretoria",
    options: [
      { id: 101, label: "Produto & Tecnologia" },
      { id: 102, label: "Operações" },
      { id: 103, label: "Negócio & Processos" },
      { id: 104, label: "Corporativo" },
    ],
  },
  {
    id: 2, label: "Gerência",
    options: [
      { id: 201, label: "Desenvolvimento" },
      { id: 202, label: "QA" },
      { id: 203, label: "DevOps" },
      { id: 204, label: "Suporte" },
      { id: 205, label: "Manutenção" },
    ],
  },

  // Produto & Tecnologia
  {
    id: 3, label: "Produto",
    options: [
      { id: 301, label: "Discovery" },
      { id: 302, label: "Backlog" },
      { id: 303, label: "Entrega" },
    ],
  },
  {
    id: 4, label: "Arquitetura",
    options: [
      { id: 401, label: "Backend" },
      { id: 402, label: "Frontend" },
    ],
  },
  {
    id: 5, label: "Desenvolvimento",
    options: [
      { id: 501, label: "Feature" },
      { id: 502, label: "Bugfix" },
      { id: 503, label: "Refactor" },
      { id: 504, label: "Hotfix" },
      { id: 505, label: "Release" },
      { id: 506, label: "Infra" },
    ],
  },
  {
    id: 6, label: "QA / Qualidade",
    options: [
      { id: 601, label: "Testes Unitários" },
      { id: 602, label: "Testes de Integração" },
      { id: 603, label: "Testes E2E" },
    ],
  },
  {
    id: 7, label: "DevOps",
    options: [
      { id: 701, label: "CI" },
      { id: 702, label: "CD" },
    ],
  },

  // Operações
  {
    id: 8, label: "Homologação",
    options: [
      { id: 801, label: "Validação Funcional" },
      { id: 802, label: "Aprovação de Negócio" },
    ],
  },
  {
    id: 9, label: "Produção",
    options: [
      { id: 901, label: "Deploy" },
    ],
  },
  {
    id: 10, label: "Manutenção",
    options: [
      { id: 1001, label: "Corretiva" },
      { id: 1002, label: "Preventiva" },
      { id: 1003, label: "Evolutiva" },
      { id: 1004, label: "Adaptativa" },
    ],
  },
  {
    id: 11, label: "Suporte",
    options: [
      { id: 1101, label: "N1" },
      { id: 1102, label: "N2" },
      { id: 1103, label: "N3" },
    ],
  },

  // Negócio & Processos
  {
    id: 12, label: "Comercial",
    options: [
      { id: 1201, label: "Prospecção" },
      { id: 1202, label: "Proposta" },
      { id: 1203, label: "Fechamento" },
    ],
  },
  {
    id: 13, label: "Marketing",
    options: [
      { id: 1301, label: "Aquisição" },
      { id: 1302, label: "Retenção" },
    ],
  },
  {
    id: 14, label: "Financeiro",
    options: [
      { id: 1401, label: "Contas a Pagar" },
      { id: 1402, label: "Contas a Receber" },
    ],
  },
  {
    id: 15, label: "Jurídico",
    options: [
      { id: 1501, label: "Contratos" },
    ],
  },
  {
    id: 16, label: "RH",
    options: [
      { id: 1601, label: "Recrutamento" },
      { id: 1602, label: "Benefícios" },
    ],
  },
  {
    id: 17, label: "Documentação",
    options: [],
  },
]

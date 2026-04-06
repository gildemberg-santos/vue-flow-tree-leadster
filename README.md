# Vue Flow Tree Leadster

Uma biblioteca Vue.js para criar árvores de fluxo interativas e dinâmicas. Ideal para fluxos visuais, árvores de decisão e diagramas interativos.

## Instalação

```bash
npm install vue-flow-tree-leadster
```

```bash
yarn add vue-flow-tree-leadster
```

```bash
pnpm add vue-flow-tree-leadster
```

Certifique-se de ter Vue.js 3.4+ instalado no projeto.

## Como Usar

### Exemplo: Uso Completo

```vue
<template>
  <FlowTree
    :templates="flowTemplates"
    :max-levels="5"
    :is-admin="true"
    :on-load="handleLoad"
    :on-save="handleSave"
    :on-generate-id="generateId"
    @save="onSave"
  />
</template>

<script setup>
import FlowTree from 'vue-flow-tree-leadster'

const flowTemplates = [
  {
    id: 'pergunta',
    label: 'Pergunta',
    maxConnections: 2,
    options: [
      { id: 'sim', label: 'Sim' },
      { id: 'nao', label: 'Não' }
    ]
  },
  {
    id: 'acao',
    label: 'Ação',
    maxConnections: 1
  },
  {
    id: 'final',
    label: 'Final',
    maxConnections: 0
  }
]

function generateId() {
  return crypto.randomUUID()
}

async function handleLoad() {
  const saved = localStorage.getItem('my-flow')
  return saved ? JSON.parse(saved) : null
}

async function handleSave(data) {
  localStorage.setItem('my-flow', JSON.stringify(data))
}

function onSave(data) {
  console.log('Fluxo salvo:', data)
}
</script>
```

## Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|------------|
| `templates` | `Array` | `[]` | Array de templates de nós. |
| `maxLevels` | `Number` | `3` | Número máximo de níveis (máx: 10). |
| `isAdmin` | `Boolean` | `false` | Permite selecionar o nível do nó manualmente. |
| `onLoad` | `Function` | `null` | Carrega dados salvos. Retorna `{ nodes, edges }` ou `null`. |
| `onSave` | `Function` | `null` | Salva os dados do fluxo. Recebe `{ nodes, edges }`. |
| `onGenerateId` | `Function` | `null` | Gera IDs únicos para novos nós. |

## Eventos

| Evento | Dados | Descrição |
|--------|-------|------------|
| `save` | `{ nodes, edges }` | Emitido ao salvar o fluxo. |

## Estrutura dos Templates

```javascript
{
  id: 'pergunta',           // ID único do template
  label: 'Pergunta',        // Nome exibido no nó
  maxConnections: 2,       // Máximo de conexões de saída
  options: [               // Opções de conexão (opcional)
    { id: 'sim', label: 'Sim' },
    { id: 'nao', label: 'Não' }
  ]
}
```

## Funcionalidades

- **Criação de Nós**: Adicione nós via template ou definindo o nível.
- **Conexões**: Arraste de um nó para outro para conectar.
- **Templates com Opções**: Defina opções para guiar o fluxo.
- **Validação em Tempo Real**: Painel mostra erros e sugestões.
- **Personalização de Cores**: Configure cores por nível.
- **Tema Claro/Escuro**: Alterne via toolbar.
- **Persistência**: Configurações salvas no localStorage.
- **Notificação de Versão**: Alerta quando há atualização.

## Estrutura de Dados

```javascript
// Nós
{
  id: 'uuid',
  label: 'Nome do nó',
  level: 1,
  position: { x: 100, y: 200 },
  templateId: 'pergunta',
  maxConnections: 2
}

// Conexões
{
  id: 'uuid',
  source: 'id-origem',
  target: 'id-destino',
  optionId: 'sim' // opcional
}
```

## Contribuição

1. Fork do repositório
2. Crie uma branch: `git checkout -b minha-funcionalidade`
3. Commit: `git commit -m 'Minha funcionalidade'`
4. Push: `git push origin minha-funcionalidade`
5. Abra um Pull Request

## Licença

MIT
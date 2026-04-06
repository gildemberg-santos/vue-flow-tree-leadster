# Vue Flow Tree Leadster

Uma biblioteca para criar árvores de fluxo interativas e dinâmicas utilizando Vue.js. Ideal para criar fluxos visuais, árvores de decisão e diagramas interativos.

## Instalação

Para instalar a biblioteca, utilize uma das opções abaixo:

### Usando npm (via npm registry)
```bash
npm install vue-flow-tree-leadster
```

### Usando yarn (via npm registry)
```bash
yarn add vue-flow-tree-leadster
```

### Usando pnpm (via npm registry)
```bash
pnpm add vue-flow-tree-leadster
```

### Instalando diretamente do GitHub
Se preferir instalar diretamente do repositório GitHub, utilize um dos comandos abaixo:

#### Usando HTTPS
```bash
npm install gildemberg-santos/vue-flow-tree-leadster
yarn add gildemberg-santos/vue-flow-tree-leadster
pnpm add gildemberg-santos/vue-flow-tree-leadster
```

#### Usando SSH
```bash
npm install git@github.com:gildemberg-santos/vue-flow-tree-leadster.git
yarn add git@github.com:gildemberg-santos/vue-flow-tree-leadster.git
pnpm add git@github.com:gildemberg-santos/vue-flow-tree-leadster.git
```

Certifique-se de que você tenha o Vue.js instalado no seu projeto antes de adicionar esta biblioteca.

## Como Usar

Aqui está um exemplo básico de como utilizar a biblioteca:

### Exemplo 1: Uso Básico
```vue
<template>
  <div>
    <FlowTree :nodes="nodes" :edges="edges" />
  </div>
</template>

<script>
import FlowTree from 'vue-flow-tree-leadster';

export default {
  components: {
    FlowTree,
  },
  data() {
    return {
      nodes: [
        { id: 1, label: 'Início' },
        { id: 2, label: 'Opção 1' },
        { id: 3, label: 'Opção 2' },
      ],
      edges: [
        { from: 1, to: 2 },
        { from: 1, to: 3 },
      ],
    };
  },
};
</script>
```

### Exemplo 2: Configuração Avançada
```vue
<template>
  <div>
    <FlowTree :nodes="nodes" :edges="edges" :options="options" />
  </div>
</template>

<script>
import FlowTree from 'vue-flow-tree-leadster';

export default {
  components: {
    FlowTree,
  },
  data() {
    return {
      nodes: [
        { id: 1, label: 'Início', color: 'blue' },
        { id: 2, label: 'Opção 1', color: 'green' },
        { id: 3, label: 'Opção 2', color: 'red' },
      ],
      edges: [
        { from: 1, to: 2 },
        { from: 1, to: 3 },
      ],
      options: {
        draggable: true,
        zoomable: true,
      },
    };
  },
};
</script>
```

## Funcionalidades

- **Criação de Nós e Conexões**: Adicione nós e conecte-os facilmente.
- **Interatividade**: Suporte para arrastar, soltar e zoom.
- **Customização**: Personalize cores, estilos e comportamentos.
- **Integração Simples**: Fácil de integrar com outros componentes Vue.js.

## Contribuindo

Se você deseja contribuir com a biblioteca, siga estas etapas:

1. Faça um fork do repositório.
2. Crie uma nova branch para suas alterações:
   ```bash
   git checkout -b minha-nova-funcionalidade
   ```
3. Faça commit das suas alterações:
   ```bash
   git commit -m "Adiciona nova funcionalidade"
   ```
4. Envie suas alterações para o repositório remoto:
   ```bash
   git push origin minha-nova-funcionalidade
   ```
5. Abra um Pull Request.

## Licença

Este projeto está licenciado sob a licença [MIT](LICENSE). Sinta-se à vontade para usá-lo e modificá-lo conforme necessário.
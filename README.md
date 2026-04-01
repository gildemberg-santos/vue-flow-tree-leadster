# Vue Flow Tree Leadster

Uma biblioteca para criar árvores de fluxo interativas e dinâmicas utilizando Vue.js. Ideal para criar fluxos visuais, árvores de decisão e diagramas interativos.

## Instalação

Para instalar a biblioteca, utilize o npm ou yarn:

### Usando npm
```bash
npm install vue-flow-tree-leadster
```

### Usando yarn
```bash
yarn add vue-flow-tree-leadster
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
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import NodeEditModal from './NodeEditModal.vue'

const defaultForm = { label: '', level: 1, maxConnections: null }

function mountComponent(props = {}, formValue = defaultForm) {
  return mount(NodeEditModal, {
    props: {
      mode: 'edit',
      error: '',
      templates: [],
      maxLevels: 3,
      isAdmin: false,
      form: formValue,
      ...props,
    },
    global: {
      stubs: {
        teleport: true,
      },
    },
  })
}

describe('NodeEditModal', () => {
  let wrapper

  describe('renderização básica', () => {
    beforeEach(() => {
      wrapper = mountComponent()
    })

    it('monta sem erros', () => {
      expect(wrapper.exists()).toBe(true)
    })

    it('renderiza modal-overlay', () => {
      expect(wrapper.find('.modal-overlay').exists()).toBe(true)
    })

    it('renderiza modal', () => {
      expect(wrapper.find('.modal').exists()).toBe(true)
    })
  })

  describe('título do modal', () => {
    it('exibe "Editar Nó" no modo edit', () => {
      const wrapper = mountComponent({ mode: 'edit' })
      expect(wrapper.find('.modal-title').text()).toBe('Editar Nó')
    })

    it('exibe "Adicionar Nó" no modo add', () => {
      const wrapper = mountComponent({ mode: 'add' })
      expect(wrapper.find('.modal-title').text()).toBe('Adicionar Nó')
    })
  })

  describe('input label', () => {
    it('renderiza input quando não há templates', () => {
      const wrapper = mountComponent({ templates: [] })
      expect(wrapper.find('.node-input').exists()).toBe(true)
    })

    it('não renderiza select quando não há templates', () => {
      const wrapper = mountComponent({ templates: [] })
      expect(wrapper.find('.node-select').exists()).toBe(false)
    })

    it('renderiza select quando há templates', () => {
      const templates = [{ id: 1, label: 'Template A' }]
      const wrapper = mountComponent({ templates })
      expect(wrapper.find('.node-select').exists()).toBe(true)
    })

    it('não renderiza input quando há templates', () => {
      const templates = [{ id: 1, label: 'Template A' }]
      const wrapper = mountComponent({ templates })
      expect(wrapper.find('.node-input').exists()).toBe(false)
    })
  })

  describe('select de templates', () => {
    it('renderiza opções corretas', () => {
      const templates = [
        { id: 1, label: 'Template A', options: [] },
        { id: 2, label: 'Template B', maxConnections: 5 },
      ]
      const wrapper = mountComponent({ templates })
      const options = wrapper.findAll('option')
      expect(options[1].text()).toContain('Template A')
      expect(options[2].text()).toContain('Template B')
    })

    it('exibe label "Selecione um template" desabilitado', () => {
      const templates = [{ id: 1, label: 'A' }]
      const wrapper = mountComponent({ templates })
      const options = wrapper.findAll('option')
      expect(options[0].text()).toBe('Selecione um template')
      expect(options[0].attributes('disabled')).toBeDefined()
    })

    it('opção mostra máximo de conexões', () => {
      const templates = [{ id: 1, label: 'A', options: ['a', 'b', 'c'] }]
      const wrapper = mountComponent({ templates })
      const option = wrapper.findAll('option')[1]
      expect(option.text()).toContain('3')
    })
  })

  describe('select de nível', () => {
    it('não renderiza select de nível quando isAdmin é false', () => {
      const wrapper = mountComponent({ isAdmin: false })
      expect(wrapper.findAll('.node-select')).toHaveLength(0)
    })

    it('renderiza select de nível quando isAdmin é true', () => {
      const wrapper = mountComponent({ isAdmin: true })
      expect(wrapper.findAll('.node-select')).toHaveLength(1)
    })

    it('select de nível tem maxLevels opções', () => {
      const wrapper = mountComponent({ isAdmin: true, maxLevels: 5 })
      const selects = wrapper.findAll('.node-select')
      expect(selects[0].findAll('option')).toHaveLength(5)
    })

    it('nível 1 exibe "Raiz"', () => {
      const wrapper = mountComponent({ isAdmin: true, maxLevels: 3 })
      const options = wrapper.findAll('.node-select')[0].findAll('option')
      expect(options[0].text()).toContain('Raiz')
    })

    it('nível final exibe "Final"', () => {
      const wrapper = mountComponent({ isAdmin: true, maxLevels: 3 })
      const options = wrapper.findAll('.node-select')[0].findAll('option')
      expect(options[2].text()).toContain('Final')
    })

    it('nível intermediário exibe "Intermediário"', () => {
      const wrapper = mountComponent({ isAdmin: true, maxLevels: 5 })
      const options = wrapper.findAll('.node-select')[0].findAll('option')
      expect(options[2].text()).toContain('Intermediário')
    })
  })

  describe('mensagem de erro', () => {
    it('não exibe erro quando error está vazio', () => {
      const wrapper = mountComponent({ error: '' })
      expect(wrapper.find('.form-error').exists()).toBe(false)
    })

    it('exibe erro quando error tem conteúdo', () => {
      const wrapper = mountComponent({ error: 'Nome inválido' })
      expect(wrapper.find('.form-error').exists()).toBe(true)
      expect(wrapper.find('.form-error').text()).toBe('Nome inválido')
    })
  })

  describe('botões de ação', () => {
    it('renderiza botão cancelar', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.cancel-btn').exists()).toBe(true)
    })

    it('renderiza botão salvar', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.save-btn').exists()).toBe(true)
    })

    it('botão salvar exibe "Adicionar" no modo add', () => {
      const wrapper = mountComponent({ mode: 'add' })
      expect(wrapper.find('.save-btn').text()).toBe('Adicionar')
    })

    it('botão salvar exibe "Salvar" no modo edit', () => {
      const wrapper = mountComponent({ mode: 'edit' })
      expect(wrapper.find('.save-btn').text()).toBe('Salvar')
    })
  })

  describe('eventos', () => {
    it('emite close ao clicar no overlay', async () => {
      const wrapper = mountComponent()
      await wrapper.find('.modal-overlay').trigger('click')
      expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('não emite close ao clicar no modal', async () => {
      const wrapper = mountComponent()
      await wrapper.find('.modal').trigger('click')
      expect(wrapper.emitted('close')).toBeUndefined()
    })

    it('emite close ao clicar no botão cancelar', async () => {
      const wrapper = mountComponent()
      await wrapper.find('.cancel-btn').trigger('click')
      expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('emite save ao clicar no botão salvar', async () => {
      const wrapper = mountComponent()
      await wrapper.find('.save-btn').trigger('click')
      expect(wrapper.emitted('save')).toBeTruthy()
    })

    it('emite save ao pressionar Enter no input', async () => {
      const wrapper = mountComponent()
      await wrapper.find('.node-input').trigger('keyup.enter')
      expect(wrapper.emitted('save')).toBeTruthy()
    })
  })
})

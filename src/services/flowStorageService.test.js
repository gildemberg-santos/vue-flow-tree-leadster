import { save } from "./flowStorageService";

describe("save function", () => {
  beforeEach(() => {
    // Limpa o localStorage antes de cada teste
    localStorage.clear();
  });

  test("should save blocks and connections to localStorage", async () => {
    const data = {
      blocks: [
        { id: "abc-123", template_id: 1, label: "Diretoria", level: 1, x: 100, y: 200 },
        { id: "def-456", template_id: 2, label: "Gerência", level: 2, x: 300, y: 400 },
      ],
      connections: [
        { id: "e-abc-123-def-456", parent_id: "abc-123", child_id: "def-456" },
      ],
    };

    await save(data);

    // Verifica se os dados foram salvos corretamente no localStorage
    expect(localStorage.getItem("vft-blocks")).toEqual(JSON.stringify(data.blocks));
    expect(localStorage.getItem("vft-connections")).toEqual(JSON.stringify(data.connections));
  });

  test("should overwrite existing data in localStorage", async () => {
    // Dados iniciais
    localStorage.setItem("vft-blocks", JSON.stringify([{ id: "old-block" }]));
    localStorage.setItem("vft-connections", JSON.stringify([{ id: "old-connection" }]));

    const newData = {
      blocks: [
        { id: "new-block", template_id: 3, label: "Nova Diretoria", level: 1, x: 150, y: 250 },
      ],
      connections: [
        { id: "new-connection", parent_id: "new-block", child_id: "another-block" },
      ],
    };

    await save(newData);

    // Verifica se os dados antigos foram sobrescritos
    expect(localStorage.getItem("vft-blocks")).toEqual(JSON.stringify(newData.blocks));
    expect(localStorage.getItem("vft-connections")).toEqual(JSON.stringify(newData.connections));
  });

  test("should handle empty data gracefully", async () => {
    const emptyData = { blocks: [], connections: [] };

    await save(emptyData);

    // Verifica se os arrays vazios foram salvos corretamente
    expect(localStorage.getItem("vft-blocks")).toEqual(JSON.stringify([]));
    expect(localStorage.getItem("vft-connections")).toEqual(JSON.stringify([]));
  });
});

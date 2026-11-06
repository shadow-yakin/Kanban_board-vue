export function createSeedState() {
  return {
    version: 1,
    columns: [
      { id: "c1", title: "To Do", position: 0 },
      { id: "c2", title: "In Progress", position: 1 },
      { id: "c3", title: "Done", position: 2 },
    ],
    cards: [
      {
        id: "k1",
        columnId: "c1",
        title: "Задача 1",
        description: "Описание первой задачи",
        position: 0,
        createdAt: Date.now(),
      },
      {
        id: "k2",
        columnId: "c1",
        title: "Задача 2",
        description: "",
        position: 1,
        createdAt: Date.now(),
      },
    ],
  };
}

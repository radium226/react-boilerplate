export function addFruit(fruit) {
  return {
    type: 'ADD_FRUIT',
    fruit,
  };
}

export function listFruits() {
  return {
    type: 'LIST_FRUITS',
  };
}

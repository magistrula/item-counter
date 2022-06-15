const PRODUCE_ID = 'category-1';
const ESSENTIALS_ID = 'category-2';
const PANTRY_ID = 'category-3';

export const FOOD_BANK_PRESET = {
  name: 'Food Bank',
  id: 'preset-1655295602043',
  categories: [
    { id: PRODUCE_ID, name: 'Produce' },
    { id: ESSENTIALS_ID, name: 'Essentials' },
    { id: PANTRY_ID, name: 'Pantry' },
  ],
  items: [
    { id: 'item-1', name: 'tomato', categoryId: PRODUCE_ID },
    { id: 'item-2', name: 'banana', categoryId: PRODUCE_ID },
    { id: 'item-3', name: 'avocado', categoryId: PRODUCE_ID },
    { id: 'item-4', name: 'orange', categoryId: PRODUCE_ID },
    { id: 'item-5', name: 'lime', categoryId: PRODUCE_ID },
    { id: 'item-6', name: 'potato', categoryId: PRODUCE_ID },
    { id: 'item-7', name: 'garlic', categoryId: PRODUCE_ID },
    { id: 'item-8', name: 'onion', categoryId: PRODUCE_ID },
    { id: 'item-9', name: '5% milk', categoryId: ESSENTIALS_ID },
    { id: 'item-10', name: '2% milk', categoryId: ESSENTIALS_ID },
    { id: 'item-11', name: 'almond milk', categoryId: ESSENTIALS_ID },
    { id: 'item-12', name: 'eggs', categoryId: ESSENTIALS_ID },
    { id: 'item-13', name: 'bacon', categoryId: ESSENTIALS_ID },
    { id: 'item-14', name: 'baby food', categoryId: ESSENTIALS_ID },
    { id: 'item-15', name: 'rice', categoryId: PANTRY_ID },
    { id: 'item-16', name: 'lentils', categoryId: PANTRY_ID },
    { id: 'item-17', name: 'pasta', categoryId: PANTRY_ID },
    { id: 'item-18', name: 'pinto', categoryId: PANTRY_ID },
    { id: 'item-19', name: 'garbanzo', categoryId: PANTRY_ID },
    { id: 'item-20', name: 'maseca', categoryId: PANTRY_ID },
    { id: 'item-21', name: 'oil', categoryId: PANTRY_ID },
  ],
};

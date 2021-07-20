import { useCallback, useState } from 'react';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { without } from 'lodash';

import OrderCounterCategory from './counter/category';
import CounterHeader from './counter/header';
import { FOOD_BANK_PRESET } from '../constants/presets';

function makeColumn(name) {
  return { name, items: [] };
}

export default function OrderCounter() {
  const [categories, setCategories] = useState(FOOD_BANK_PRESET.categories);
  const [itemCounts, setItemCounts] = useState({});

  const usePreset = useCallback((preset) => {
    setCategories(preset.categories);
    setItemCounts({});
  }, []);

  const clearAllCategories = useCallback(() => {
    setCategories([]);
    setItemCounts({});
  }, []);

  const clearAllCounts = useCallback(() => {
    setItemCounts({});
  }, []);

  const addCategory = useCallback(() => {
    const name = window.prompt('Enter category name');
    if (!name) {
      return;
    }

    const trimmedName = name.trim();
    if (categoryExists(trimmedName)) {
      window.alert('Column already exists');
      return;
    }

    setCategories([...categories, makeColumn(trimmedName)]);
  }, [categories]);

  const removeCategory = useCallback(
    catIdx => {
      if (!window.confirm('Delete category?')) {
        return;
      }

      setCategories(without(categories, categories[catIdx]));
    },
    [categories]
  );

  const editCategory = useCallback(
    catIdx => {
      const newName = window.prompt('Enter new category name');
      if (!newName) {
        return;
      }

      const trimmedNewName = newName.trim();
      if (categoryExists(trimmedNewName)) {
        window.alert('Column already exists');
        return;
      }

      const updatedCols = [...categories];
      updatedCols[catIdx].name = trimmedNewName;
      setCategories(updatedCols);
    },
    [categories]
  );

  const addItem = useCallback(
    (itemName, catIdx) => {
      if (!itemName) {
        return;
      }

      const trimmedName = itemName.trim();
      if (itemExists(trimmedName)) {
        window.alert('Item already exists');
        return;
      }

      const updatedCols = [...categories];
      updatedCols[catIdx].items.push(trimmedName);
      setCategories(updatedCols);
    },
    [categories]
  );

  const removeItem = useCallback(
    (itemName, catIdx) => {
      if (!window.confirm('Remove item?')) {
        return;
      }

      const updatedCols = [...categories];
      updatedCols[catIdx].items = without(updatedCols[catIdx].items, itemName);
      setCategories(updatedCols);

      const updatedCounts = Object.assign({}, itemCounts);
      delete updatedCounts[itemName];
      setItemCounts(updatedCounts);
    },
    [categories, itemCounts]
  );

  const editItem = useCallback(
    (oldName, catIdx) => {
      const newName = window.prompt('Enter new item name', oldName);
      if (!newName) {
        return;
      }

      const newTrimmedName = newName.trim();
      if (itemExists(newTrimmedName)) {
        window.alert('Item already exists');
        return;
      }

      const updatedCols = [...categories];
      const items = updatedCols[catIdx].items;
      items[items.indexOf(oldName)] = newTrimmedName;
      setCategories(updatedCols);

      const updatedItemCounts = Object.assign({}, itemCounts, {
        [newTrimmedName]: itemCounts[oldName] || 0,
      });
      delete updatedItemCounts[oldName];
      setItemCounts(updatedItemCounts);
    },
    [categories, itemCounts]
  );

  const incrementItem = useCallback(
    (itemName, increment) => {
      const count = (itemCounts[itemName] || 0) + increment;
      setItemCounts(
        Object.assign({}, itemCounts, {
          [itemName]: count >= 0 ? count : 0,
        })
      );
    },
    [itemCounts]
  );

  const categoryExists = catName => {
    const lowerName = catName.toLowerCase();
    return categories.find(({ name }) => {
      return name.toLowerCase() === lowerName;
    });
  };

  const itemExists = itemName => {
    return itemName.toLowerCase() in itemCounts;
  };

  return (
    <>
      <CounterHeader
        presets={[FOOD_BANK_PRESET]}
        addCategory={addCategory}
        clearAllCategories={clearAllCategories}
        clearAllCounts={clearAllCounts}
        usePreset={usePreset}
      />

      <Box mt={3} mx={6}>
        <Grid container spacing={4}>
          {categories.map((category, idx) => (
            <Grid item key={category.name} xs={12} sm={12} md={6} lg={4}>
              <OrderCounterCategory
                index={idx}
                name={category.name}
                itemCounts={itemCounts}
                itemNames={category.items}
                addItem={addItem}
                editItem={editItem}
                incrementItem={incrementItem}
                removeItem={removeItem}
                editCategory={editCategory}
                removeCategory={removeCategory}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}

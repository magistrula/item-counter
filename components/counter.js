import { useCallback, useEffect, useReducer } from 'react';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { without } from 'lodash';

import CounterCategory from './counter/category';
import CounterHeader from './counter/header';
import { FOOD_BANK_PRESET } from '../constants/presets';
import reducer, { init } from '../reducers/counter';

export default function Counter() {
  const [state, dispatch] = useReducer(reducer, FOOD_BANK_PRESET, init);

  useEffect(() => {
    if (state.error) {
      const error = state.error;
      dispatch({ type: 'clear-error' });
      window.alert(error);
    }
  }, [state.error]);

  const usePreset = useCallback(preset => {
    dispatch({
      type: 'use-preset',
      payload: preset,
    });
  }, []);

  const clearAllCategories = useCallback(() => {
    dispatch({ type: 'clear-categories' });
  }, []);

  const clearAllCounts = useCallback(() => {
    dispatch({ type: 'clear-counts' });
  }, []);

  const addCategory = useCallback(() => {
    const name = (window.prompt('Enter category name') || '').trim();
    if (name) {
      dispatch({
        type: 'add-category',
        payload: name,
      });
    }
  }, []);

  const removeCategory = useCallback(catIdx => {
    if (window.confirm('Delete category?')) {
      dispatch({
        type: 'remove-category',
        payload: catIdx,
      });
    }
  }, []);

  const editCategory = useCallback((oldName, catIdx) => {
    const newName = (
      window.prompt('Enter new category name', oldName) || ''
    ).trim();
    if (newName && newName.toLowerCase() !== oldName.toLowerCase()) {
      dispatch({
        type: 'edit-category',
        payload: { catIdx, newName },
      });
    }
  }, []);

  const addItem = useCallback((itemName, catIdx) => {
    const trimmedName = itemName.trim();
    if (trimmedName) {
      dispatch({
        type: 'add-item',
        payload: { catIdx, itemName: trimmedName },
      });
    }
  }, []);

  const removeItem = useCallback((itemName, catIdx) => {
    if (!window.confirm('Remove item?')) {
      return;
    }

    dispatch({
      type: 'remove-item',
      payload: { catIdx, itemName },
    });
  }, []);

  const editItem = useCallback((oldName, catIdx) => {
    const newName = (window.prompt('Enter new name', oldName) || '').trim();
    if (newName && newName.toLowerCase() !== oldName.toLowerCase()) {
      dispatch({
        type: 'edit-item',
        payload: { catIdx, oldName, newName },
      });
    }
  }, []);

  const incrementItem = useCallback((itemName, increment) => {
    dispatch({
      type: 'increment-item',
      payload: { itemName, increment },
    });
  }, []);

  return (
    <>
      <CounterHeader
        presets={[FOOD_BANK_PRESET]}
        addCategory={addCategory}
        clearAllCategories={clearAllCategories}
        clearAllCounts={clearAllCounts}
        usePreset={usePreset}
      />

      <Box mt={3} mx={2}>
        <Grid container spacing={4}>
          {state.categories.map((category, idx) => (
            <Grid item key={category.name} xs={12} sm={6} md={4} lg={3}>
              <CounterCategory
                index={idx}
                name={category.name}
                itemCounts={state.itemCounts}
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

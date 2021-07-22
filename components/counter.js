import { useCallback, useEffect, useReducer, useState } from 'react';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import without from 'lodash/without';

import CounterCategory from './counter/category';
import CounterHeader from './counter/header';
import { FOOD_BANK_PRESET } from '../constants/presets';
import reducer, { init, buildItemsByCategory } from '../reducers/counter';
import { retrieveState, saveState } from '../utils/persist-state';

export default function Counter() {
  const [state, dispatch] = useReducer(reducer, {}, init);
  const [itemsByCategory, setItemsByCategory] = useState({});

  useEffect(() => {
    const savedState = retrieveState();
    if (savedState) {
      dispatch({ type: 'restore-state', payload: { savedState } });
    } else {
      dispatch({ type: 'use-preset', payload: { preset: FOOD_BANK_PRESET } });
    }
  }, []);

  useEffect(() => saveState(state), [state]);

  useEffect(() => {
    if (state.error) {
      window.alert(state.error);
      dispatch({ type: 'clear-error' });
    }
  }, [state.error]);

  useEffect(() => {
    setItemsByCategory(buildItemsByCategory(state.categories, state.items));
  }, [state.categories, state.items]);

  const usePreset = useCallback(preset => {
    dispatch({ type: 'use-preset', payload: { preset } });
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
      dispatch({ type: 'add-category', payload: { name } });
    }
  }, []);

  const removeCategory = useCallback(catId => {
    if (window.confirm('Delete category?')) {
      dispatch({ type: 'remove-category', payload: { catId } });
    }
  }, []);

  const renameCategory = useCallback((oldName, catId) => {
    const newName = (window.prompt('Enter new name', oldName) || '').trim();
    if (newName) {
      dispatch({ type: 'rename-category', payload: { catId, newName } });
    }
  }, []);

  const addItem = useCallback((name, catId) => {
    const trimmedName = name.trim();
    if (trimmedName) {
      dispatch({
        type: 'add-item',
        payload: { catId, name: trimmedName },
      });
    }
  }, []);

  const removeItem = useCallback((itemId) => {
    if (window.confirm('Remove item?')) {
      dispatch({ type: 'remove-item', payload: { itemId } });
    }
  }, []);

  const renameItem = useCallback((itemId, oldName) => {
    const newName = (window.prompt('Enter new name', oldName) || '').trim();
    if (newName) {
      dispatch({ type: 'rename-item', payload: { itemId, newName } });
    }
  }, []);

  const incrementItem = useCallback((itemId, increment) => {
    dispatch({ type: 'increment-item', payload: { itemId, increment } });
  }, []);

  return (
    <>
      <CounterHeader
        presets={state.presets}
        addCategory={addCategory}
        clearAllCategories={clearAllCategories}
        clearAllCounts={clearAllCounts}
        usePreset={usePreset}
      />

      <Box mt={3} mx={2}>
        <Grid container spacing={4}>
          {state.categories.map((category) => (
            <Grid item key={category.name} xs={12} sm={6} md={4} lg={3}>
              <CounterCategory
                categoryId={category.id}
                categoryName={category.name}
                items={itemsByCategory[category.id]}
                addItem={addItem}
                renameItem={renameItem}
                incrementItem={incrementItem}
                removeItem={removeItem}
                renameCategory={renameCategory}
                removeCategory={removeCategory}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}

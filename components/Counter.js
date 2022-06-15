import { useCallback, useEffect, useReducer, useState } from 'react';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import CounterCategory from './Counter/CounterCategory';
import CounterHeader from './Counter/CounterHeader';
import { FOOD_BANK_PRESET } from '../constants/presets';
import reducer, {
  buildCounterState,
  buildItemsByCategory,
} from '../reducers/counter';
import {
  retrievePresets,
  retrieveState,
  storePresets,
  storeState,
} from '../utils/persist';

export default function Counter() {
  const [state, dispatch] = useReducer(reducer, {}, buildCounterState);
  const [itemsByCategory, setItemsByCategory] = useState({});

  useEffect(() => {
    const savedState = retrieveState();
    const presets = retrievePresets();
    dispatch({ type: 'init', payload: { presets, savedState } });
  }, []);

  useEffect(() => {
    if (!state.isInitialized) {
      return;
    }

    storePresets(state.presets);
    dispatch({ type: 'did-store-presets' });
  }, [state.presets, state.isInitialized]);

  useEffect(() => {
    if (!state.isInitialized) {
      return;
    }

    storeState(state);
  }, [state, state.isInitialized]);

  useEffect(() => {
    if (state.error) {
      window.alert(state.error);
      dispatch({ type: 'clear-error' });
    }
  }, [state.error]);

  useEffect(() => {
    setItemsByCategory(buildItemsByCategory(state.categories, state.items));
  }, [state.categories, state.items]);

  const usePreset = useCallback(
    preset => {
      if (state.isSaved || window.confirm('Discard unsaved changes?')) {
        dispatch({ type: 'use-preset', payload: { preset } });
      }
    },
    [state.isSaved]
  );

  const createPreset = useCallback(() => {
    const name = (window.prompt('Enter name for counter.') || '').trim();
    if (name) {
      dispatch({ type: 'create-preset', payload: { name } });
    }
  }, []);

  const renamePreset = useCallback(() => {
    const name = window.prompt('Enter name for counter.', state.name);
    if (name) {
      dispatch({ type: 'rename-curr-preset', payload: { name } });
    }
  }, [state.name]);

  const savePreset = useCallback(() => {
    dispatch({ type: 'save-curr-preset' });
  }, []);

  const deletePreset = useCallback(() => {
    const confirmed = window.confirm(`Delete counter "${state.name}"?`);
    if (confirmed) {
      dispatch({ type: 'delete-curr-preset' });
    }
  }, [state.name]);

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
    const trimmedName = (name || '').trim();
    if (trimmedName) {
      dispatch({
        type: 'add-item',
        payload: { catId, name: trimmedName },
      });
    }
  }, []);

  const removeItem = useCallback(itemId => {
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
        isSaved={state.isSaved}
        presets={state.presets}
        presetTitle={state.name}
        addCategory={addCategory}
        clearAllCategories={clearAllCategories}
        clearAllCounts={clearAllCounts}
        createPreset={createPreset}
        deletePreset={deletePreset}
        renamePreset={renamePreset}
        savePreset={savePreset}
        usePreset={usePreset}
      />

      <Box mt={3} mx={2}>
        {!state.name && (
          <Box my={5} display="flex" justifyContent="center">
            <Button variant="contained" onClick={createPreset}>
              Create New Counter
            </Button>
          </Box>
        )}

        <Grid container spacing={4}>
          {state.categories.map(category => (
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

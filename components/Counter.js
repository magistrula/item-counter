import React, { useCallback, useEffect, useReducer, useState } from 'react';

import CounterWrapper from 'app/components/Counter/CounterWrapper';

import reducer, {
  buildCounterState,
  buildItemsByCategory,
  hasNonZeroItemCounts,
} from 'app/reducers/counter';
import {
  confirmDeleteCategory,
  confirmDeleteCounter,
  confirmDeleteItem,
  confirmLeaveCurrPreset,
  promptCategoryName,
  promptCounterName,
  promptItemName,
} from 'app/utils/dialogs';
import {
  retrievePresets,
  retrieveState,
  storePresets,
  storeState,
} from 'app/utils/persist';

export default function Counter() {
  const [state, dispatch] = useReducer(reducer, {}, buildCounterState);
  const [itemsByCategory, setItemsByCategory] = useState({});

  useEffect(() => {
    const savedState = retrieveState();
    const presets = retrievePresets();
    dispatch({ type: 'init', payload: { presets, savedState } });
  }, []);

  useEffect(() => {
    if (state.isInitialized) {
      storePresets(state.presets);
      dispatch({ type: 'did-store-presets' });
    }
  }, [state.presets, state.isInitialized]);

  useEffect(() => {
    if (state.isInitialized) {
      storeState(state);
    }
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
      const canLeaveCurrPreset = confirmLeaveCurrPreset({
        hasCounts: hasNonZeroItemCounts(state.items),
        isSaved: state.isCurrPresetSaved,
        items: state.items,
        name: state.name,
      });

      if (canLeaveCurrPreset) {
        dispatch({ type: 'use-preset', payload: { preset } });
      }
    },
    [state.isCurrPresetSaved, state.items, state.name]
  );

  const createPreset = useCallback(() => {
    const canLeaveCurrPreset = confirmLeaveCurrPreset({
      hasCounts: hasNonZeroItemCounts(state.items),
      isSaved: state.isCurrPresetSaved,
      items: state.items,
      name: state.name,
    });

    if (canLeaveCurrPreset) {
      const name = promptCounterName();
      if (name) {
        dispatch({ type: 'create-preset', payload: { name } });
      }
    }
  }, [state.isCurrPresetSaved, state.items, state.name]);

  const renameCurrPreset = useCallback(() => {
    const name = promptCounterName(state.name);
    if (name) {
      dispatch({ type: 'rename-curr-preset', payload: { name } });
    }
  }, [state.name]);

  const saveCurrPreset = useCallback(() => {
    dispatch({ type: 'save-curr-preset' });
  }, []);

  const deleteCurrPreset = useCallback(() => {
    if (confirmDeleteCounter(state.name)) {
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
    const name = promptCategoryName();
    if (name) {
      dispatch({ type: 'add-category', payload: { name } });
    }
  }, []);

  const removeCategory = useCallback((catId, catName) => {
    if (confirmDeleteCategory(catName)) {
      dispatch({ type: 'remove-category', payload: { catId } });
    }
  }, []);

  const renameCategory = useCallback((oldName, catId) => {
    const newName = promptCategoryName(oldName);
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

  const removeItem = useCallback((itemId, itemName) => {
    if (confirmDeleteItem(itemName)) {
      dispatch({ type: 'remove-item', payload: { itemId } });
    }
  }, []);

  const renameItem = useCallback((itemId, oldName) => {
    const newName = promptItemName(oldName);
    if (newName) {
      dispatch({ type: 'rename-item', payload: { itemId, newName } });
    }
  }, []);

  const incrementItem = useCallback((itemId, increment) => {
    dispatch({ type: 'increment-item', payload: { itemId, increment } });
  }, []);

  return (
    <CounterWrapper
      categories={state.categories}
      currPresetName={state.name}
      isCurrPresetSaved={state.isCurrPresetSaved}
      itemsByCategory={itemsByCategory}
      presets={state.presets}
      addCategory={addCategory}
      addItem={addItem}
      clearAllCategories={clearAllCategories}
      clearAllCounts={clearAllCounts}
      createPreset={createPreset}
      deleteCurrPreset={deleteCurrPreset}
      incrementItem={incrementItem}
      removeCategory={removeCategory}
      removeItem={removeItem}
      renameCategory={renameCategory}
      renameCurrPreset={renameCurrPreset}
      renameItem={renameItem}
      saveCurrPreset={saveCurrPreset}
      usePreset={usePreset}
    />
  );
}

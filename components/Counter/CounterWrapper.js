import React from 'react';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import CounterCategory from './CounterCategory';
import CounterHeader from './CounterHeader';

export default function CounterWrapper({
  categories,
  currPresetName,
  isCurrPresetSaved,
  itemsByCategory,
  presets,
  addCategory,
  addItem,
  clearAllCategories,
  clearAllCounts,
  createPreset,
  deleteCurrPreset,
  incrementItem,
  removeCategory,
  removeItem,
  renameCategory,
  renameCurrPreset,
  renameItem,
  saveCurrPreset,
  usePreset,
}) {
  return (
    <>
      <CounterHeader
        currPresetTitle={currPresetName}
        isCurrPresetSaved={isCurrPresetSaved}
        presets={presets}
        addCategory={addCategory}
        clearAllCategories={clearAllCategories}
        clearAllCounts={clearAllCounts}
        createPreset={createPreset}
        deleteCurrPreset={deleteCurrPreset}
        renameCurrPreset={renameCurrPreset}
        saveCurrPreset={saveCurrPreset}
        usePreset={usePreset}
      />

      <Box mt={3} mx={2}>
        {!currPresetName && (
          <Box my={5} display="flex" justifyContent="center">
            <Button variant="contained" onClick={createPreset}>
              Create New Counter
            </Button>
          </Box>
        )}

        <Grid container spacing={4}>
          {categories.map(category => (
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

import React, { memo, useCallback } from 'react';

import Box from '@material-ui/core/Box';
import ClearIcon from '@material-ui/icons/Clear';
import { difference, isEmpty } from 'lodash';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';

import CounterItem from './CounterItem';

function CounterCategory({
  categoryId,
  categoryName,
  items,
  addItem,
  renameItem,
  incrementItem,
  removeItem,
  renameCategory,
  removeCategory,
}) {
  const onKeyDownAddItemInput = useCallback(
    event => {
      if (event.keyCode === 13) {
        addItem(event.target.value, categoryId);
        event.target.value = '';
      }
    },
    [categoryId, addItem]
  );

  const renameCategoryCb = useCallback(() => {
    renameCategory(categoryName, categoryId);
  }, [categoryName, categoryId, renameCategory]);

  const removeCategoryCb = useCallback(() => {
    removeCategory(categoryId);
  }, [categoryId, removeCategory]);

  return (
    <>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <strong>{categoryName}</strong>
        </Box>

        <Box display="flex">
          <IconButton onClick={renameCategoryCb}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton onClick={removeCategoryCb}>
            <ClearIcon />
          </IconButton>
        </Box>
      </Box>

      <Box mb={1}>
        <TextField
          className="u-FullWidth"
          placeholder="Enter item"
          onKeyDown={onKeyDownAddItemInput}
        />
      </Box>

      {(items || []).map(item => (
        <Box key={item.id} mb={2}>
          <CounterItem
            itemId={item.id}
            itemName={item.name}
            itemCount={item.count}
            renameItem={renameItem}
            incrementItem={incrementItem}
            removeItem={removeItem}
          />
        </Box>
      ))}
    </>
  );
}

export default memo(CounterCategory);

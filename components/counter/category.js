import React, { useCallback } from 'react';

import Box from '@material-ui/core/Box';
import ClearIcon from '@material-ui/icons/Clear';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';

import CounterItem from './item';

export default function OrderCounterCategory({
  index,
  name,
  itemCounts,
  itemNames,
  addItem,
  editItem,
  incrementItem,
  removeItem,
  editCategory,
  removeCategory,
}) {
  const onKeyDownAddItemInput = useCallback(
    event => {
      if (event.keyCode === 13) {
        addItem(event.target.value, index);
        event.target.value = '';
      }
    },
    [index, addItem]
  );

  const editCategoryCb = useCallback(() => {
    editCategory(index);
  }, [index, editCategory]);

  const removeCategoryCb = useCallback(() => {
    removeCategory(index);
  }, [index, removeCategory]);

  const removeItemCb = useCallback(
    itemName => {
      removeItem(itemName, index);
    },
    [index, removeItem]
  );

  const editItemCb = useCallback(
    itemName => {
      editItem(itemName, index);
    },
    [index, editItem]
  );

  return (
    <>
      <Box display="flex" mb={2}>
        <Box flexGrow={1} mr={1}>
          <TextField
            className="u-full-width"
            placeholder={name}
            onKeyDown={onKeyDownAddItemInput}
          />
        </Box>

        <IconButton onClick={editCategoryCb}>
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton onClick={removeCategoryCb}>
          <ClearIcon />
        </IconButton>
      </Box>

      {itemNames.map(itemName => (
        <Box key={itemName} mb={2}>
          <CounterItem
            itemName={itemName}
            itemCount={itemCounts[itemName]}
            editItem={editItemCb}
            incrementItem={incrementItem}
            removeItem={removeItemCb}
          />
        </Box>
      ))}
    </>
  );
}

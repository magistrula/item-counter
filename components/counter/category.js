import React, { memo, useCallback } from 'react';

import Box from '@material-ui/core/Box';
import ClearIcon from '@material-ui/icons/Clear';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import { difference, isEmpty } from 'lodash';
import TextField from '@material-ui/core/TextField';

import CounterItem from './item';

function CounterCategory({
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
    editCategory(name, index);
  }, [name, index, editCategory]);

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

function areCountsUnchanged(prev, next) {
  return next.itemNames.every((itemName) => {
    return next.itemCounts[itemName] === prev.itemCounts[itemName]
  });
}

function areItemsUnchanged(prev, next) {
  return isEmpty(difference(prev.itemNames, next.itemNames));
}

function arePropsEqual(prev, next) {
  return (
    prev.index === next.index &&
    prev.name === next.name &&
    prev.addItem === next.addItem &&
    prev.editItem === next.editItem &&
    prev.incrementItem === next.incrementItem &&
    prev.removeItem === next.removeItem &&
    prev.editCategory === next.editCategory &&
    prev.removeCategory === next.removeCategory
  ) && areCountsUnchanged(prev, next) && areItemsUnchanged(prev, next);
}

export default memo(CounterCategory, arePropsEqual);

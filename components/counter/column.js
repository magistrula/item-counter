import React, { useCallback } from 'react';

import Box from '@material-ui/core/Box';
import ClearIcon from '@material-ui/icons/Clear';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';

import CounterItem from './item';
import s from './styles.module.scss';

export default function OrderCounterColumn({
  colIdx,
  colName,
  itemCounts,
  itemNames,
  addItem,
  editItem,
  incrementItem,
  removeItem,
  editColumn,
  removeColumn,
}) {
  const onKeyDownAddItemInput = useCallback(
    event => {
      if (event.keyCode === 13) {
        addItem(event.target.value, colIdx);
        event.target.value = '';
      }
    },
    [colIdx, addItem]
  );

  const editColumnCb = useCallback(() => {
    editColumn(colIdx);
  }, [colIdx, editColumn]);

  const removeColumnCb = useCallback(() => {
    removeColumn(colIdx);
  }, [colIdx, removeColumn]);

  const removeItemCb = useCallback(
    itemName => {
      removeItem(itemName, colIdx);
    },
    [colIdx, removeItem]
  );

  const editItemCb = useCallback(
    itemName => {
      editItem(itemName, colIdx);
    },
    [colIdx, editItem]
  );

  return (
    <div className={s['OrderCounter-column']}>
      <Box display="flex" mb={2}>
        <TextField
          className={s['OrderCounter-columnInput']}
          placeholder={`${colName}: add item`}
          onKeyDown={onKeyDownAddItemInput}
        />

        <IconButton onClick={editColumnCb}>
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={removeColumnCb}>
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
    </div>
  );
}

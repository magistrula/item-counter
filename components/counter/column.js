import React, { useCallback } from 'react';

import Box from '@material-ui/core/Box';
import ClearIcon from '@material-ui/icons/Clear';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';

import CounterItem from './item';
import s from './styles.module.scss';

export default function OrderCounterColumn({
  colId,
  itemCounts,
  itemNames,
  addItem,
  incrementItem,
  removeItem,
  removeColumn,
}) {
  const onKeyDownAddItemInput = useCallback(
    event => {
      if (event.keyCode === 13) {
        addItem(event.target.value, colId);
        event.target.value = '';
      }
    },
    [colId, addItem]
  );

  const removeColumnCb = useCallback(
    () => removeColumn(colId),
    [colId, removeColumn]
  );

  const removeItemCb = useCallback(
    itemName => removeItem(itemName, colId),
    [colId, removeItem]
  );

  return (
    <div className={s['OrderCounter-column']}>
      <Box display="flex" mb={2}>
        <TextField
          className={s['OrderCounter-columnInput']}
          placeholder={`${colId}: add item`}
          onKeyDown={onKeyDownAddItemInput}
        />

        <IconButton onClick={removeColumnCb}>
          <ClearIcon />
        </IconButton>
      </Box>

      {itemNames.map(itemName => (
        <Box key={itemName} mb={2}>
          <CounterItem
            itemName={itemName}
            itemCount={itemCounts[itemName]}
            incrementItem={incrementItem}
            removeItem={removeItemCb}
          />
        </Box>
      ))}
    </div>
  );
}

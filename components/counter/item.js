import React, { useCallback } from 'react';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';

import s from './styles.module.scss';

export default function OrderCounterItem({
  itemName,
  itemCount,
  incrementItem,
  removeItem,
}) {
  const incrementCb = useCallback(
    () => incrementItem(itemName, 1),
    [itemName, incrementItem]
  );

  const decrementCb = useCallback(
    () => incrementItem(itemName, -1),
    [itemName, incrementItem]
  );

  const removeCb = useCallback(
    () => removeItem(itemName),
    [itemName, removeItem]
  );

  return (
    <Box display="flex" justifyContent="space-between">
      <Button
        variant="contained"
        size="large"
        className={s['OrderCounter-itemButton']}
        onClick={incrementCb}
      >
        <Box display="flex" justifyContent="space-between" width="100%">
          <span>{itemName}</span>
          <span>({itemCount || 0})</span>
        </Box>
      </Button>
      <Box display="flex" ml={1}>
        <IconButton variant="contained" onClick={decrementCb}>
          <IndeterminateCheckBoxIcon fontSize="small" />
        </IconButton>
        <IconButton onClick={removeCb}>
          <DeleteIcon color="secondary" fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}

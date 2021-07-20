import React, { useCallback } from 'react';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import MenuItem from '@material-ui/core/MenuItem';

import MoreMenu from '../more-menu';

import s from './styles.module.scss';

export default function OrderCounterItem({
  itemName,
  itemCount,
  editItem,
  incrementItem,
  removeItem,
}) {
  const incrementCb = useCallback(() => {
    incrementItem(itemName, 1);
  }, [itemName, incrementItem]);

  const decrementCb = useCallback(() => {
    incrementItem(itemName, -1);
  }, [itemName, incrementItem]);

  const removeCb = useCallback(() => {
    removeItem(itemName);
  }, [itemName, removeItem]);

  const editItemCb = useCallback(() => {
    editItem(itemName);
  }, [itemName, editItem]);

  return (
    <Box display="flex" justifyContent="space-between">
      <Button
        variant="contained"
        size="large"
        className={s['OrderCounter-itemButton']}
        onClick={incrementCb}
      >
        <Box display="flex" justifyContent="space-between" width="100%">
          <span>({itemCount || 0})</span>
          <span>{itemName}</span>
          <span>({itemCount || 0})</span>
        </Box>
      </Button>

      <Box display="flex" ml={1}>
        <MoreMenu>
          <MenuItem onClick={editItemCb}>Edit</MenuItem>
          <MenuItem onClick={removeCb}>Remove</MenuItem>
        </MoreMenu>

        <IconButton variant="contained" onClick={decrementCb}>
          <IndeterminateCheckBoxIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}

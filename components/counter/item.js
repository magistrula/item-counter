import React, { useCallback } from 'react';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ExposureNeg1Icon from '@material-ui/icons/ExposureNeg1';
import IconButton from '@material-ui/core/IconButton';
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

  const clearCountCb = useCallback(() => {
    incrementItem(itemName, itemCount * -1);
  }, [itemCount, itemName, incrementItem])

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
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
        >
          <small>{itemCount || 0}</small>
          <Box px={1}>
            <small>{itemName}</small>
          </Box>
          <small>{itemCount || 0}</small>
        </Box>
      </Button>

      <Box display="flex" ml={1}>
        <MoreMenu>
          <MenuItem onClick={editItemCb}>Rename</MenuItem>
          <MenuItem onClick={removeCb}>Remove</MenuItem>
          <MenuItem onClick={clearCountCb}>Reset Count</MenuItem>
        </MoreMenu>

        <IconButton disabled={!itemCount} variant="contained" onClick={decrementCb}>
          <ExposureNeg1Icon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}

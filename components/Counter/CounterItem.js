import React, { memo, useCallback } from 'react';
import PropTypes from 'prop-types';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ExposureNeg1Icon from '@material-ui/icons/ExposureNeg1';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';

import MoreMenu from '../MoreMenu';

function CounterItem({
  itemId,
  itemName,
  itemCount,
  renameItem,
  incrementItem,
  removeItem,
}) {
  const incrementCb = useCallback(() => {
    incrementItem(itemId, 1);
  }, [itemId, incrementItem]);

  const decrementCb = useCallback(() => {
    incrementItem(itemId, -1);
  }, [itemId, incrementItem]);

  const clearCountCb = useCallback(() => {
    incrementItem(itemId, itemCount * -1);
  }, [itemCount, itemId, incrementItem]);

  const removeCb = useCallback(() => {
    removeItem(itemId, itemName);
  }, [itemId, itemName, removeItem]);

  const renameCb = useCallback(() => {
    renameItem(itemId, itemName);
  }, [itemId, itemName, renameItem]);

  return (
    <Box display="flex">
      <Box display="flex" flexGrow={1}>
        <Button
          variant="contained"
          size="large"
          className="u-FullWidth"
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
      </Box>

      <Box display="flex" ml={1}>
        <MoreMenu>
          <MenuItem onClick={renameCb}>Rename</MenuItem>
          <MenuItem onClick={removeCb}>Remove</MenuItem>
          {!!itemCount && (
            <MenuItem onClick={clearCountCb}>Clear Count</MenuItem>
          )}
        </MoreMenu>

        <IconButton
          disabled={!itemCount}
          variant="contained"
          onClick={decrementCb}
        >
          <ExposureNeg1Icon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}

CounterItem.propTypes = {
  itemId: PropTypes.string.isRequired,
  itemName: PropTypes.string.isRequired,
  itemCount: PropTypes.number.isRequired,
  renameItem: PropTypes.func.isRequired,
  incrementItem: PropTypes.func.isRequired,
  removeItem: PropTypes.func.isRequired,
};

export default memo(CounterItem);

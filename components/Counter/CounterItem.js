import React, { memo, useCallback } from 'react';
import PropTypes from 'prop-types';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ExposureNeg1Icon from '@material-ui/icons/ExposureNeg1';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';

import MoreMenu from 'app/components/MoreMenu';

function CounterItem({
  itemId,
  itemName,
  itemCount,
  renameItem,
  incrementItem,
  removeItem,
  testId = 'CounterItem',
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
    <Box display="flex" data-testid={testId}>
      <Box display="flex" flexGrow={1}>
        <Button
          variant="contained"
          size="large"
          className="u-FullWidth"
          onClick={incrementCb}
          data-testid="CounterItem-mainButton"
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            width="100%"
          >
            <small data-testid="CounterItem-countL">{itemCount || 0}</small>
            <Box px={1}>
              <small data-testid="CounterItem-name">{itemName}</small>
            </Box>
            <small data-testid="CounterItem-countR">{itemCount || 0}</small>
          </Box>
        </Button>
      </Box>

      <Box display="flex" ml={1}>
        <MoreMenu>
          <MenuItem onClick={renameCb} data-testid="CounterItem-rename">
            Rename
          </MenuItem>
          <MenuItem onClick={removeCb} data-testid="CounterItem-remove">
            Remove
          </MenuItem>
          {!!itemCount && (
            <MenuItem onClick={clearCountCb} data-testid="CounterItem-reset">
              Clear Count
            </MenuItem>
          )}
        </MoreMenu>

        <IconButton
          disabled={!itemCount}
          variant="contained"
          onClick={decrementCb}
          data-testid="CounterItem-decrement"
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
  testId: PropTypes.string,
};

export default memo(CounterItem);

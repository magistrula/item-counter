import AddCircleIcon from '@material-ui/icons/AddCircle';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';

import MoreMenu from '../more-menu';

export default function CounterHeader({
  addColumn,
  clearAllColumns,
  clearAllCounts,
  setDefaultColumns,
}) {
  return (
    <AppBar position="sticky">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        px={2}
        py={1.5}
      >
        Item Counter

        <Box display="flex" alignItems="center">
          <Box mr={1}>
            <Button
              variant="contained"
              size="small"
              color="default"
              onClick={addColumn}
            >
              <AddCircleIcon />
              <Box ml={0.5}>Add Column</Box>
            </Button>
          </Box>

          <MoreMenu>
            <MenuItem onClick={setDefaultColumns}>
              Default Columns
            </MenuItem>
            <MenuItem onClick={clearAllColumns}>
              Clear Columns
            </MenuItem>
            <MenuItem onClick={clearAllCounts}>
              Clear Counts
            </MenuItem>
          </MoreMenu>
        </Box>
      </Box>
    </AppBar>
  );
}

import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MoreVertIcon from '@material-ui/icons/MoreVert';

function MoreMenu({ children, closeOnClick = true, testId = 'MoreMenu' }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const toggleMenu = useCallback(event => {
    setAnchorEl(event.currentTarget);
  }, []);

  const closeMenu = useCallback(() => {
    setAnchorEl(null);
  }, []);

  return (
    <Box data-testid={testId}>
      <IconButton
        color="inherit"
        onClick={toggleMenu}
        data-testid="MoreMenu-toggle"
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        onClose={closeMenu}
        onClick={closeOnClick ? closeMenu : null}
      >
        {children}
      </Menu>
    </Box>
  );
}

MoreMenu.propTypes = {
  children: PropTypes.any.isRequired,
  closeOnClick: PropTypes.bool,
  testId: PropTypes.string,
};

export default MoreMenu;

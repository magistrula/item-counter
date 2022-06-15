import React, { useCallback, useState } from 'react';

import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MoreVertIcon from '@material-ui/icons/MoreVert';

export default function CounterItemMenu({ children, closeOnClick = true }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const toggleMenu = useCallback(event => {
    setAnchorEl(event.currentTarget);
  }, []);

  const closeMenu = useCallback(() => {
    setAnchorEl(null);
  }, []);

  return (
    <>
      <IconButton color="inherit" onClick={toggleMenu}>
        <MoreVertIcon fontSize="small" />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        keepMounted
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
    </>
  );
}

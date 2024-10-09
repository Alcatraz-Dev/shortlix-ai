
import React from 'react';

const VisuallyHidden = ({ children }) => {
  return (
    <span style={{
      position: 'absolute',
      width: '1px',
      height: '1px',
      padding: 0,
      margin: -1,
      overflow: 'hidden',
      clip: 'rect(0, 0, 0, 0)',
      border: 0,
      whiteSpace: 'nowrap',
      wordWrap: 'normal',
    }}>
      {children}
    </span>
  );
};

export default VisuallyHidden;
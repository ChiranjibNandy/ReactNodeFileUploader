import React from 'react';
import PropTypes from 'prop-types';

const Notifications = ({ msg }) => {
  return (
    <div className='alert alert-info alert-dismissible fade show' role='alert'>
      {msg}
      <button
        type='button'
        className='close'
        data-dismiss='alert'
        aria-label='Close'
      >
        <span aria-hidden='true'>&times;</span>
      </button>
    </div>
  );
};

Notifications.propTypes = {
  msg: PropTypes.string.isRequired
};

export default Notifications;
import React from 'react';
import { FaUserEdit } from "react-icons/fa";

const Edit = ({ onClick }) => {
  return (
    <FaUserEdit title='Editer' onClick={onClick} style={{ cursor: 'pointer', color: '#F0C300', fontSize: '20px', marginBottom:"10px" }} />
  );
};

export default Edit;

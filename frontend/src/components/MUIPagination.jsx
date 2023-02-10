import { Pagination, PaginationItem } from '@mui/material';
import React from 'react'
import { Link } from 'react-router-dom';

const MUIPagination = ({ count, page, redirect, changePage }) => {
  return (
    <Pagination
      //classes={{ ul: classes.ul }}
      count={count}
      page={page}
      //size="small"
      onChange={(event, value) => changePage(value)} //handle click & pass btn value=page//
      color="secondary"
      variant="outlined"
      shape="rounded"
      siblingCount={8}
      showFirstButton
      showLastButton
    //   renderItem={(   //not displaying active btn color//end btn going beyond range/don't use
    //     item //renderItem handle btn/item click and adds page query to url
    //   ) => (
    //     <PaginationItem
    //       {...item}
    //       component={Link}
    //       to={`${redirect}=${item.page}`}
    //     />
    //   )}
    />
  );
};

export default MUIPagination
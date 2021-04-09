import React from "react";
import styled from "styled-components/macro";
import PropTypes from "prop-types";

import Table from "antd/lib/table";

const StyledTable = styled(Table)`
  margin: -2rem;
  width: calc(100% + 4rem);
  max-width: calc(100% + 4rem);

  table {
    border-top: 1px solid #e0e0e0;

    tr, th, td {
      border-bottom: 1px solid #e0e0e0;
    }

    tr {
      height: 40px;
    }
  }

  .ant-pagination {
    margin-right: 2rem;
  }
`;

const AntdTable = ({ dataSource, columns, ...rest }) => {
  return <StyledTable {...rest} dataSource={dataSource} columns={columns} />;
};

AntdTable.propTypes = {
  dataSource: PropTypes.array,
  columns: PropTypes.array,
};

AntdTable.defaultProps = {
  dataSource: [],
  columns: [],
};

export default AntdTable;

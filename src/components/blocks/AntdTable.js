import React from "react";
import styled from "styled-components/macro";
import PropTypes from "prop-types";

import Table from "antd/lib/table";

const StyledTable = styled(Table)`
  margin: -2rem;
  width: calc(100% + 4rem);
  max-width: calc(100% + 4rem);
  margin-top: 1rem !important;

  table {
    border-top: 1px solid #e0e0e0;

    tr,
    th,
    td {
      border-bottom: 1px solid #e0e0e0;
      font-size: 16px;
    }

    th,
    td {
      padding: 0.5rem 2rem;
    }
  }

  .ant-pagination {
    margin-right: 2rem;
  }

  .ant-pagination-item {
    border: none;
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

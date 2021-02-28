import { useState, useEffect, useContext } from 'react';
import { Link as PlainLink } from 'react-router-dom';
import { CurrentMenuStateContext, CurrentMenuDispatchContext } from '../../contexts/CurrentMenuContext';
import { ModalStateContext } from '../../contexts/ModalContext';
import { NotificationDispatchContext } from '../../contexts/NotificationContext';
import Table from '../elements/Table';
import Th from '../elements/Th';
import Td from '../elements/Td';
import Button from '../elements/Button';
import Checkbox from '../elements/Checkbox';
import Link from '../elements/Link';
import TableMenu from '../blocks/TableMenu';
import Loader from '../blocks/Loader';
import Modal from '../blocks/Modal';
import FormError from '../blocks/FormError';
import CopyableText from '../elements/CopyableText';
import ToggleText from '../blocks/ToggleText';
import { ReactComponent as CheckGreen } from '../../images/CheckGreen.svg';
import { ReactComponent as ErrorIcon } from '../../images/ErrorIcon.svg';

const TableContent = props => {

  const dispatch = useContext(NotificationDispatchContext);

  const currentMenu = useContext(CurrentMenuStateContext);
  const setCurrentMenu = useContext(CurrentMenuDispatchContext);

  const modalOpen = useContext(ModalStateContext);
  const [ showTableLoader, setShowTableLoader ] = useState(true);
  const [ showModalLoader, setShowModalLoader ] = useState(false);
  const [ content,         setContent         ] = useState([]);
  const [ contentToDelete, setContentToDelete ] = useState({});

  //=============================================================================
  // Get and sort content
  //=============================================================================
  const [ sort, setSort ] = useState({
    column: props.columns[0].key,
    order: 'asc',
  });
  const sortTableContent = ({ newContent, column }) => {
    const newSortOrder = sort.column === column
      ? sort.order === 'asc'
        ? 'desc'
        : 'asc'
      : 'asc';
    column = column || sort.column;
    newContent = newContent || content;
    const sortedContent = [...newContent];
    sortedContent.sort((a, b) => {
      let valA;
      let valB;
      if (!a[column]) {
        valA = '';
        valB = '';
      } else if (typeof a[column] === 'object') {
        if (a[column].type === 'masked') {
          valA = a[column].masked;
          valB = b[column].masked;
        }
        if (a[column].type === 'normal') {
          valA = a[column].content;
          valB = b[column].content;
        }
      } else if (typeof a[column] === 'number') {
        valA = (a[column] && a[column]) || 0;
        valB = (b[column] && b[column]) || 0;
      } else {
        valA = (a[column] && a[column].toLowerCase()) || '';
        valB = (b[column] && b[column].toLowerCase()) || '';
      }
      if (newSortOrder === 'asc') {
        return valA > valB ? 1 : valA < valB ? -1 : 0;
      } else {
        return valA < valB ? 1 : valA > valB ? -1 : 0;
      }
    });
    setContent(sortedContent);
    setSort({
      column,
      order: newSortOrder
    });
  };
  useEffect(() => {
    const getNewContent = async () => {
      const newContent = await props.getContent();
      sortTableContent({ newContent });
      setShowTableLoader(false);
    };
    getNewContent();
    // eslint-disable-next-line
  }, []);

  //=============================================================================
  // Handle checkboxes
  //=============================================================================
  const [ selected, setSelected ] = useState([]);
  const checkboxesToggleAll = e => {
    if (content.length === selected.length) {
      setSelected([]);
    } else {
      setSelected(content.map(c => c.sid));
    }
  };
  const checkboxesToggleOne = e => {
    const sid = e.target.value;
    setSelected(prev => {
      if (prev.includes(sid)) {
        return prev.filter(p => p !== sid);
      } else {
        return [...prev, sid];
      }
    });
  };

  const handleBulkAction = async (selected, i) => {
    setShowTableLoader(true);
    const success = await props.bulkAction(selected, i);
    if (success) {
      const newContent = await props.getContent();
      sortTableContent({ newContent });
      setSelected([]);
      dispatch({
        type: 'ADD',
        level: 'success',
        message: 'Number routing updated',
      });
    }
    setShowTableLoader(false);
  };

  //=============================================================================
  // Handle Open Menus (i.e. bulk action menu or 3 dots on right of each row)
  //=============================================================================
  const handleCurrentMenu = sid => {
    if (currentMenu === sid) {
      setCurrentMenu(null);
    } else {
      setCurrentMenu(sid);
    }
  };

  //=============================================================================
  // Handle Adding content
  //=============================================================================
  const [ showNewContentModal,  setShowNewContentModal  ] = useState(false);
  const [ showNewContentLoader, setShowNewContentLoader ] = useState(false);
  const [ newItem,              setNewItem              ] = useState('');
  const addContent = async () => {
    setShowNewContentModal(true);
    setShowNewContentLoader(true);
    const result = await props.addContent();
    if (result !== 'error') {
      const newContent = await props.getContent();
      sortTableContent({ newContent });
      setNewItem(result);
    } else {
      setShowNewContentModal(false);
    }
    setShowNewContentLoader(false);
  };

  //=============================================================================
  // Handle Deleting content
  //=============================================================================
  const [ errorMessage, setErrorMessage ] = useState('');
  const deleteContent = async () => {
    setShowModalLoader(true);
    const result = await props.deleteContent(contentToDelete);
    if (result === 'success') {
      const newContent = await props.getContent();
      sortTableContent({ newContent });
      setContentToDelete({});
      dispatch({
        type: 'ADD',
        level: 'success',
        message: `${props.name.charAt(0).toUpperCase()}${props.name.slice(1)} deleted successfully`,
      });
    } else {
      setErrorMessage(result);
    }
    setSelected([]);
    setShowModalLoader(false);
  };

  //=============================================================================
  // Render
  //=============================================================================
  return (
    <>
      {showNewContentModal && (
        <Modal
          title={`Here is your new ${props.name}`}
          closeText="Close"
          loader={showNewContentLoader}
          content={
            <CopyableText
              text={newItem}
              textType={props.name}
              inModal
              hasBorder
            />
          }
          handleCancel={() => setShowNewContentModal(false)}
          normalButtonPadding
        />
      )}

      {contentToDelete && (
        contentToDelete.name ||
        contentToDelete.number ||
        contentToDelete.tenant_fqdn ||
        contentToDelete.token ||
        contentToDelete.vendor
      ) && (
        <Modal
          title={`Are you sure you want to delete the following ${props.name}?`}
          loader={showModalLoader}
          content={
            <div>
              <table>
                <tbody>
                  {props.formatContentToDelete(contentToDelete).map((d, i) => (
                    <tr key={i}>
                      <Td deleteModal>{d.name}</Td>
                      <Td deleteModal>
                        {typeof d.content === 'string'
                          ? d.content
                          : <ul>
                              {d.content.map((c, i) => (
                                <li key={i}>{c}</li>
                              ))}
                            </ul>
                        }
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {errorMessage && (
                <FormError message={errorMessage} />
              )}
            </div>
          }
          handleCancel={() => {
            setContentToDelete({});
            setErrorMessage('');
          }}
          handleSubmit={deleteContent}
          actionText="Delete"
        />
      )}
      <Table
        withCheckboxes={props.withCheckboxes}
        fullWidth={props.fullWidth}
        condensed={props.condensed}
        normalTable={props.normalTable}
      >
        <thead>
          <tr>
            {props.withCheckboxes && (
              <Th>
                <Button
                  checkbox={
                    !selected.length
                      ? 'none'
                      : content.length === selected.length
                        ? 'all'
                        : 'partial'
                  }
                  onClick={checkboxesToggleAll}
                />
              </Th>
            )}
            {props.columns.map((c, i) => (
              <Th
                key={c.key}
                style={{ width: c.width }}
                textAlign={c.textAlign}
              >
                {selected.length && i === props.columns.length - 1 ? (
                  <div
                    style={{
                      position: 'relative',
                      display: 'inline-block',
                      marginLeft: '-1rem',
                    }}
                  >
                    <TableMenu
                      bulkEditMenu
                      buttonText="Choose Application"
                      sid="bulk-menu"
                      open={currentMenu === 'bulk-menu'}
                      handleCurrentMenu={handleCurrentMenu}
                      disabled={modalOpen}
                      menuItems={
                        props.bulkMenuItems.map(i => ({
                          name: i.name,
                          type: 'button',
                          action: () => handleBulkAction(selected, i),
                        }))
                      }
                    />
                  </div>
                ) : (
                  <Button
                    text
                    gray
                    tableHeaderLink
                    onClick={() => sortTableContent({ column: c.key })}
                  >
                    {c.header}
                    {sort.column === c.key
                      ? sort.order === 'asc'
                        ? <span>&#9652;</span>
                        : <span>&#9662;</span>
                      : null
                    }
                  </Button>
                )}
              </Th>
            ))}
            {props.addContent ? (
              <th>
                <Button onClick={addContent}>+</Button>
              </th>
            ) : props.noMenuOnRows ? (
              null
            ) : (
              <Th buttonColumn></Th>
            )}
          </tr>
        </thead>
        <tbody>
          {showTableLoader ? (
            <tr>
              <Td colSpan={props.withCheckboxes ? props.columns.length + 1 : props.columns.length}>
                <Loader height={'71px'} />
              </Td>
            </tr>
          ) : (
            !content || !content.length ? (
              <tr>
                <Td emptyResults colSpan={props.withCheckboxes ? props.columns.length + 1 : props.columns.length}>
                  No {props.name}s
                </Td>
                <Td></Td>
              </tr>
            ) : (
              content.map(a => (
                <tr key={a.sid}>
                  {props.withCheckboxes && (
                    <Td>
                      <Checkbox
                        noLeftMargin
                        id={a.sid}
                        value={a.sid}
                        onChange={checkboxesToggleOne}
                        checked={selected.includes(a.sid)}
                      />
                    </Td>
                  )}
                  {props.columns.map((c, i) => {
                    let columnContent = '';
                    let columnTitle = null;
                    if (a[c.key]) {
                      if (typeof a[c.key] === 'object') {
                        if (a[c.key].type === 'normal') {
                          columnContent = a[c.key].content;
                          columnTitle = columnContent;
                        } else if (a[c.key].type === 'link') {
                          columnContent = <Link to={a[c.key].url}>{a[c.key].content}</Link>;
                        } else if (a[c.key].type === 'masked') {
                          columnContent = <ToggleText masked={a[c.key].masked} revealed={a[c.key].revealed} />;
                        } else if (a[c.key].type === 'status') {
                          columnContent = a[c.key].content === 'ok' ? <CheckGreen />
                                        : a[c.key].content === 'fail' ? <ErrorIcon />
                                        : a[c.key].content;
                          columnTitle = a[c.key].title;
                        }
                      } else {
                        columnContent = a[c.key];
                        columnTitle = columnContent;
                      }
                    }
                    return (
                      <Td
                        key={c.key}
                        bold={c.bold}
                        textAlign={c.textAlign}
                      >
                        {i === 0 && props.urlParam
                          ? <span>
                              <PlainLink
                                to={`/account/${props.urlParam}/${a.sid}/edit`}
                                tabIndex={modalOpen ? '-1' : ''}
                              >
                                <span tabIndex="-1" title={columnTitle}>
                                  {columnContent}
                                </span>
                              </PlainLink>
                            </span>
                          : <span title={columnTitle}>{columnContent}</span>
                        }
                      </Td>
                    );
                  })}
                  {!props.noMenuOnRows && (
                    <Td containsMenuButton>
                      <TableMenu
                        sid={a.sid}
                        open={currentMenu === a.sid}
                        handleCurrentMenu={handleCurrentMenu}
                        disabled={modalOpen}
                        menuItems={[
                          {
                            name: 'Edit',
                            type: 'link',
                            url: `/account/${props.urlParam}/${a.sid}/edit`,
                          },
                          {
                            name: 'Delete',
                            type: 'button',
                            action: () => setContentToDelete(a),
                          },
                        ]}
                      />
                    </Td>
                  )}
                </tr>
              ))
            )
          )}
        </tbody>
      </Table>
    </>
  );
};

export default TableContent;

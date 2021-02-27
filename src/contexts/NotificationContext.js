import { createContext, useReducer } from 'react';
import { v4 as uuid } from 'uuid';
import NotificationReducer from '../reducers/NotificationReducer';

export const NotificationStateContext = createContext();
export const NotificationDispatchContext = createContext();

/*
 * This context is used to display notifications.
 *
 * Usage:
 *   dispatch({
 *     type: 'ADD',
 *     level: 'success',
 *     message: 'Your message here.',
 *   });
 *
 * Types:
 *   'ADD'
 *   'REMOVE'
 *
 * Levels:
 *   'success'
 *   'info'
 *   'error'
 *
 * NOTE: 'info' is only used by convention. Any level supplied that does
 * not match 'success' or 'error' will match the 'info' styling.
 *
 * See also:
 *   - Reducer: src/reducers/NotificationReducer.js
 *   - Component: src/components/blocks/Notification.js
 */

export function NotificationProvider(props) {

  const [state, dispatch] = useReducer(NotificationReducer, []);

  const interceptDispatch = action => {
    if (action.type === 'ADD') {
      const id = uuid();
      const actionWithId = { ...action, id };
      dispatch(actionWithId);
      setTimeout(() => {
        dispatch({ type: 'REMOVE', id });
      }, 3000);
      return;
    }
    dispatch(action);
  };

  return (
    <NotificationStateContext.Provider value={state}>
      <NotificationDispatchContext.Provider value={interceptDispatch}>
        {props.children}
      </NotificationDispatchContext.Provider>
    </NotificationStateContext.Provider>
  );
}

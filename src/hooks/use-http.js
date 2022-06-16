import { useReducer, useCallback } from 'react';

function httpReducer(state, action) {
  if (action.type === 'SEND') {
    return {
      data: null,
      error: null,
      status: 'pending',
    };
  }

  if (action.type === 'SUCCESS') {
    return {
      data: action.responseData,
      error: null,
      status: 'completed',
    };
  }

  if (action.type === 'ERROR') {
    return {
      data: null,
      error: action.errorMessage,
      status: 'completed',
    };
  }

  return state;
}

function useHttp(requestFunction, startWithPending = false) {
  const [httpState, dispatch] = useReducer(httpReducer, {
    status: startWithPending ? 'pending' : null,
    data: null,
    error: null,
  });

  const sendRequest = useCallback(
    async function (requestData) {
      dispatch({ type: 'SEND' });
      try {
        const responseData = await requestFunction(requestData);
        dispatch({ type: 'SUCCESS', responseData });
      } catch (error) {
        dispatch({
          type: 'ERROR',
          errorMessage: error.message || 'Something went wrong!',
        });
      }
    },
    [requestFunction]
  );

  return {
    sendRequest,
    ...httpState,
  };
}

export default useHttp;


// export async function addQuote(quoteData) {
//     const response = await fetch(`${FIREBASE_DOMAIN}/quotes.json`, {
//       method: 'POST',
//       body: JSON.stringify(quoteData),
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//     const data = await response.json();
  
//     if (!response.ok) {
//       throw new Error(data.message || 'Could not create quote.');
//     }
  
//     return null;
//   }
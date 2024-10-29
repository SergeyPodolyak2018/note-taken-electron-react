import { TMain, TNoteUI } from '../definitions/main';

export type TState = { main: TMain };

export type TAction =
  | { type: 'SET_LOADING'; payload: TMain['status'] }
  | { type: 'ADD_All_DATA'; payload: TMain['data'] }
  | { type: 'ADD_ONE'; payload: TNoteUI }
  | { type: 'UPDATE_ONE'; payload: TNoteUI };

export const mainReducer = (state: TState, action: TAction): TState => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        main: {
          ...state.main,
          status: action.payload,
        },
      };
    case 'ADD_All_DATA':
      return {
        ...state,
        main: {
          ...state.main,
          data: action.payload,
          status: 'loaded',
        },
      };
    case 'ADD_ONE':
      return {
        ...state,
        main: {
          ...state.main,
          data: [action.payload, ...state.main.data],
          status: 'loaded',
        },
      };
    case 'UPDATE_ONE':
      const index = state.main.data.findIndex(
        (el) => el.id === action.payload.id
      );
      const newData = [...state.main.data];
      newData[index] = action.payload;
      return {
        ...state,
        main: {
          ...state.main,
          data: newData,
          status: 'loaded',
        },
      };
    default:
      return state;
  }
};

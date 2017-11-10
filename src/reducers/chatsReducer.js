const INITIAL_STATE = {
  name: null,
  customer_id: null,
  chats: []
};

export default (state = INITIAL_STATE, action) => {
  console.log(state);
  switch (action.type) {
    case 'fetch_chats':
      return { ...state, chats: action.payload }
    default:
      return state;
  }
};
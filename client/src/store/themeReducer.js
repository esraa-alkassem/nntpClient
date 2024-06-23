// Initial state
const initialState = {
  theme: "light", // default theme
};

// Action types
const TOGGLE_THEME = "TOGGLE_THEME";

// Reducer
export const themeReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_THEME:
      return {
        ...state,
        theme: state.theme === "light" ? "dark" : "light",
      };
    default:
      return state;
  }
};

export const toggleTheme = () => ({
  type: TOGGLE_THEME,
});

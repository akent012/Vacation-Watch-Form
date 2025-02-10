import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: "#1E3A8A", // Adjust primary color
        },
        secondary: {
            main: "#FF5722", // Adjust secondary color
        },
        background: {
            default: "#f4f4f4", // Background color
        },
    },
  

    typography: {
        fontFamily: "'Poppins', sans-serif",
    }

});

export default theme;

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import InputMask from "react-input-mask";
import PropTypes from "prop-types"; // Import prop-types
import { TimePicker } from '@mui/x-date-pickers';
import { DirectionsCar } from "@mui/icons-material";
import {
    ThemeProvider,
    CssBaseline,
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Divider,
    Grid,
    Snackbar,
    Alert,
    Checkbox,
    Autocomplete,
    FormControlLabel,
    Switch
} from "@mui/material";
import { AddCircleOutline } from "@mui/icons-material";
import axios from "axios";
import theme from "./theme";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const mainLogo = "/voi_logo.png";
const policeBadge = "/pd_badge.png";


const VacationWatchForm = ({ onFormSubmit }) => {

    const earliestDate = (() => {
        const now = new Date();
        // Convert to Central Time
        const chicagoTime = new Intl.DateTimeFormat("en-US", {
            timeZone: "America/Chicago",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }).format(now);

        // Parse the formatted date to ensure it's in the correct format
        const [month, day, year] = chicagoTime.split("/");
        const centralDate = new Date(`${year}-${month}-${day}T00:00:00-06:00`);

        // Subtract one day
        centralDate.setDate(centralDate.getDate());

        return centralDate.toISOString().split("T")[0]; // Format to YYYY-MM-DD
    })();
       
    useEffect(() => {
        // Scroll to the top of the page when the component loads
        window.scrollTo({ top: 0, behavior: "auto" });
    }, []); // Empty dependency array ensures this runs only on mount
    const [formData, setFormData] = useState({
        referenceID: "",
        formType: "vacationWatch", //either vacationWatch or forSale!
        residentEmail: "",
        IPAddress: "",
        madID: "",
        residentName: "",
        address: "",
        residentPhone: "",
        residentPhone2: "",
        origin: earliestDate,
        startDate: earliestDate,
        endDate: "",
        startTime: "",
        startDateTime: "",
        endDateTime: "",
        endTime: "",
        cameras: "No",
        lightsOnTimer: "No",
        keyholderName: "",
        keyholderPhone: "",
        keyholderPhone2: "",
        reason: "",
        vehicles: [{ type: "" }],
        currAdd: "",
        tempAddress: ""
    });

    const [errors, setErrors] = useState({});
    const [errorPopup, setErrorPopup] = useState("");
    const [addressOptions, setAddressOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [shakeField, setShakeField] = useState(""); // Tracks the field to shake
    const [tempAddress, setTempAddress] = useState(""); // Track current input for search
    const [isVacationWatch, setIsVacationWatch] = useState(true);

    //const timePickerRef = useRef(null);

    const startDatePickerRef = useRef(null);
    const endDatePickerRef = useRef(null);
    const startTimeInputRef = useRef(null);
    const endTimeInputRef = useRef(null);

    const fetchAddresses = async (query) => {
        try {
            setIsLoading(true);
            //const response = await axios.get(`https://dpa.inverness-il.gov/aws/api/Address/search?query=${query}`);
            const response = await axios.get(`/ws/api/Address/search?query=${query}`);

            // Convert response.data (object) to an array of values
            const formattedData = Object.values(response.data || {});

            setAddressOptions(formattedData);
        } catch (error) {
            console.error("Error fetching addresses:", error.message);
            setAddressOptions([]);
        } finally {
            setIsLoading(false);
        }
    };



    const handleAddressInputChange = (value) => {
        if (value && value.trim().length >= 1) {
            fetchAddresses(value.trim());
        } else {
            setAddressOptions([]); // Clear options if input is empty or too short
        }
    };




    const scrollToFirstError = (validationErrors) => {
        /*
        const firstErrorKey = Object.keys(validationErrors)[0]; // Get the first error field key
        if (firstErrorKey) {
            // Find the field by its name attribute
            const firstErrorField = document.querySelector(`[name="${firstErrorKey}"]`);
            if (firstErrorField) {
                // Scroll the field into view and bring it to the center
                firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });

                // Focus on the field after scrolling
                firstErrorField.focus({ preventScroll: true }); // Prevents additional scrolling when focusing
            }
        }
        */

        const firstErrorKey = Object.keys(validationErrors)[0]; // Get the first error field key
        let refToFocus = null;

        switch (firstErrorKey) {
            case "startDate":
                refToFocus = startDatePickerRef.current;
                break;
            case "endDate":
                refToFocus = endDatePickerRef.current;
                break;
            case "startTime":
                refToFocus = startTimeInputRef.current; // Access the input inside TimePicker
                break;
            case "endTime":
                refToFocus = endTimeInputRef.current; // Access the input inside TimePicker
                break;
            default:
                refToFocus = document.querySelector(`[name="${firstErrorKey}"]`);
        }

        if (refToFocus) {
            refToFocus.scrollIntoView({ behavior: "smooth", block: "center" });
            refToFocus.focus({ preventScroll: true }); // Focus the field
        }

    };

    useEffect(() => {
        // Clear endDate if startDate changes or startDate > endDate
        if (formData.startDate > formData.endDate) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                endDate: "",
                endTime: "",
                startTime: ""
            }));
        }
        if (formData.endDate > formData.startDate) {
            setFormData((prevFormData) => ({
                ...prevFormData,

                endTime: ""

            }));
        }
    }, [formData.startDate, formData.endDate]); // Run whenever startDate or endDate changes




    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };


    const handleVehicleChange = (index, value) => {
        const updatedVehicles = [...formData.vehicles];
        updatedVehicles[index].type = value;
        setFormData({ ...formData, vehicles: updatedVehicles });
    };

    const addVehicleField = () => {
        setFormData({ ...formData, vehicles: [...formData.vehicles, { type: "" }] });
    };

    const removeVehicleField = (index) => {
        const updatedVehicles = formData.vehicles.filter((_, i) => i !== index);
        setFormData({ ...formData, vehicles: updatedVehicles });
    };


    const shakeAnimation = {
        initial: { x: 0 },
        animate: {
            x: [0, -10, 10, -10, 10, 0], // Shake back and forth
            transition: { duration: 0.4 },
        },
        exit: { x: 0 }, // Ensure reset to the original position
    };


    const validate = () => {
        const formErrors = {};
        const nameRegex = /^[a-zA-Z\s]+$/; // Only letters and spaces
        const phoneRegex = /^\(\d{3}\)\s\d{3}-\d{4}$/; // Matches (123) 456-7899 format


        // Address Validation
        if (!formData.address.trim() || !formData.madID) {
            formErrors.address = "Please select a valid address from the list.";
        }

        // Start Date Validation
        if (!formData.startDate) {
            formErrors.startDate = "Start Date is required.";
        }

        // End Date Validation
        if (!formData.endDate) {
            formErrors.endDate = "End Date is required.";
        }

        // Start time Validation
        if (!formData.startTime) {
            formErrors.startTime = "Start time is required.";
        }

        // End time Validation
        if (!formData.endTime) {
            formErrors.endTime = "End time is required.";
        }

        // Resident Name Validation
        if (!formData.residentName.trim()) {
            formErrors.residentName = "Resident Name is required.";
        } else if (!nameRegex.test(formData.residentName)) {
            formErrors.residentName =
                "Resident Name cannot contain numbers or special characters.";
        }

        if (!formData.residentEmail.trim()) {
            formErrors.residentEmail = "Resident E-Mail is required.";
        } else {

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email validation regex
            if (!emailRegex.test(formData.residentEmail)) {
                formErrors.residentEmail = "Please enter a valid email address.";
            }
        }

      

        //if (!formData.formType) {
        //    formErrors.formType = "Please select the reason of why you are filling out this form.";
        //}

        // Resident Phone Validation
        if (!formData.residentPhone.trim()) {
            formErrors.residentPhone = "Resident Phone number is required.";
        } else if (!phoneRegex.test(formData.residentPhone)) {
            formErrors.residentPhone =
                "Please enter a valid phone number in the format (123) 456-7899.";
        }

        if (formData.residentPhone2.trim()) {
            // formErrors.residentPhone2 = "Resident Phone #2 number is required.";

            if (!phoneRegex.test(formData.residentPhone2)) {
                formErrors.residentPhone2 =
                    "Please enter a valid phone number in the format (123) 456-7899.";
            }

        } 

        /*
        if (!formData.residentPhone2.trim()) {
            formErrors.residentPhone2 = "Resident Phone #2 number is required.";
        } else if (!phoneRegex.test(formData.residentPhone2)) {
            formErrors.residentPhone2 =
                "Please enter a valid phone number in the format (123) 456-7899.";
        }
        */

    

       
       //IF KEY HOLDER NAME is ENTERED also require Keyholder Phone number
        if (formData.keyholderName.trim()) {

            if (!nameRegex.test(formData.keyholderName)) {
                formErrors.keyholderName =
                    "Keyholder Name cannot contain numbers or special characters.";
            }

            if (!formData.keyholderPhone.trim()) {
                formErrors.keyholderPhone = "Keyholder Phone number is required.";
            } else if (!phoneRegex.test(formData.keyholderPhone)) {
                formErrors.keyholderPhone =
                    "Please enter a valid phone number in the format (123) 456-7899.";
            }

            if (formData.keyholderPhone2.trim()) {
                //formErrors.keyholderPhone = "Keyholder Phone number is required.";

                if (!phoneRegex.test(formData.keyholderPhone2)) {
                    formErrors.keyholderPhone =
                        "Please enter a valid phone number in the format (123) 456-7899.";
                }
            } 
                       
        } 


        //IF KEY HOLDER NAME is ENTERED also require Keyholder Phone number
        if (formData.keyholderPhone.trim()) {

            if (!phoneRegex.test(formData.keyholderPhone)) {
                formErrors.keyholderPhone =
                    "Please enter a valid phone number in the format(123) 456 - 7899.";
            }

            if (!formData.keyholderName.trim()) {
                formErrors.keyholderName = "Keyholder Name is required.";
            } else if (!nameRegex.test(formData.keyholderName)) {
                formErrors.keyholderName =
                    "Keyholder Name cannot contain numbers or special characters.";
            }

            if (formData.keyholderPhone2.trim()) {
                //formErrors.keyholderPhone = "Keyholder Phone number is required.";

                if (!phoneRegex.test(formData.keyholderPhone2)) {
                    formErrors.keyholderPhone =
                        "Please enter a valid phone number in the format (123) 456-7899.";
                }
            }

        } 


        //IF KEY HOLDER NAME is ENTERED also require Keyholder Phone number
        if (formData.keyholderPhone2.trim()) {

            if (!phoneRegex.test(formData.keyholderPhone2)) {
                formErrors.keyholderPhone2 =
                    "Please enter a valid phone number in the format(123) 456 - 7899.";
            }

            if (!formData.keyholderName.trim()) {
                formErrors.keyholderName = "Keyholder Name is required.";
            } else if (!nameRegex.test(formData.keyholderName)) {
                formErrors.keyholderName =
                    "Keyholder Name cannot contain numbers or special characters.";
            }

            if (!formData.keyholderPhone.trim()) {
                formErrors.keyholderPhone = "Keyholder Phone number is required.";
            } else if (!phoneRegex.test(formData.keyholderPhone)) {
                formErrors.keyholderPhone =
                    "Please enter a valid phone number in the format (123) 456-7899.";
            }

            

        } 

        // Keyholder Name Validation
        /*
        if (!formData.keyholderName.trim()) {
            formErrors.keyholderName = "Keyholder Name is required.";
        } else if (!nameRegex.test(formData.keyholderName)) {
            formErrors.keyholderName =
                "Keyholder Name cannot contain numbers or special characters.";
        }

        // Keyholder Phone Validation
        if (!formData.keyholderPhone.trim()) {
            formErrors.keyholderPhone = "Keyholder Phone number is required.";
        } else if (!phoneRegex.test(formData.keyholderPhone)) {
            formErrors.keyholderPhone =
                "Please enter a valid phone number in the format (123) 456-7899.";
        }

        // Keyholder Phone Validation
        if (!phoneRegex.test(formData.keyholderPhone2) && formData.keyholderPhone2.length > 0) {
            formErrors.keyholderPhone2 =
                "Please enter a valid phone number in the format (123) 456-7899.";
        }
        */

        return formErrors; // Return the errors object
    };








    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validate(); // Get validation errors
        setErrors(validationErrors); // Update the state with errors

        if (Object.keys(validationErrors).length > 0) {
            const firstErrorKey = Object.keys(validationErrors)[0];
            setShakeField(firstErrorKey); // Trigger shake effect for the first error field
            setTimeout(() => setShakeField(""), 500); // Reset shakeField after animation
            const errorMessage =
                Object.keys(validationErrors).length > 1
                    ? "Multiple errors. Please fix before submitting."
                    : validationErrors[firstErrorKey];

            setErrorPopup(errorMessage);
            scrollToFirstError(validationErrors); // Pass the validationErrors directly
            return;
        }

        const tz = "America/Chicago";
               
        formData.startDateTime = formData.startDate && formData.startTime
            ? dayjs(`${formData.startDate} ${formData.startTime}`, "YYYY-MM-DD h:mm A T00:00:00-06:00").format()//toISOString()
            : null;

        formData.endDateTime = formData.endDate && formData.endTime
            ? dayjs(`${formData.endDate} ${formData.endTime}`, "YYYY-MM-DD h:mm A T00:00:00-06:00").format()//toISOString()
            : null;

        // Prepare payload as the backend expects
        const formattedData = {
            ...formData,
            vehicles: formData.vehicles.map((v) => v.type), // Ensure it's an array of strings
        };

        console.log("Formatted Payload:", formattedData);

        try {
            const response = await axios.post(
                //'https://dpa.inverness-il.gov/aws/api/Address/add',
                //`https://localhost:7259/api/Address/add`,
                `/ws/api/Address/add`,
                formattedData,
                { headers: { "Content-Type": "application/json" } }
            );

            if (response.status === 200 || response.status === 201) {
                console.log("response:", response);

                var tmpREDID = response.data.refid;
                formData.referenceID = tmpREDID;

                onFormSubmit(formData);
                setFormData({
                    referenceID: "",
                    formType: "vacationWatch",
                    residentEmail: "",
                    madID: "",
                    residentName: "",
                    address: "",
                    residentPhone: "",
                    residentPhone2: "",
                    startTime: "",
                    startDateTime: "",
                    startDate: earliestDate,
                    endDate: "",
                    endTime: "",
                    endDateTime: "",
                    cameras: "No",
                    lightsOnTimer: "No",
                    keyholderName: "",
                    keyholderPhone: "",
                    keyholderPhone2: "",
                    reason: "",
                    tempAddress: "",
                    currAdd: "",
                    vehicles: [{ type: "" }],

                });
                setErrors({});
                onFormSubmit();
            }
        } catch (error) {

            console.error("Error during submission:", error.response?.data || error.message);
        }
    };

    const handleToggle = (event) => {
        setIsVacationWatch(event.target.checked);
        if (formData.formType == "forSale") {
            formData.formType = "vacationWatch";
            return;
        }
        if (formData.formType == "vacationWatch") {
            formData.formType = "forSale";

        }




    };


    const handleClosePopup = () => setErrorPopup("");


    //HTML --------------------------------------------------------------------------------------------------------------------
    return (
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: .88, ease: "easeInOut" }}
        >
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Container maxWidth="md">
                    <Snackbar
                        open={!!errorPopup}
                        autoHideDuration={4000}
                        onClose={handleClosePopup}
                        anchorOrigin={{ vertical: "top", horizontal: "center" }}
                    >
                        <Alert onClose={handleClosePopup} severity="error" sx={{ width: "100%" }}>
                            {errorPopup}
                        </Alert>
                    </Snackbar>

                    <Paper
                        sx={{
                            p: 1,
                            //boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)", // Soft shadow for a modern look
                            bgcolor: "#f8f9fa", // Light background color
                            borderRadius: 0, // Slightly more rounded corners
                            border: "0px solid #ced4da", // Neutral border for clean design


                        }}
                    >
                        {/* Police Badge and Text Section */}
                        <Box
                            sx={{
                                width: "100%",
                                //maxWidth: "700px",
                                margin: "0 auto", // Center the box horizontally
                                textAlign: "center",
                                paddingTop:"20px",
                                //padding: "1rem 1rem", // Sleek padding for spacing
                                //  backgroundColor: "#ffffff", // Clean white background
                                borderRadius: "0px",
                                // boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Light shadow for subtle depth
                                position: "relative", // Enable precise positioning for elements

                            }}
                        >
                            {/* Top Left Corner: Police Star */}
                            <img
                                src={policeBadge}
                                alt="Police Star"
                                style={{
                                    position: "absolute",
                                    top: "1rem",
                                    left: "5px",
                                    height: "75px", // Increased size
                                }}
                            />

                            {/* Top Right Corner: Inverness Logo */}
                            <img
                                src={mainLogo}
                                alt="Inverness Logo"
                                style={{
                                    position: "absolute",
                                    top: "1rem",
                                    right: "5px",
                                    height: "80px", // Increased size
                                }}
                            />


                            {/* Main Heading */}
                            <Typography
                                fontSize="1.6em" // Larger size for emphasis
                                fontWeight="bold"
                                sx={{
                                    color: "#1E3A8A", // Sleek blue tone
                                    fontFamily: "'Merriweather', serif", // More appropriate and elegant font
                                    margin: "10px 60px 0px 60px", // Reduced space for tighter grouping
                                    letterSpacing: "0px", // Slightly wider for visual impact
                                }}
                            >
                                INVERNESS POLICE DEPARTMENT
                            </Typography>

                            {/* Subheading */}
                            <Typography
                                fontWeight="bold"
                                fontSize="1em" // Smaller and subtler
                                sx={{
                                    color: "#404040", // Neutral gray for contrast
                                    textTransform: "uppercase",
                                    marginTop: "0.7rem",
                                    marginBottom: "1rem", // Space before the next section
                                    letterSpacing: "0px", // Balanced spacing
                                }}
                            >
                                House Watch Request
                            </Typography>



                            {/* Purpose Description */}
                            <Typography
                                fontWeight="400"
                                fontSize="0.9rem"
                                sx={{
                                    color: "#374151", // Deep gray for readability
                                    textAlign: "justify",
                                    //lineHeight: "1.7",
                                    //letterSpacing: "0.5px",
                                }}
                            >
                                The objective of the Inverness Police Department is to enhance community safety and foster trust and collaboration between law enforcement and residents. Our watch programs are designed to provide added security and peace of mind.
                                <br></br><br></br>
                                For residents requesting a Vacation Watch, having the police monitor your home while you're away helps deter potential burglars, ensures a quick response to suspicious activities, and enhances overall security, allowing you to enjoy your time away without worry.
                                <br></br><br></br>
                                For those utilizing our For-Sale Watch service, this program ensures extra vigilance over properties listed for sale, helping to protect vacant homes and deter trespassing or unauthorized access. By keeping a close watch on these properties, we aim to provide a safer and more secure environment for all.
                                <br></br><br></br>
                                Through these services, we are dedicated to protecting our community, fostering a strong partnership between residents and law enforcement, and delivering the highest level of customer service.
                            </Typography>
                        </Box>

                        <Box sx={{ paddingTop: "0rem" }}> {/* Add padding above the form */} </Box>

                        <form onSubmit={handleSubmit}>

                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    pb: 0, // Padding below the text
                                    borderBottom: "2px solid #1E3A8A", // Border color and thickness
                                }}
                            >
                                {/* Resident Details Title */}
                                <Typography
                                    //variant="h6"
                                    sx={{
                                        mb: 2,
                                        fontSize: "1em",
                                        color: "#1E3A8A",
                                        fontWeight: "bold",
                                        letterSpacing: "0px",
                                        marginTop: "25px",
                                      
                                       
                                    }}
                                >
                                    WATCH INFO
                                </Typography>

                                {/* Slider for Vacation Watch and For Sale */}
                                <Box sx={{ mb: 0 }}> {/* Add some margin below the heading */}
                                    {/* Heading for the Toggle */}

                                    <Box sx={{ display: "flex", alignItems: "center", gap: 0, marginTop: "10px" }}>
                                        {/* Label for Vacation Watch */}
                                        <Typography sx={{ fontSize: "0.7rem", color: "#6B7280" }}>
                                            For-Sale Watch
                                        </Typography>

                                        {/* Toggle Switch */}
                                        <Switch
                                            checked={isVacationWatch}
                                            onChange={handleToggle}
                                            color="primary"
                                        />

                                        {/* Label for For Sale */}
                                        <Typography sx={{ fontSize: "0.7rem", color: "#6B7280" }}>
                                            Vacation Watch
                                        </Typography>
                                    </Box>


                                </Box>




                            </Box>

                            <Grid container spacing={3}>

                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    {/* Start Date and Time */}
                                    <Grid
                                        container
                                        spacing={2}
                                        sx={{
                                            //marginTop: 2, // Adjust this value to move the grid down
                                            marginLeft: 1, // Adjust this value to move the grid to the right
                                            marginTop: "35px",
                                        }}
                                    >

                                        {/* Address Autocomplete */}
                                        <Grid item xs={12}>
                                            <motion.div {...(shakeField === "address" ? shakeAnimation : {})}>
                                                <Autocomplete
                                                    options={addressOptions}
                                                    value={
                                                        addressOptions.find((opt) => opt.fullAddress === formData.address) || null
                                                    }
                                                    onInputChange={(event, newInputValue) => {
                                                        if (formData.madID) {
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                address: "",
                                                                madID: "",
                                                                tempAddress: "",
                                                            }));
                                                        }
                                                        setTempAddress(newInputValue);
                                                        handleAddressInputChange(newInputValue);
                                                    }}
                                                    onChange={(event, selectedOption) => {
                                                        if (selectedOption) {
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                address: selectedOption.fullAddress,
                                                                madID: selectedOption.voI_ID,
                                                            }));
                                                            setTempAddress("");
                                                            setErrors((prevErrors) => ({
                                                                ...prevErrors,
                                                                address: "",
                                                            }));
                                                        } else {
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                address: "",
                                                                madID: "",
                                                            }));
                                                            setTempAddress("");
                                                        }
                                                    }}
                                                    onBlur={() => {
                                                        const isValidAddress = addressOptions.some(
                                                            (opt) => opt.fullAddress === tempAddress
                                                        );
                                                        if (!isValidAddress && !formData.madID) {
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                address: "",
                                                                madID: "",
                                                            }));
                                                            setTempAddress("");
                                                            setErrors((prevErrors) => ({
                                                                ...prevErrors,
                                                                address: "Select address from list.",
                                                            }));
                                                        }
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Address"
                                                            name="address"
                                                            error={!!errors.address}
                                                            helperText={
                                                                errors.address ||
                                                                (!formData.address && !tempAddress ? "Type to search" : "") // Conditional helper text
                                                            }
                                                            InputProps={{
                                                                ...params.InputProps,
                                                                readOnly: false,
                                                            }}
                                                            sx={{
                                                                "& .MuiOutlinedInput-root": {
                                                                    "& fieldset": { borderColor: "#ced4da" },
                                                                    "&:hover fieldset": { borderColor: "#1E3A8A" },
                                                                    "&.Mui-focused fieldset": { borderColor: "#1E3A8A" },
                                                                },
                                                            }}
                                                        />
                                                    )}

                                                    loading={isLoading}
                                                    getOptionLabel={(option) => option?.fullAddress || ""}
                                                    isOptionEqualToValue={(option, value) =>
                                                        option?.fullAddress === value?.fullAddress
                                                    }

                                                    noOptionsText={!tempAddress ? "Type to search" : "No matching addresses found"}



                                                />
                                            </motion.div>
                                        </Grid>

                                        {/* Start Date */}
                                        <Grid item xs={6}>
                                            <motion.div {...(shakeField === "startDate" ? shakeAnimation : {})}>
                                                <DatePicker
                                                    label="Start Date"
                                                    value={formData.startDate ? dayjs(formData.startDate) : null}
                                                    onChange={(newValue) => {
                                                        handleChange({
                                                            target: {
                                                                name: "startDate",
                                                                value: newValue ? newValue.format("YYYY-MM-DD") : "",
                                                            },
                                                        });
                                                        handleChange({
                                                            target: {
                                                                name: "endDate",
                                                                value: "", // Wipe end date when start date changes
                                                            },
                                                        });
                                                    }}
                                                    disablePast
                                                    slotProps={{
                                                        textField: {
                                                            fullWidth: true,
                                                            error: !!errors.startDate,
                                                            helperText: errors.startDate,
                                                            InputProps: {
                                                                readOnly: false,
                                                            },
                                                            inputRef: startDatePickerRef, // Attach ref for focus
                                                            onKeyDown: (e) => e.preventDefault(),
                                                            sx: {
                                                                "& .MuiOutlinedInput-root": {
                                                                    "& fieldset": { borderColor: "#ced4da" },
                                                                    "&:hover fieldset": { borderColor: "#1E3A8A" },
                                                                    "&.Mui-focused fieldset": { borderColor: "#1E3A8A" },
                                                                },
                                                            },
                                                        },
                                                    }}
                                                />
                                            </motion.div>
                                        </Grid>

                                        {/* End Date */}
                                        <Grid item xs={6}>
                                            <motion.div {...(shakeField === "endDate" ? shakeAnimation : {})}>
                                                <DatePicker
                                                    label="End Date"
                                                    value={formData.endDate ? dayjs(formData.endDate) : null}
                                                    onChange={(newValue) => {
                                                        handleChange({
                                                            target: {
                                                                name: "endDate",
                                                                value: newValue ? newValue.format("YYYY-MM-DD") : "",
                                                            },
                                                        });
                                                    }}
                                                    minDate={formData.startDate ? dayjs(formData.startDate).add(1, "day") : dayjs().add(1, "day")} // Add one day to the startDate
                                                    slotProps={{
                                                        textField: {
                                                            fullWidth: true,
                                                            error: !!errors.endDate,
                                                            helperText: errors.endDate,
                                                            InputProps: {
                                                                readOnly: false,
                                                            },
                                                            inputRef: endDatePickerRef, // Attach ref for focus
                                                            onKeyDown: (e) => e.preventDefault(),
                                                            sx: {
                                                                "& .MuiOutlinedInput-root": {
                                                                    "& fieldset": { borderColor: "#ced4da" },
                                                                    "&:hover fieldset": { borderColor: "#1E3A8A" },
                                                                    "&.Mui-focused fieldset": { borderColor: "#1E3A8A" },
                                                                },
                                                            },
                                                        },
                                                    }}
                                                />
                                            </motion.div>
                                        </Grid>

                                        {/* Start Time */}
                                        <Grid item xs={6}>
                                            <motion.div {...(shakeField === "startTime" ? shakeAnimation : {})}>
                                                <TimePicker
                                                    label="Start Time"
                                                    ampm
                                                    value={formData.startTime ? dayjs(formData.startTime, "h:mm A") : null}
                                                    onChange={(newValue) => {
                                                        handleChange({
                                                            target: {
                                                                name: "startTime",
                                                                value: newValue ? newValue.format("h:mm A") : "",
                                                            },
                                                        });
                                                    }}   

                                                    slotProps={{
                                                        textField: {
                                                            fullWidth: true,
                                                            error: !!errors.startTime,
                                                            helperText: errors.startTime,
                                                            InputProps: {
                                                                readOnly: false,
                                                            },
                                                            inputRef: startTimeInputRef, // Attach ref for focus                                                           
                                                        },
                                                    }}
                                                    
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            fullWidth                                                           
                                                            error={!!errors.startTime}
                                                            helperText={errors.startTime}
                                                            InputProps={{
                                                                ...params.InputProps,
                                                                readOnly: false,
                                                            }}
                                                            //inputRef={startTimeInputRef} // Attach ref to the input

                                                        />
                                                    )}
                                                    
                                                />
                                            </motion.div>
                                        </Grid>

                                        {/* End Time */}
                                        <Grid item xs={6}>
                                            <motion.div {...(shakeField === "endTime" ? shakeAnimation : {})}>
                                                <TimePicker
                                                    label="End Time"
                                                    ampm
                                                    value={formData.endTime ? dayjs(formData.endTime, "h:mm A") : null}
                                                    onChange={(newValue) => {
                                                        handleChange({
                                                            target: {
                                                                name: "endTime",
                                                                value: newValue ? newValue.format("h:mm A") : "",
                                                            },
                                                        });
                                                    }}

                                                    slotProps={{
                                                        textField: {
                                                            fullWidth: true,
                                                            error: !!errors.endTime,
                                                            helperText: errors.endTime,
                                                            InputProps: {
                                                                readOnly: false,
                                                            },
                                                            inputRef: endTimeInputRef, // Attach ref for focus                                                           
                                                        },
                                                    }}

                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            fullWidth
                                                            error={!!errors.endTime}
                                                            helperText={errors.endTime}
                                                            InputProps={{
                                                                ...params.InputProps,
                                                                readOnly: false,
                                                            }}
                                                            //inputRef={endTimeInputRef} 
                                                        />
                                                    )}
                                                />
                                            </motion.div>
                                        </Grid>
                                    </Grid>

                                </LocalizationProvider>


                                {/* Lights On Timer */}
                                <Grid item xs={6}>
                                    <motion.div {...(shakeField === "lightsOnTimer" ? shakeAnimation : {})}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={formData.lightsOnTimer === "Yes"}
                                                    onChange={(e) =>
                                                        handleChange({
                                                            target: {
                                                                name: "lightsOnTimer",
                                                                value: e.target.checked ? "Yes" : "No",
                                                            },
                                                        })
                                                    }
                                                    color="primary"
                                                />
                                            }
                                            label="Lights on Timer"
                                        />
                                        {!!errors.lightsOnTimer && (
                                            <Typography color="error" variant="caption">
                                                {errors.lightsOnTimer || "Select Yes or No"}
                                            </Typography>
                                        )}
                                    </motion.div>
                                </Grid>

                                {/* Cameras */}
                                <Grid item xs={6}>
                                    <motion.div {...(shakeField === "cameras" ? shakeAnimation : {})}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={formData.cameras === "Yes"}
                                                    onChange={(e) =>
                                                        handleChange({
                                                            target: {
                                                                name: "cameras",
                                                                value: e.target.checked ? "Yes" : "No",
                                                            },
                                                        })
                                                    }
                                                    color="primary"
                                                />
                                            }
                                            label="Security Cameras"
                                        />
                                        {!!errors.dogInHouse && (
                                            <Typography color="error" variant="caption">
                                                {errors.cameras || "Select Yes or No"}
                                            </Typography>
                                        )}
                                    </motion.div>
                                </Grid>


                            </Grid>


                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    marginTop: "20px",
                                    pb: 0, // Padding below the text
                                    borderBottom: "2px solid #1E3A8A", // Border color and thickness
                                    marginBottom:"20px"
                                }}
                            >
                                {/* Resident Details Title */}
                                <Typography
                                    //variant="h6"
                                    sx={{ mb: 2, fontSize: "1em", color: "#1E3A8A", fontWeight: "bold", letterSpacing: "0px", marginTop: "15px" }}
                                >
                                    RESIDENT INFO
                                </Typography>

                              
                            </Box>

                            <Grid container spacing={3}>
                                {/* Resident Name */}
                                <Grid item xs={12}>
                                    <motion.div {...(shakeField === "residentName" ? shakeAnimation : {})}>
                                        <TextField
                                            label="Name"
                                            name="residentName"
                                            value={formData.residentName}
                                            onChange={handleChange}
                                            fullWidth
                                            error={!!errors.residentName}
                                            helperText={errors.residentName}
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    "& fieldset": { borderColor: "#ced4da" },
                                                    "&:hover fieldset": { borderColor: "#1E3A8A" },
                                                    "&.Mui-focused fieldset": { borderColor: "#1E3A8A" },
                                                },
                                            }}
                                        />
                                    </motion.div>
                                </Grid>

                                {/* Email */}
                                <Grid item xs={12}>
                                    <motion.div {...(shakeField === "residentEmail" ? shakeAnimation : {})}>
                                        <TextField
                                            label="E-Mail"
                                            name="residentEmail"
                                            value={formData.residentEmail}
                                            onChange={(e) => {
                                                const { name, value } = e.target;

                                                // Update formData
                                                handleChange(e);

                                                // Validate email format
                                                const emailRegex =
                                                    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                                                if (!value) {
                                                    setErrors((prevErrors) => ({
                                                        ...prevErrors,
                                                        [name]: "Email address is required.",
                                                    }));
                                                } else if (!emailRegex.test(value)) {
                                                    setErrors((prevErrors) => ({
                                                        ...prevErrors,
                                                        [name]: "Invalid email format.",
                                                    }));
                                                } else {
                                                    setErrors((prevErrors) => ({
                                                        ...prevErrors,
                                                        [name]: "", // Clear the error if valid
                                                    }));
                                                }
                                            }}
                                            fullWidth
                                            error={!!errors.residentEmail}
                                            helperText={errors.residentEmail}
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    "& fieldset": { borderColor: "#ced4da" },
                                                    "&:hover fieldset": { borderColor: "#1E3A8A" },
                                                    "&.Mui-focused fieldset": { borderColor: "#1E3A8A" },
                                                },
                                            }}
                                        />
                                    </motion.div>
                                </Grid>




                               
                                {/* Resident Phone */}


                                <Grid item xs={12}>
                                    <motion.div {...(shakeField === "residentPhone" ? shakeAnimation : {})}>
                                        <InputMask
                                            mask="(999) 999-9999" // Phone mask for American numbers
                                            value={formData.residentPhone}
                                            onChange={handleChange}
                                        >
                                            {(inputProps) => (
                                                <TextField
                                                    {...inputProps}
                                                    label="Primary Phone"
                                                    name="residentPhone"
                                                    fullWidth
                                                    error={!!errors.residentPhone}
                                                    helperText={errors.residentPhone || "Format: (123) 456-7890"}
                                                    sx={{
                                                        "& .MuiOutlinedInput-root": {
                                                            "& fieldset": { borderColor: "#ced4da" },
                                                            "&:hover fieldset": { borderColor: "#1E3A8A" },
                                                            "&.Mui-focused fieldset": { borderColor: "#1E3A8A" },
                                                        },
                                                    }}
                                                />
                                            )}
                                        </InputMask>
                                    </motion.div>
                                </Grid>

                                <Grid item xs={12}>
                                    <motion.div {...(shakeField === "residentPhone2" ? shakeAnimation : {})}>
                                        <InputMask
                                            mask="(999) 999-9999" // Phone mask for American numbers
                                            value={formData.residentPhone2}
                                            onChange={handleChange}
                                        >
                                            {(inputProps) => (
                                                <TextField
                                                    {...inputProps}
                                                    label="Secondary Phone (optional)"
                                                    name="residentPhone2"
                                                    fullWidth
                                                    error={!!errors.residentPhone2}
                                                    helperText={errors.residentPhone2 || "Format: (123) 456-7890"}
                                                    sx={{
                                                        "& .MuiOutlinedInput-root": {
                                                            "& fieldset": { borderColor: "#ced4da" },
                                                            "&:hover fieldset": { borderColor: "#1E3A8A" },
                                                            "&.Mui-focused fieldset": { borderColor: "#1E3A8A" },
                                                        },
                                                    }}
                                                />
                                            )}
                                        </InputMask>
                                    </motion.div>
                                </Grid>

                              

                            </Grid>



                            {/*<Divider sx={{ mb: 3 }} />*/}

                            <Grid container spacing={3}>
                                {/* Keyholder Details Section */}
                                <Grid item xs={12} sx={{
                                    marginTop: "20px",
                                   

                                }}>
                                    <Typography sx={{
                                        mb: 2, fontSize: "1em", color: "#1E3A8A", fontWeight: "bold", pb: 1, // Padding below the text
                                        borderBottom: "2px solid #1E3A8A", // Border color and thickness
                                        marginBottom: "20px" }}>
                                        KEYHOLDER INFO (optional)
                                    </Typography>
                                    <motion.div
                                        {...(shakeField === "keyholderName" ? shakeAnimation : {})} // Apply shake if keyholderName has an error
                                    >
                                        <TextField
                                            label="Name"
                                            name="keyholderName"
                                            value={formData.keyholderName}
                                            onChange={handleChange}
                                            fullWidth
                                            error={!!errors.keyholderName}
                                            helperText={errors.keyholderName}
                                        />
                                    </motion.div>
                                </Grid>

                                <Grid item xs={12}>
                                    <motion.div {...(shakeField === "keyholderPhone" ? shakeAnimation : {})}>
                                        <InputMask
                                            mask="(999) 999-9999" // Phone mask for American numbers
                                            value={formData.keyholderPhone}
                                            onChange={handleChange}
                                        >
                                            {(inputProps) => (
                                                <TextField
                                                    {...inputProps}
                                                    label="Primary Phone"
                                                    name="keyholderPhone"
                                                    fullWidth
                                                    error={!!errors.keyholderPhone}
                                                    helperText={errors.keyholderPhone || "Format: (123) 456-7890"}
                                                    sx={{
                                                        "& .MuiOutlinedInput-root": {
                                                            "& fieldset": { borderColor: "#ced4da" },
                                                            "&:hover fieldset": { borderColor: "#1E3A8A" },
                                                            "&.Mui-focused fieldset": { borderColor: "#1E3A8A" },
                                                        },
                                                    }}
                                                />
                                            )}
                                        </InputMask>
                                    </motion.div>
                                </Grid>

                                <Grid item xs={12}>
                                    <motion.div {...(shakeField === "keyholderPhone2" ? shakeAnimation : {})}>
                                        <InputMask
                                            mask="(999) 999-9999" // Phone mask for American numbers
                                            value={formData.keyholderPhone2}
                                            onChange={handleChange}
                                        >
                                            {(inputProps) => (
                                                <TextField
                                                    {...inputProps}
                                                    label="Secondary Phone"
                                                    name="keyholderPhone2"
                                                    fullWidth
                                                    error={!!errors.keyholderPhone2}
                                                    helperText={errors.keyholderPhone2 || "Format: (123) 456-7890"}
                                                    sx={{
                                                        "& .MuiOutlinedInput-root": {
                                                            "& fieldset": { borderColor: "#ced4da" },
                                                            "&:hover fieldset": { borderColor: "#1E3A8A" },
                                                            "&.Mui-focused fieldset": { borderColor: "#1E3A8A" },
                                                        },
                                                    }}
                                                />
                                            )}
                                        </InputMask>
                                    </motion.div>
                                </Grid>

                                {/* Special Instructions Section */}
                                <Grid item xs={12}>
                                    <Typography sx={{
                                        mb: 2, fontSize: "1em", color: "#1E3A8A", fontWeight: "bold", pb: 1, // Padding below the text
                                        borderBottom: "2px solid #1E3A8A", // Border color and thickness
                                        marginBottom: "20px" }}>
                                        SPECIAL INSTRUCTIONS (optional)
                                    </Typography>
                                    <motion.div>
                                        <TextField
                                            label="Example: House/pet sitter, packages, contractors, etc. (optional)"
                                            name="reason"
                                            value={formData.reason}
                                            onChange={(e) => {
                                                if (e.target.value.length <= 500) {
                                                    handleChange(e); // Only allow updates if within the limit
                                                }
                                            }}
                                            multiline
                                            rows={4} // Makes it a textarea-like field
                                            fullWidth
                                            error={!!errors.reason}
                                            helperText={
                                                errors.reason
                                                    ? errors.reason
                                                    : `${formData.reason.length}/500 characters`
                                            }
                                        />
                                    </motion.div>
                                </Grid>
                            </Grid>

                            <Typography

                                sx={{
                                    mt: 4, fontSize: "1em", mb: 2, color: "#1E3A8A", fontWeight: "bold", letterSpacing: "0.5px", pb: 1, // Padding below the text
                                    borderBottom: "2px solid #1E3A8A", // Border color and thickness
                                    marginBottom: "20px" }}
                            >
                                VEHICLES ON DRIVEWAY (optional)
                            </Typography>
                            {/*<Divider sx={{ mb: 3 }} />*/}


                            <Grid container spacing={3}>
                                {formData.vehicles.map((vehicle, index) => (
                                    <Grid item xs={12} key={index}>
                                        <Paper
                                            elevation={3}
                                            sx={{
                                                p: 3,
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 2,
                                                borderRadius: 2,
                                                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Subtle shadow
                                                border: "1px solid #ced4da",
                                                backgroundColor: "#ffffff", // Clean white background
                                            }}
                                        >
                                            <DirectionsCar
                                                sx={{
                                                    color: "#1E3A8A", // Primary color
                                                    fontSize: 30, // Icon size
                                                }}
                                            />
                                            <TextField
                                                label={`Vehicle ${index + 1}`}
                                                value={vehicle.type}
                                                onChange={(e) => handleVehicleChange(index, e.target.value)}
                                                placeholder="Enter vehicle type (e.g., Sedan, SUV)"
                                                fullWidth
                                                InputLabelProps={{
                                                    sx: {
                                                        color: "#495057", // Subtle gray for labels
                                                    },
                                                }}
                                                inputProps={{
                                                    style: { padding: "12px" }, // Comfortable input padding
                                                }}
                                                sx={{
                                                    "& .MuiOutlinedInput-root": {
                                                        "& fieldset": { borderColor: "#ced4da" },
                                                        "&:hover fieldset": { borderColor: "#1E3A8A" },
                                                        "&.Mui-focused fieldset": { borderColor: "#1E3A8A" },
                                                    },
                                                }}
                                            />
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                onClick={() => removeVehicleField(index)}
                                                disabled={formData.vehicles.length === 1}
                                                sx={{
                                                    minWidth: "100px",
                                                    textTransform: "none",
                                                    fontWeight: "bold",
                                                    borderRadius: 1.5,
                                                    "&:hover": {
                                                        backgroundColor: "rgba(255, 0, 0, 0.1)", // Subtle hover effect
                                                    },
                                                }}
                                            >
                                                Remove
                                            </Button>
                                        </Paper>
                                    </Grid>
                                ))}

                                {/* Add Another Vehicle Button */}
                                <Grid item xs={12}>
                                    <Button
                                        startIcon={<AddCircleOutline />}
                                        onClick={addVehicleField}
                                        variant="outlined" // Changed to outlined style
                                        disabled={
                                            formData.vehicles.length === 0 ||
                                            !formData.vehicles[formData.vehicles.length - 1].type.trim()
                                        } // Disable button unless the last vehicle field is filled
                                        sx={{
                                            mt: 2,
                                            py: 1.2,
                                            px: 3,
                                            marginBottom:"20px",
                                            textTransform: "none",
                                            fontSize: "1rem",
                                            fontWeight: "bold",
                                            color: "#1E3A8A", // Blue text color
                                            borderColor: "#1E3A8A", // Blue outline
                                            borderWidth: 2,
                                            borderRadius: 2,
                                            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.05)", // Subtle shadow
                                            backgroundColor: "#ffffff", // White background
                                            "&:hover": {
                                                backgroundColor: "#f8f9fa", // Slight gray hover effect
                                                borderColor: "#162A6E", // Darker blue outline on hover
                                                color: "#162A6E", // Darker blue text on hover
                                            },
                                            "&.Mui-disabled": {
                                                backgroundColor: "#ffffff", // Keep white when disabled
                                                borderColor: "#ced4da", // Neutral border for disabled
                                                color: "#9e9e9e", // Light gray text for disabled
                                            },
                                        }}
                                    >
                                        Add New
                                    </Button>
                                </Grid>

                            </Grid>

                            <Divider sx={{ mb: 3 }} />

                            <Grid item xs={12} sx={{ mt: 4, marginBottom:"20px" }}>
                                <Typography
                                    fontWeight="400"
                                    fontSize="0.9rem"
                                    sx={{                                        
                                        color: "#374151", // Deep gray for readability
                                        textAlign: "justify",
                                        marginBottom:"20px"
                                    }}
                                >
                                    By submitting this online form, you acknowledge and authorize the Inverness Police Department to access the listed premises at any time for the purpose of conducting property well-being checks. This includes inspecting the exterior of the property and, if necessary, entering the interior of the home in situations such as open doors, windows, or other signs of unauthorized entry or suspicious activity. This authorization is granted to ensure the safety and security of the property during your absence.
                                    <br></br><br></br>
                                    Additionally, you understand and agree that this service is a courtesy provided by the Village of Inverness and does not guarantee the prevention of theft, damage, or unauthorized entry. You further release the Village of Inverness, its police officers, employees, and agents from any liability for failure to detect or prevent incidents, as well as for any damages that may occur during these checks, whether to the property, vehicles, or other belongings.
                                    <br></br><br></br>
                                    By submitting this form, you confirm your understanding of and agreement to these terms, acknowledging that this service is provided at your request and is subject to the availability and discretion of the Inverness Police Department.
                                </Typography>

                                {/* Acknowledgment Checkbox */}
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={formData.acknowledged || false} // Default unchecked
                                            onChange={(e) =>
                                                setFormData((prevFormData) => ({
                                                    ...prevFormData,
                                                    acknowledged: e.target.checked,
                                                }))
                                            }
                                            color="primary"
                                        />
                                    }
                                    label="I have read and agree to the above statement."
                                    sx={{
                                        "& .MuiTypography-root": {
                                            fontSize: "1.2rem",
                                            color: "#374151"                                           
                                        },
                                    }}
                                />

                                <Typography
                                    fontWeight="400"
                                    fontSize="1.2rem"
                                    sx={{
                                        color: "#808080", // Deep gray for readability
                                        textAlign: "center",
                                        marginBottom: "20px"
                                    }}
                                >
                                    See Something, Say Something. Call 911
                                </Typography>

                                {/* Display Error if Not Acknowledged */}
                                {errors.acknowledged && (
                                    <Typography
                                        color="error"
                                        variant="caption"
                                        sx={{ mt: 1, display: "block" }}
                                    >
                                        You must agree to the terms before submitting.
                                    </Typography>
                                )}
                            </Grid>
                            {/* Submit Button */}
                            <Grid item xs={12} sx={{ mt: 2 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    sx={{
                                        py: 1.5,
                                        fontSize: "1.1rem",
                                        fontWeight: "bold",
                                        textTransform: "none",
                                        bgcolor: "#1E3A8A",
                                        color: "#fff",
                                        borderRadius: 2,
                                        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                                        "&:hover": {
                                            bgcolor: "#162A6E",
                                        },
                                    }}
                                    disabled={!formData.acknowledged} // Disable if acknowledgment is not checked
                                >
                                    Submit Request
                                </Button>
                            </Grid>

                        </form>

                    </Paper>
                </Container>
            </ThemeProvider>
        </motion.div>
    );
};


VacationWatchForm.propTypes = {
    onFormSubmit: PropTypes.func.isRequired,
};

export default VacationWatchForm;
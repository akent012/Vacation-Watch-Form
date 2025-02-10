import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import VacationWatchForm from "./VacationWatchForm";
import ConfirmationScreen from "./ConfirmationScreen";

const App = () => {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [formData, setFormData] = useState({}); // State to store form data

    // Handle form submission
    const handleFormSubmit = (data) => {
        console.log("Data received from form submission:", data); // Log data from form
        if (data && typeof data === "object") {
            setFormData(data); // Update state with form data
            setShowConfirmation(true); // Navigate to confirmation screen
        } else {
            console.error("Invalid data received from form:", data); // Log invalid data
        }
    };

    // Handle back to form action
    const handleBackToForm = () => {
        console.log("Returning to form. Clearing data.");
        setShowConfirmation(false);
        setFormData({}); // Optionally clear form data
    };

    // Log formData updates
    useEffect(() => {
        console.log("formData updated:", formData); // Log whenever formData changes
    }, [formData]);

    // Debug rendering
    console.log("Rendering App. Current formData:", formData);

    return (
        <>
            {showConfirmation ? (
                <ConfirmationScreen
                    onBack={handleBackToForm}
                    formData={formData}
                />
            ) : (
                <VacationWatchForm onFormSubmit={handleFormSubmit} />
            )}
        </>
    );
};

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);

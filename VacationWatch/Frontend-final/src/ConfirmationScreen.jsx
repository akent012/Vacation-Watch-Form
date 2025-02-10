import { useEffect } from "react";
import {
    Box,
    Typography,
    Button,
    Container,
    Paper,
    Divider,
    Grid,
    Card,
    CardContent,
    CardHeader,
} from "@mui/material";
import { CheckCircleOutline, TipsAndUpdatesOutlined } from "@mui/icons-material";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

const ConfirmationScreen = ({ onBack, formData }) => {


    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "auto" });
    }, []);

    return (
        <Container
            maxWidth="md"
            sx={{
                backgroundColor: "#f8f9fa",
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                py: 5,
                px: { xs: 2, sm: 5, md: 8 },
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
            >
                <Paper
                    elevation={6}
                    sx={{
                        p: { xs: 4, sm: 6, md: 8 },
                        borderRadius: 4,
                        boxShadow: "0px 6px 25px rgba(0, 0, 0, 0.1)",
                        textAlign: "center",
                        backgroundColor: "white",
                        color: "#1E3A8A",
                    }}
                >

                    <Typography
                        variant="h3"
                        fontWeight="bold"
                        gutterBottom
                        sx={{
                            fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.5rem" },
                            color: "#1E3A8A",
                        }}
                    >
                        Request Submitted Successfully!
                    </Typography>

                    {/* Success Icon and Title */}
                    <CheckCircleOutline
                        sx={{
                            fontSize: { xs: "4rem", sm: "5rem", md: "6rem" },
                            mb: 0,
                            color: "#1E3A8A",
                        }}
                    />
                    <Divider sx={{ my: 3 }} />

                    <Card
                        sx={{
                            mt: 4,
                            p: 3,
                            backgroundColor: "#f8f9fa",
                            borderRadius: 2,
                            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        <CardHeader
                            title="Submitted Information"
                            titleTypographyProps={{
                                variant: "h6",
                                fontWeight: "bold",
                                color: "#1E3A8A",
                                textAlign: "center",
                            }}
                        />
                        <Divider sx={{ mb: 3 }} />
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body1" fontWeight="bold">
                                    Resident Name:
                                </Typography>
                                <Typography variant="body2" sx={{ color: "#495057" }}>
                                    {formData.residentName}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body1" fontWeight="bold">
                                    Phone Number:
                                </Typography>
                                <Typography variant="body2" sx={{ color: "#495057" }}>
                                    {formData.residentPhone}
                                </Typography>

                                {/* Subsection for Phone Number 2 */}
                                <Typography variant="body1" fontWeight="bold" sx={{ marginTop: "8px" }}>
                                    Phone Number 2:
                                </Typography>
                                <Typography variant="body2" sx={{ color: "#495057" }}>
                                    {formData.residentPhone2 || "N/A"}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="body1" fontWeight="bold">
                                    Email Address:
                                </Typography>
                                <Typography variant="body2" sx={{ color: "#495057" }}>
                                    {formData.residentEmail}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="body1" fontWeight="bold">
                                    Address:
                                </Typography>
                                <Typography variant="body2" sx={{ color: "#495057" }}>
                                    {formData.address}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body1" fontWeight="bold">
                                    Start Date:
                                </Typography>
                                <Typography variant="body2" sx={{ color: "#495057" }}>
                                    {formData.startDate}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body1" fontWeight="bold">
                                    End Date:
                                </Typography>
                                <Typography variant="body2" sx={{ color: "#495057" }}>
                                    {formData.endDate}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body1" fontWeight="bold">
                                    Lights On Timer:
                                </Typography>
                                <Typography variant="body2" sx={{ color: "#495057" }}>
                                    {formData.lightsOnTimer}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body1" fontWeight="bold">
                                    Cameras On Residence:
                                </Typography>
                                <Typography variant="body2" sx={{ color: "#495057" }}>
                                    {formData.cameras}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="body1" fontWeight="bold">
                                    Type of Leave:
                                </Typography>
                                <Typography variant="body2" sx={{ color: "#495057" }}>
                                    {formData.formType === "vacationWatch" ? "Vacation Watch" : "For Sale"}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="body1" fontWeight="bold">
                                    Vehicles:
                                </Typography>
                                <Typography variant="body2" sx={{ color: "#495057" }}>
                                    {formData.vehicles.map((v, i) => (
                                        <span key={i}>{v.type}{i < formData.vehicles.length - 1 ? ", " : ""}</span>
                                    ))}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Card>



                    {/* Vacation Tips Section */}
                    <Card
                        sx={{
                            mt: 4,
                            backgroundColor: "#f8f9fa",
                            borderRadius: 2,
                            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        <CardHeader
                            title="Vacation Tips"
                            titleTypographyProps={{
                                variant: "h6",
                                fontWeight: "bold",
                                color: "#1E3A8A",
                                textAlign: "center",
                            }}
                            avatar={
                                <TipsAndUpdatesOutlined
                                    sx={{
                                        fontSize: "2rem",
                                        color: "#1E3A8A",
                                    }}
                                />
                            }
                        />
                        <CardContent>
                            <Box sx={{ textAlign: "left", fontSize: "1rem", lineHeight: 1.6 }}>
                                <ul style={{ paddingLeft: "1.5rem" }}>
                                    <li>Refrain from posting about your vacation plans on social media to avoid alerting potential burglars.</li>
                                    <li>Stop mail and newspaper delivery. Any packages found will be picked up and taken to the Police Department.</li>
                                    <li>Use timers for indoor and outdoor lights to create the illusion that someone is home.</li>
                                    <li>Double-check that all windows and doors are securely locked before you leave.</li>
                                    <li>Share your travel itinerary with a trusted friend or family member so they can assist in case of an emergency.</li>
                                </ul>
                            </Box>
                        </CardContent>

                    </Card>

                    {/* Logos Section */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            mt: 4,
                            gap: 3,
                        }}
                    >
                        <img
                            src="/inv_logo.png"
                            alt="Inverness Logo"
                            style={{ height: "60px", filter: "opacity(0.8)" }}
                        />
                        <img
                            src="/pd_badge.png"
                            alt="Police Badge"
                            style={{ height: "60px", filter: "opacity(0.8)" }}
                        />
                    </Box>

                    {/* Action Button */}
                    <Box sx={{ mt: 6 }}>
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={onBack}
                            sx={{
                                textTransform: "none",
                                py: { xs: 1, sm: 1.5 },
                                px: { xs: 3, sm: 4 },
                                fontSize: { xs: "1rem", sm: "1.2rem" },
                                fontWeight: "bold",
                                borderColor: "#1E3A8A",
                                color: "#1E3A8A",
                                "&:hover": {
                                    backgroundColor: "#f8f9fa",
                                    borderColor: "#162A6E",
                                    color: "#162A6E",
                                },
                            }}
                        >
                            Submit Another Request
                        </Button>
                    </Box>
                </Paper>
            </motion.div>
        </Container>
    );
};

ConfirmationScreen.propTypes = {
    onBack: PropTypes.func.isRequired,
    formData: PropTypes.shape({
        residentName: PropTypes.string.isRequired,
        residentPhone: PropTypes.string.isRequired,
        residentPhone2: PropTypes.string.isRequired,
        residentEmail: PropTypes.string.isRequired,
        formType: PropTypes.string.isRequired,
        address: PropTypes.string.isRequired,
        startDate: PropTypes.string.isRequired,
        endDate: PropTypes.string.isRequired,
        lightsOnTimer: PropTypes.string.isRequired,
        cameras: PropTypes.string.isRequired,
        vehicles: PropTypes.arrayOf(
            PropTypes.shape({
                type: PropTypes.string.isRequired,
            })
        ).isRequired,
    }).isRequired,
};

export default ConfirmationScreen;

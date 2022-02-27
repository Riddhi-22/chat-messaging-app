import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { authentication } from "../firebase/fbs";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { Formik } from "formik";
import * as Yup from "yup";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        yeahtalk
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

export default function SignInSide() {
  const [otpSent, setOtpSent] = React.useState(false);

  const validationSchema = Yup.object().shape({
    phoneNumber: Yup.string()
      .required("Phone Number is required")
      .matches(/^[0-9]+$/, "Phone Number must only have digits")
      .min(10, "Phone number must have 10 digits")
      .max(10, "Phone number must have 10 digits"),
  });

  const otpValidationSchema = Yup.object().shape({
    otp: Yup.string()
      .required("OTP is required")
      .matches(/^[0-9]+$/, "OTP must only have digits")
      .min(6, "OTP must have 6 digits")
      .max(6, "OTP must have 6 digits"),
  });

  const configureCaptcha = (values) => {
    const { phoneNumber } = values;
    window.recaptchaVerifier = new RecaptchaVerifier(
      "sign-in-button",
      {
        size: "invisible",
        callback: (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          onFormSubmit();
        },
      },
      authentication
    );
    let appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(authentication, `+91${phoneNumber}`, appVerifier)
      .then((confirmationResult) => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        window.confirmationResult = confirmationResult;
        setOtpSent(true);
      })
      .catch((error) => {
        // Error; SMS not sent
        console.log(error);
      });
  };

  const onFormSubmit = (values, actions) => {
    configureCaptcha(values);
    actions.setSubmitting(false);
  };

  const onSubmitOTP = (values, actions) => {
    window.confirmationResult
      .confirm(values.otp)
      .then((result) => {
        // User signed in successfully.
        const user = result.user;
        alert("User is verified");
      })
      .catch((error) => {
        // User couldn't sign in (bad verification code?)
      });
      actions.setSubmitting(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: "url(https://source.unsplash.com/random)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              yeahtalk
            </Typography>

            <Formik
              initialValues={{
                phoneNumber: "",
              }}
              validationSchema={validationSchema}
              onSubmit={onFormSubmit}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
              }) => (
                <form>
                  <Box noValidate sx={{ mt: 1 }}>
                    <div id="sign-in-button"></div>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      variant="outlined"
                      autoComplete="true"
                      name="phoneNumber"
                      label="Phone Number"
                      type="number"
                      id="phoneNumber"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.phoneNumber}
                      error={errors.phoneNumber && touched.phoneNumber}
                      helperText={touched.phoneNumber && errors.phoneNumber}
                    />
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      onClick={handleSubmit}
                      sx={{ mt: 3, mb: 2 }}
                      disabled={isSubmitting}
                    >
                      Send OTP
                    </Button>
                  </Box>
                </form>
              )}
            </Formik>

            <Formik
              initialValues={{
                otp: "",
              }}
              validationSchema={otpValidationSchema}
              onSubmit={onSubmitOTP}
            >
              {({
                values,
                errors,
                handleChange,
                handleBlur,
                handleSubmit,
                touched,
                isSubmitting,
              }) => (
                <form>
                  {otpSent ? (
                    <form>
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="otp"
                        label="Enter OTP"
                        variant="outlined"
                        value={values.otp}
                        type="number"
                        id="otp"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.otp && touched.otp}
                        helperText={touched.otp && errors.otp}
                      />
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        onClick={handleSubmit}
                        sx={{ mt: 3, mb: 2 }}
                        disabled={isSubmitting}
                      >
                        Verify OTP
                      </Button>
                    </form>
                  ) : null}
                </form>
              )}
            </Formik>
            <Copyright sx={{ mt: 5 }} />
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

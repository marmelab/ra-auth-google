import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Typography,
} from "@mui/material";
import * as React from "react";
import { useLogin, useNotify, useSafeSetState } from "react-admin";

/**
 * Csutom Login Page used to trigger the redirection to the MS login page.
 */
export const CustomLoginPage = () => {
  const login = useLogin();
  const [loading, setLoading] = useSafeSetState(false);
  const notify = useNotify();

  const submit = () => {
    setLoading(true);
    login({})
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        const errorMsg =
          typeof error === "string"
            ? error
            : error && error.message
            ? error.message
            : undefined;
        notify(errorMsg, {
          type: "error",
          messageArgs: {
            _: errorMsg,
          },
        });
      });
  };

  return (
    <Box
      component="form"
      onSubmit={submit}
      display="flex"
      justifyContent="center"
    >
      <Card sx={{ width: 300, m: 8 }}>
        <CardContent>
          <Typography variant="h5" component="div" textAlign="center">
            Custom login page
          </Typography>
          <CardActions>
            <Button
              variant="contained"
              type="submit"
              color="primary"
              disabled={loading}
              fullWidth
              sx={{ mt: 2 }}
            >
              {loading ? (
                <CircularProgress size={19} thickness={3} sx={{ m: 0.3 }} />
              ) : (
                "Sign in with Microsoft"
              )}
            </Button>
          </CardActions>
        </CardContent>
      </Card>
    </Box>
  );
};

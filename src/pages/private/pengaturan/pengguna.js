import React, { useRef, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { useFirebase } from '../../../components/FirebaseProvider';
import { useSnackbar } from 'notistack';
import isEmail from 'validator/lib/isEmail';
import useStyles from './styles/pengguna';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

function Pengguna() {
    const classes = useStyles();
    const [isSubmitting, setSubmitting] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const [error, setError] = useState({
        displayName: '',
        email: '',
        password: ''
    });
    const { user } = useFirebase();
    const displayNameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();


    const saveDisplayName = async e => {
        const displayName = displayNameRef.current.value;
        console.log(displayName);
        if (!displayName) {
            setError({
                displayName: 'Please input your name'
            })
        } else if (displayName !== user.displayName) {
            setError({
                displayName: ''
            })
            setSubmitting(true);
            await user.updateProfile({
                displayName
            })
            setSubmitting(false);
            enqueueSnackbar('Data is updated success', { variant: 'success' })
        }
    }
    const updateEmail = async (e) => {
        const email = emailRef.current.value;

        if (!email) {
            setError({
                eEmail: 'Please input your email address'
            })
        } else if (!isEmail(email)) {
            setError({
                email: 'Email no valid'
            })
        } else if (email !== user.email) {
            setError({
                email: ''
            })
            setSubmitting(true);
            try {
                await user.updateEmail(email)
                enqueueSnackbar('Data is updated success', { variant: 'success' })
            } catch (e) {
                let emailError = '';
                switch (e.code) {
                    case 'auth/email-already-in-use':
                        emailError = "Email Already use"
                        break;
                    case 'auth/invalid-emal':
                        emailError = "Email no valid"
                        break;
                    case 'auth/requires-recent-login':
                        emailError = "Please logout, then log in again";
                        break;
                    default:
                        emailError = "An error occurred, please try again"
                        break;
                }
                setError({
                    email: emailError
                })
            }
        }
        setSubmitting(false);
    }
    const sendEmailVerification = async (e) => {
        const actionCodeSettings = {
            url: `${window.location.origin}/login`
        };
        setSubmitting(true);
        await user.sendEmailVerification(actionCodeSettings);
        enqueueSnackbar(`A verification email has been sent to ${emailRef.current.value}`, { variant: 'success' })
        setSubmitting(false);
    }

    const updatePassword = async (e) => {
        const password = passwordRef.current.value;

        if (!password) {
            setError({
                password: 'Please input your password'
            })
        } else if (password !== user.password) {
            setError({
                password: ''
            })
            setSubmitting(true);
            try {
                await user.updatePassword(password);
                enqueueSnackbar(`Password has been updated`, { variant: 'success' });
            } catch (e) {
                let passwordError = '';
                switch (e.code) {
                    case 'auth/weak-password':
                        passwordError = 'password is too weak'
                        break;
                    case 'auth/requires-recent-login':
                        passwordError = 'Please logout, then log in again';
                        break;
                    default:
                        passwordError = "An error occurred, please try again"
                        break;
                }
                setError({
                    password: passwordError
                })
            }
        }
        setSubmitting(false);
    }
    return <div className={classes.PengaturanPengguna}>
        <TextField
            id="displayName"
            name="displayName"
            label="Name"
            margin="normal"
            defaultValue={user.displayName}
            inputProps={{
                ref: displayNameRef,
                onBlur: saveDisplayName
            }}
            disabled={isSubmitting}
            helperText={error.displayName}
            error={error.displayName ? true : false}
        />
        <TextField
            id="email"
            name="email"
            type="email"
            label="Email Address"
            margin="normal"
            defaultValue={user.email}
            inputProps={{
                ref: emailRef,
                onBlur: updateEmail
            }}
            disabled={isSubmitting}
            helperText={error.email}
            error={error.email ? true : false}
        />
        {
            user.emailVerified ?
                <Typography color="primary" variant="subtitle1">Email has been Verification</Typography>
                : <Button onClick={sendEmailVerification} disabled={isSubmitting} variant="outlined" color="primary" size="large">Send Email Verification</Button>
        }
        <TextField
            id="password"
            name="password"
            type="password"
            label="New Password"
            margin="normal"
            inputProps={{
                ref: passwordRef,
                onBlur: updatePassword
            }}
            autoComplete="new-password"
            disabled={isSubmitting}
            helperText={error.password}
            error={error.password ? true : false}

        />
    </div>
}

export default Pengguna;
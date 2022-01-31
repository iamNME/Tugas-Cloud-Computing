import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import isURL from 'validator/lib/isURL';
import useStyles from './styles/toko';
import { useFirebase } from '../../../components/FirebaseProvider';
import { useSnackbar } from 'notistack';
import { useDocument } from 'react-firebase-hooks/firestore';
import AppPageLoading from '../../../components/AppPageLoading';
import { Prompt } from 'react-router-dom';

function Toko() {
    const classes = useStyles();
    const { firestore, user } = useFirebase();
    const storeDoc = firestore.doc(`toko/${user.uid}`);
    const [snapshot, loading] = useDocument(storeDoc);
    const { enqueueSnackbar } = useSnackbar();
    const [isSomethingChange, setSomethingChange] = useState(false);

    const [form, setFrom] = useState({
        nama: '',
        alamat: '',
        telepon: '',
        website: ''
    });
    const [error, setError] = useState({
        nama: '',
        alamat: '',
        telepon: '',
        website: ''
    });
    const [isSubmitting, setSubmitting] = useState(false);


    const handleChange = e => {
        setFrom({
            ...form, [e.target.name]: e.target.value
        });
        setError({
            ...error, [e.target.name]: ''
        });
        setSomethingChange(true);
    }
    useEffect(() => {
        if (snapshot && snapshot.exists) {
            setFrom(snapshot.data());
        }
    }, [snapshot]);


    const validate = () => {
        const newError = { ...error };

        if (!form.nama) {
            newError.nama = "Please input your name store";
        }
        if (!form.alamat) {
            newError.alamat = "Please input your address store"
        }
        if (!form.telepon) {
            newError.telepon = "Please input your Telepon store";
        }
        if (!form.website) {
            newError.website = "Please input your website store";
        } else if (!isURL(form.website)) {
            newError.website = "Url no valid";
        }
        return newError;
    }
    const handleSubmit = async e => {
        e.preventDefault();
        const findError = validate();

        if (Object.values(findError).some(err => err !== '')) {
            setError(findError);
        } else {
            setSubmitting(true);
            try {
                await storeDoc.set(form, { merge: true });
                setSomethingChange(false);
                enqueueSnackbar(`Data saved successfuly`, { variant: 'success' });

            } catch (e) {
                enqueueSnackbar(e.message, { variant: 'error' });
            }
            setSubmitting(false);
        }
    }

    if (loading) {
        return <AppPageLoading />
    }

    return <div className={classes.pengaturanToko}>
        <form onSubmit={handleSubmit} noValidate>
            <TextField
                id="nama"
                name="nama"
                label="Name Store"
                margin="normal"
                required
                fullWidth
                disabled={isSubmitting}
                value={form.nama}
                onChange={handleChange}
                helperText={error.nama}
                error={error.nama ? true : false}
            />
            <TextField
                id="alamat"
                name="alamat"
                label="Address Store"
                margin="normal"
                required
                fullWidth
                multiline
                rowsMax={3}
                disabled={isSubmitting}
                value={form.alamat}
                onChange={handleChange}
                helperText={error.alamat}
                error={error.alamat ? true : false}
            />
            <TextField
                id="telepon"
                name="telepon"
                label="No. Telepon"
                margin="normal"
                required
                fullWidth
                disabled={isSubmitting}
                value={form.telepon}
                onChange={handleChange}
                helperText={error.telepon}
                error={error.telepon ? true : false}
            />
            <TextField
                id="website"
                name="website"
                label="Website"
                margin="normal"
                required
                fullWidth
                disabled={isSubmitting}
                value={form.website}
                onChange={handleChange}
                helperText={error.website}
                error={error.website ? true : false}
            />
            <Button className={classes.buttons} type="submit" disabled={isSubmitting || !isSomethingChange} size="large" color="primary" variant="contained">Save</Button>
        </form>
        <Prompt
            when={isSomethingChange}
            message="Are you sure you want to leave this page?" />
    </div>
}

export default Toko;
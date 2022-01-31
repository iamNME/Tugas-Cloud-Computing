import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import UploadIcon from '@material-ui/icons/CloudUpload';
import SaveIcon from '@material-ui/icons/Save';
import { useFirebase } from '../../../components/FirebaseProvider';
import { useDocument } from 'react-firebase-hooks/firestore';
import AppPageLoading from '../../../components/AppPageLoading';
import { useSnackbar } from 'notistack';
import useStyles from './style/edit';
import { Prompt } from 'react-router-dom';

function EditProduct({ match }) {
    const classes = useStyles();
    const { firestore, storage, user } = useFirebase();
    const productDoc = firestore.doc(`toko/${user.uid}/produk/${match.params.produkId}`);
    const productStorageRef = storage.ref(`toko/${user.uid}/produk`);
    const [snapshot, loading] = useDocument(productDoc);
    const [isSubmitting, setSubmitting] = useState(false);
    const [isSomethingChange, setSomethingChange] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const [form, setForm] = useState({
        nama: '',
        sku: '',
        harga: '',
        stock: '',
        description: ''
    });
    const [error, setError] = useState({
        nama: '',
        sku: '',
        harga: '',
        stock: '',
        description: ''
    });
    useEffect(() => {
        if (snapshot) {
            setForm(currentForm => ({
                ...currentForm,
                ...snapshot.data()
            }));
        }
    }, [snapshot]);
    const handleChange = (e) => {
        setForm({
            ...form, [e.target.name]: e.target.value
        });
        setError({
            ...error, [e.target.name]: ''
        });
        setSomethingChange(true);
    }
    const validate = () => {
        const newError = { ...error };

        if (!form.nama) {
            newError.nama = 'Please input your Name Product';
        }
        if (!form.sku) {
            newError.sku = 'Please input your SKU Product';
        }
        if (!form.harga) {
            newError.harga = 'Please input your Price Product';
        }
        if (!form.stock) {
            newError.stock = 'Please input your Stock Product';
        }


        return newError;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const findError = validate();
        if (Object.values(findError).some(err => err !== '')) {
            setError(findError);
        } else {
            setSubmitting(true);
            try {
                await productDoc.set(form, { merge: true });
                enqueueSnackbar("Data successfully saved", { variant: 'success' });
                setSomethingChange(false);
            } catch (e) {
                enqueueSnackbar(e.message, { variant: 'error' });
            }
            setSubmitting(false);
        }
    }

    if (loading) {
        return <AppPageLoading />
    }

    const handleUploadPhoto = async (e) => {
        const file = e.target.files[0];
        if (!['image/png', 'image/jpeg'].includes(file.type)) {
            setError(error => ({
                ...error,
                photo: `Type file not supported: ${file.type}`
            }));
        } else if (file.size >= 512000) {
            setError(error => ({
                ...error,
                photo: `File size is too large > 500Kb`
            }));
        } else {
            const reader = new FileReader();

            reader.onabort = () => {
                setError(error => ({
                    ...error,
                    photo: `File reading process is cancelled`
                }));
            }
            reader.onerror = () => {
                setError(error => ({
                    ...error,
                    photo: `File cannot be read`
                }));
            }
            reader.onload = async () => {
                setError(error => ({
                    ...error,
                    photo: ``
                }));
                setSubmitting(true);
                try {
                    //Extact file photo yang dipilih
                    const photoExt = file.name.substring(file.name.lastIndexOf('.'));

                    const photoRef = productStorageRef.child(`${match.params.produkId}${photoExt}`);

                    const photoSnapshot = await photoRef.putString(reader.result, 'data_url');

                    const photoUrl = await photoSnapshot.ref.getDownloadURL();

                    setForm(currentForm => ({
                        ...currentForm,
                        photo: photoUrl
                    }));
                    setSomethingChange(true);
                } catch (e) {
                    setError(error => ({
                        ...error,
                        photo: e.message
                    }));
                }
                setSubmitting(false);
            }
            reader.readAsDataURL(file);
        }
    }
    return <>
        <Grid container>
            <Grid item xs={12} sm={6}>
                <form id="product-form" onSubmit={handleSubmit} noValidate>
                    <TextField
                        id="nama"
                        name="name"
                        label="Name Product"
                        margin="normal"
                        fullWidth
                        required
                        value={form.nama}
                        onChange={handleChange}
                        helperText={error.nama}
                        error={error.nama ? true : false}
                        disabled={isSubmitting}
                    />
                    <TextField
                        id="sku"
                        name="sku"
                        label="SKU Product"
                        margin="normal"
                        fullWidth
                        required
                        value={form.sku}
                        onChange={handleChange}
                        helperText={error.sku}
                        error={error.sku ? true : false}
                        disabled={isSubmitting}
                    />
                    <TextField
                        id="harga"
                        name="harga"
                        type="number"
                        label="Price Product"
                        fullWidth
                        required
                        value={form.harga}
                        onChange={handleChange}
                        helperText={error.harga}
                        error={error.harga ? true : false}
                        disabled={isSubmitting}
                    />
                    <TextField
                        id="stock"
                        name="stock"
                        type="number"
                        label="Stock Product"
                        margin="normal"
                        fullWidth
                        required
                        value={form.stock}
                        onChange={handleChange}
                        helperText={error.stock}
                        error={error.stock ? true : false}
                        disabled={isSubmitting}
                    />
                    <TextField
                        id="description"
                        name="description"
                        label="Description"
                        margin="normal"
                        multiline
                        rowsMax={3}
                        fullWidth
                        value={form.description}
                        onChange={handleChange}
                        helperText={error.description}
                        error={error.description ? true : false}
                        disabled={isSubmitting}
                    />
                </form>
            </Grid>
            <Grid item xs={12} sm={6}>
                <div className={classes.uploadPhotoProduct}>
                    {form.photo &&
                        <img src={form.photo} alt={`Foto Product ${form.nama}`} className={classes.previewPhoto} />}
                    <input
                        className={classes.hideInputImage}
                        id="upload-photo"
                        type="file"
                        accept="image/jpeg, image/png"
                        onChange={handleUploadPhoto}
                    />
                    <label htmlFor="upload-photo">
                        <Button variant="outlined" component="span" disabled={isSubmitting}>Upload Photo <UploadIcon className={classes.iconRight} /></Button>
                    </label>
                    {error.photo && <Typography color="error">{error.photo}</Typography>}
                </div>
            </Grid>
            <Grid item xs={12}>
                <div className={classes.actionButton}>
                    <Button form="product-form" type="submit" color="primary" variant="contained" size="large" disabled={isSubmitting || !isSomethingChange}><SaveIcon className={classes.iconLeft} /> Save</Button>
                </div>
            </Grid>
        </Grid>
        <Prompt
            when={isSomethingChange}
            message="Any unsaved changes, are you sure you want to leave this page?"
        />
    </>
}

export default EditProduct;
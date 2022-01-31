import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useFirebase } from '../../../components/FirebaseProvider';
import { withRouter } from 'react-router-dom';
function AddDialog({ history, open, handleClose }) {
    const { firestore, user } = useFirebase();
    const productCol = firestore.collection(`toko/${user.uid}/produk`);
    const [isSubmitting, setSubmitting] = useState(false);

    const [nama, setNama] = useState('');
    const [error, setError] = useState('');
    const handleSubmit = async e => {
        setSubmitting(true);
        try {
            if (!nama) {
                throw new Error('Please input your new product');
            }
            const newProduct = await productCol.add({ nama });
            history.push(`produk/edit/${newProduct.id}`);
        } catch (e) {
            setError(e.message);
        }
        setSubmitting(false);
    }
    return <Dialog open={open} onClose={handleClose} disableEscapeKeyDown={isSubmitting} disableBackdropClick={isSubmitting}>
        <DialogTitle>New Product</DialogTitle>
        <DialogContent dividers>
            <TextField
                id="nama"
                label="name product"
                value={nama}
                onChange={e => {
                    setError('');
                    setNama(e.target.value);
                }}
                helperText={error}
                error={error ? true : false}
                disabled={isSubmitting}
            />
        </DialogContent>
        <DialogActions>
            <Button disabled={isSubmitting} onClick={handleClose} >Cancel</Button>
            <Button disabled={isSubmitting} onClick={handleSubmit} color="primary">Save</Button>
        </DialogActions>
    </Dialog>
}

AddDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired
}

export default withRouter(AddDialog);
import React from 'react';
import propTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { currency } from '../../../utils/formatter';

function DetailDialog({ open, handleClose, transaction }) {
    return <Dialog open={open} onClose={handleClose}>
        <DialogTitle>No. Transaction: {transaction.no}</DialogTitle>
        <DialogContent dividers>
            <Table>
                <TableHead>
                    <TableCell>Item</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Subtotal</TableCell>
                </TableHead>
                <TableBody>
                    {
                        transaction.items &&
                        Object.keys(transaction.items).map((k) => {
                            const item = transaction.items[k];
                            return (
                                <TableRow key={k}>
                                    <TableCell>{item.nama}</TableCell>
                                    <TableCell>{item.jumlah}</TableCell>
                                    <TableCell>{currency(item.harga)}</TableCell>
                                    <TableCell>{currency(item.subtotal)}</TableCell>
                                </TableRow>
                            )
                        })
                    }
                    <TableRow>
                        <TableCell colSpan={3}><Typography variant="subtitle2">Total: </Typography></TableCell>
                        <TableCell><Typography variant="h6"></Typography>{currency(transaction.total)}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </DialogContent>
        <DialogActions>
            <Button color="primary" onClick={handleClose}>Close</Button>
        </DialogActions>


    </Dialog>
}

DetailDialog.propTypes = {
    open: propTypes.bool.isRequired,
    handleClose: propTypes.func.isRequired,
    transaction: propTypes.object.isRequired
}

export default DetailDialog;
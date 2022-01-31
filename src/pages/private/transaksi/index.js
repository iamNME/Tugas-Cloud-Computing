import React, { useEffect, useState } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import ViewIcon from '@material-ui/icons/Visibility';
import { useFirebase } from '../../../components/FirebaseProvider';
import { useCollection } from 'react-firebase-hooks/firestore';
import { Typography } from '@material-ui/core';
import { currency } from '../../../utils/formatter';
import format from 'date-fns/format';
import AppPageLoading from '../../../components/AppPageLoading';
import useStyles from './style';
import DetailDialog from './details';

function Transaksi() {
    const classes = useStyles();
    const { firestore, user } = useFirebase();
    const productCol = firestore.collection(`toko/${user.uid}/transaksi`);
    const [snapshot, loading] = useCollection(productCol);
    const [transactionItems, setTransactionItems] = useState([]);
    const [details, setDetails] = useState({
        open: false,
        transaction: {}
    });
    const handleCloseDetails = e => {
        setDetails({
            open: false,
            transaction: {}
        });
    }

    useEffect(() => {
        if (snapshot) {
            setTransactionItems(snapshot.docs);
        }
    }, [snapshot]);

    const handleDelete = transactionDoc => async e => {
        if (window.confirm('re you sure you want to delete this transaction?')) {
            await transactionDoc.ref.delete();
        }
    }

    const handleOpenDetail = transactionDoc => e => {
        setDetails({
            open: true,
            transaction: transactionDoc.data()
        });
    }

    if (loading) {
        return <AppPageLoading />
    }

    return <>
        <Typography variant="h5" component="h1" paragraph>List Transaction</Typography>
        {
            transactionItems.length <= 0 &&
            <Typography>You do not have a Transaction</Typography>
        }
        <Grid container spacing={5}>
            {
                transactionItems.map((transactionDoc) => {
                    const transactionData = transactionDoc.data();
                    return <Grid key={transactionDoc.id} item xs={12} sm={12} md={6} lg={4}>
                        <Card className={classes.Cards}>
                            <CardContent className={classes.contentCard}>
                                <Typography variant="h5" noWrap>{transactionData.no}</Typography>
                                <Typography variant="subtitle2" noWrap>Total: {currency(transactionData.total)}</Typography>
                                <Typography variant="subtitle2" noWrap>Date: {format(new Date(transactionData.timestamp), 'dd-MM-yyyy HH:mm')}</Typography>
                            </CardContent>
                            <CardActions className={classes.actionCard}>
                                <IconButton onClick={handleOpenDetail(transactionDoc)}>
                                    <ViewIcon />
                                </IconButton>
                                <IconButton onClick={handleDelete(transactionDoc)}>
                                    <DeleteIcon />
                                </IconButton>
                            </CardActions>

                        </Card>
                    </Grid>
                })
            }
        </Grid>

        <DetailDialog
            open={details.open}
            handleClose={handleCloseDetails}
            transaction={details.transaction}
        />
    </>
}

export default Transaksi;
import { makeStyles } from '@material-ui/core/styles';
const useStyle = makeStyles(theme => ({
    fab: {
        position: 'absolute',
        bottom: theme.spacing(2),
        right: theme.spacing(2)
    },
    photo: {
        width: 150
    },
    card: {
        display: 'flex'
    },
    photoPlaceHolder: {
        width: 150,
        alignSelf: 'center',
        textAlign: 'center'
    },
    productDetails: {
        flex: '2 0 auto'
    },
    productActions: {
        flexDirection: 'column'
    }
}));

export default useStyle;
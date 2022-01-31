import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    hideInputImage: {
        display: 'none'
    },
    uploadPhotoProduct: {
        textAlign: 'center',
        padding: theme.spacing(3)
    },
    previewPhoto: {
        width: '100%',
        height: 'auto'
    },
    iconRight: {
        marginLeft: theme.spacing(1)
    },
    iconLeft: {
        marginRight: theme.spacing(1)
    },
    actionButton: {
        paddingTop: theme.spacing(2)
    }
}));

export default useStyles;
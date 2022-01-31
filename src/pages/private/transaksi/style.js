import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    Cards: {
        display: 'flex'
    },
    contentCard: {
        flex: '2 0 auto'
    },
    actionCard: {
        flexDirection: 'column'
    }
}));

export default useStyles;
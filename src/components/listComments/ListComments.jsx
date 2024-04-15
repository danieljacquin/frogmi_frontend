import { Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemText } from "@mui/material";

const ListComments = ({ open, onClose, comments }) => {

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="comments-dialog-title">
      <DialogTitle id="comments-dialog-title">Comments</DialogTitle>
      <DialogContent>
        {comments.length === 0
          ?
          <p>There's no comments</p>
          :
          <List>
            {comments.map((comment, index) => (
              <ListItem key={index}>
                <ListItemText primary={comment.comment} />
              </ListItem>
            ))}
          </List>
        }

      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ListComments;
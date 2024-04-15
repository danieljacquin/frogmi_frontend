import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useState } from "react";

const CreateComment = ({ open, onClose, onCreateComment }) => {
    const [commentContent, setCommentContent] = useState('');
    const [error, setError] = useState(false);

    const handleCreateComment = async () => {
        if (commentContent.trim() === '') {
            setError(true); // Set error state if comment content is empty
            return;
        }
        const response = await onCreateComment(commentContent);
        if (response.data.success) {
            setCommentContent('');
            setError(false); // Clear the error state
            onClose();
        }

    };

    return (
        <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Create Comment</DialogTitle>
            <DialogContent>
                <TextField
                    required
                    autoFocus
                    margin="dense"
                    label="Comment Content"
                    fullWidth
                    error={error} // Set error state for validation
                    helperText={error ? 'Comment content is required' : ''}
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleCreateComment} color="primary">
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateComment;
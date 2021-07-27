import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import React from 'react';

export default function AlertDialog({ //Modal에 전달되는 props 최소화
  onSubmit=()=>{},
    children, submit = true,
    submitMsg = '확인',
    title = 'Warning',
    onClose = ()=>{},
    open = false,
}) {
  const handleClose = () => onClose()

  return (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth={'xl'}
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {children}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {submit ? <Button onClick={()=>{
            onSubmit()
            handleClose()
          }} color="primary" autoFocus>
            {submitMsg}
          </Button> : null}
        </DialogActions>
      </Dialog>
  );
}

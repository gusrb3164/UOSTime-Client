import React from 'react';
import { makeStyles, Container, Typography, Link } from '@material-ui/core';

const useStyles = makeStyles({
  footer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 'auto',
    backgroundColor: '##f6f6f6',
    color: '#4e4e4e',
  },
  font: {
    color: '#4e4e4e',
    '&:hover': {
      color: '#f68b7d',
    },
  },
  firstBox: {
    width: '50%',
    textAlign: 'left',
  },
  secondBox: {
    width: '50%',
    textAlign: 'right',
  },
});
function Footer() {
  const classes = useStyles();
  return (
    <Container maxWidth="lg" className={classes.footer}>
      <div className={classes.firstBox}>
        <Typography variant="UOS">
          <Link className={classes.font} underline="none" href="https://uos.ac.kr">서울시립대학교</Link>{' | '}
        </Typography>
        <Typography variant="Contact">
          {'문의하기 | '}
        </Typography>
        <Typography variant="TermsOfService">
          <Link className={classes.font} underline="none" href="https://uostime.herokuapp.com/terms_of_service">이용약관</Link>{' | '}
        </Typography>
        <Typography variant="PrivacyPolicy">
          <Link className={classes.font} underline="none" href="https://uostime.herokuapp.com/privacy_policy">개인정보처리방침</Link>
        </Typography>
      </div>
      <div className={classes.secondBox}>
        <Typography variant="UOSTime">
          {'©UOSTime Team '}
        </Typography>
        <Typography variant="Version">
          {' v2.0.0'}
        </Typography>
      </div>
    </Container>
  );
}

export default Footer;

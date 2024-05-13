import React, { useState } from 'react';
import Select from '@mui/material/Select';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import {
  InfoCard,
  Header,
  Page,
  Content,
  ContentHeader,
  HeaderLabel,
  SupportButton,
} from '@backstage/core-components';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 200,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    select: {
      '& .MuiSelect-select': {
        color: 'white', // Change this to the color you want
      },
    },
  }),
);

export const dnsRecord = () => {

  const classes = useStyles();

  const [formState, setFormState] = useState({
    dnsZoneName: '',
    whichPlatform: '',
    dnsRecordName: '',
    dnsRecordValue: '',
    environments: {
      sbox: false,
      ithc: false,
      prod: false,
    },
  });

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;
    if (name.startsWith('environments.')) {
      const environment = name.split('.')[1];
      setFormState(prevState => ({
        ...prevState,
        environments: {
          ...prevState.environments,
          [environment]: checked,
        },
      }));
    } else {
      setFormState(prevState => ({
        ...prevState,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    alert(JSON.stringify(formState, null, 2)); // Display the form data
  };

  return (
    <Page themeId="tool">
    <Header title="Welcome to the DNS creation plugin">
      <HeaderLabel label="Owner" value="Team X" />
      <HeaderLabel label="Lifecycle" value="Alpha" />
    </Header>
    <Content>
      <ContentHeader title="Create a DNS Record">
        <SupportButton>This plugin helps you create new Public DNS records on HMCTS.</SupportButton>
      </ContentHeader>
      <Grid container spacing={3} direction="column">
        <Grid item>
          <InfoCard title="">
            <Typography variant="body1">
              Please enter your DNS record information below:
            </Typography>
            <br></br>
            <div>
              <Box mb={2}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel id="DNS-Zone-Name-label" htmlFor="DNS-Zone-Name" shrink>DNS Zone Name</InputLabel>
                  <Select labelId="DNS-Zone-Name-label" id="DNS-Zone-Name" value={formState.dnsZoneName} onChange={handleChange} name="dnsZoneName" className={classes.select} >
                    <MenuItem value=""><em>None</em></MenuItem>
                    <MenuItem value={'platform-hmcts-net'}>platform.hmcts.net</MenuItem>
                    <MenuItem value={'hmcts-net'}>hmcts.net</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box mb={2}>
                <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="platform-label" htmlFor="platform" shrink>Platform Name</InputLabel>
                  <Select labelId="platform-label" id="platform" value={formState.whichPlatform} onChange={handleChange} name="whichPlatform" className={classes.select}>
                    <MenuItem value=""><em>None</em></MenuItem>
                    <MenuItem value={'cft'}>cft</MenuItem>
                    <MenuItem value={'sds'}>sds</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <TextField label="DNS Record Name" value={formState.dnsRecordName} onChange={handleChange} name="dnsRecordName" />
              <br></br>
              <TextField label="DNS Record Value" value={formState.dnsRecordValue} onChange={handleChange} name="dnsRecordValue" />
              <br></br>
              <br></br>
              <Typography variant="body1">
              Please select all environments that you wish to add this record to:
              </Typography>
              <div><FormControlLabel control={ <Checkbox checked={formState.environments.sbox} onChange={handleChange} name="environments.sbox" />} label="Sandbox" /></div>
              <div><FormControlLabel control={ <Checkbox checked={formState.environments.ithc} onChange={handleChange} name="environments.ithc" />} label="ITHC" /></div>
              <div><FormControlLabel control={ <Checkbox checked={formState.environments.prod} onChange={handleChange} name="environments.prod" />} label="Production" /></div>

              <br></br>
              <div><Button onClick={handleSubmit}>Submit</Button></div>
            </div> 
          </InfoCard>
        </Grid>
      </Grid>
    </Content>
  </Page>
  );
};

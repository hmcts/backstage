import React from 'react';
import {
    HomePageToolkit,
    HomePageCompanyLogo,
    HomePageStarredEntities,
    TemplateBackstageLogo,
    TemplateBackstageLogoIcon
} from '@backstage/plugin-home';

import { Content, Page } from '@backstage/core-components';
import {
    HomePageSearchBar,
} from '@backstage/plugin-search';
import { SearchContextProvider } from '@backstage/plugin-search-react';
import { Grid, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    searchBar: {
        display: 'flex',
        maxWidth: '60vw',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[1],
        padding: '8px 0',
        borderRadius: '50px',
        margin: 'auto',
    },
}));

const useLogoStyles = makeStyles(theme => ({
    container: {
        margin: theme.spacing(5, 0),
    },
    svg: {
        width: 'auto',
        height: 100,
    },
    path: {
        fill: '#7df3e1',
    },
}));

export const HomePage = () => {
    const classes = useStyles();
    const { svg, path, container } = useLogoStyles();

    const links = [
        {
            url: 'https://hmcts.github.io',
            label: 'Platform',
            icon: <TemplateBackstageLogoIcon />,
        },
        {
            url: 'https://hmcts-reform.slack.com',
            label: 'Slack',
            icon: <TemplateBackstageLogoIcon />,
        },
        {
            url: 'https://portal.platform.hmcts.net',
            label: 'VPN',
            icon: <TemplateBackstageLogoIcon />,
        },
    ]

    return (
        <SearchContextProvider>
            <Page themeId="home">
                <Content>
                    <Grid container justifyContent="center" spacing={6}>
                        <HomePageCompanyLogo
                            className={container}
                            logo={<TemplateBackstageLogo classes={{ svg, path }} />}
                        />
                        <Grid container item xs={12} alignItems="center" direction="row">
                            <HomePageSearchBar
                                classes={{ root: classes.searchBar }}
                                placeholder="Search"
                            />
                        </Grid>
                        <Grid container item xs={12}>
                            <Grid item xs={12} md={6}>
                                <HomePageStarredEntities />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <HomePageToolkit
                                    title="Links"
                                    tools={links}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Content>
            </Page>
        </SearchContextProvider>
    );
};

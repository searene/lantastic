import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Scan } from './Scan';
import { Grid, Menu, Segment } from 'semantic-ui-react';

import '../stylesheets/components/Preference.scss';

export interface PreferenceProps {
    // width: string;
}

export class Preference extends React.Component<PreferenceProps, undefined> {
    render() {
      return (
        <Grid>
          <Grid.Row columns={2}>
            <Grid.Column width={4}>
              <Menu vertical>
                <Menu.Item>
                  <Menu.Header>Dictionary</Menu.Header>
                  <Menu.Menu>
                    <Menu.Item name="scan" active />
                    <Menu.Item name="details" />
                  </Menu.Menu>
                </Menu.Item>
              </Menu>
            </Grid.Column>
            <Grid.Column width={12}>
              <Segment>
                <Scan paths={['Run', 'Walk', 'Bike']}/>
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      )
    }
}

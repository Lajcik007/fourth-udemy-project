import { History } from 'history'
import * as React from 'react'
import {
  Divider,
  Grid,
  Header,
  Image,
  Loader
} from 'semantic-ui-react'

import { getAllAnnouncements } from '../api/announcement-api'
import Auth from '../auth/Auth'
import { Announcement } from '../types/Announcement'

interface AnnouncementsProps {
  auth: Auth
  history: History
}

interface AnnouncementsState {
  announcements: Announcement[]
  loadingAnnouncements: boolean
}

export class Announcements extends React.PureComponent<AnnouncementsProps, AnnouncementsState> {
  state: AnnouncementsState = {
    announcements: [],
    loadingAnnouncements: true
  }

  async componentDidMount() {
    try {
      const announcements = await getAllAnnouncements(this.props.auth.getIdToken())
      this.setState({
        announcements,
        loadingAnnouncements: false
      })
    } catch (e) {
      alert(`Failed to fetch announcements: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Public announcements</Header>

        {this.renderAnnouncements()}
      </div>
    )
  }

  renderAnnouncements() {
    if (this.state.loadingAnnouncements) {
      return this.renderLoading()
    }

    return this.renderAnnouncementsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Announcements
        </Loader>
      </Grid.Row>
    )
  }

  renderAnnouncementsList() {
    return (
      <Grid padded>
        <Grid.Row>
          <Grid.Column className="ui header" width={5} verticalAlign="middle">
            Title
          </Grid.Column>
          <Grid.Column className="ui header" width={11} verticalAlign="middle">
            Description
          </Grid.Column>
          <Grid.Column width={16}>
            <Divider />
          </Grid.Column>
        </Grid.Row>
        {this.state.announcements.map((announcement, pos) => {
          return (
            <Grid.Row key={announcement.announcementId}>
              <Grid.Column width={5} verticalAlign="middle">
                {announcement.name}
              </Grid.Column>
              <Grid.Column width={11} verticalAlign="middle">
                {announcement.description}
              </Grid.Column>

                {announcement.attachmentUrl && (
                  <Image src={announcement.attachmentUrl} size="small" wrapped />
                )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }
}

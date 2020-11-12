import * as React from 'react'
import Auth from '../auth/Auth'
import { History } from 'history'
import { Announcement } from '../types/Announcement'
import { createAnnouncement, deleteAnnouncement, getAnnouncements, patchAnnouncement } from '../api/announcement-api'
import update from 'immutability-helper'
import { Button, Checkbox, Divider, Grid, Header, Icon, Image, Input, Loader } from 'semantic-ui-react'

interface AnnouncementsProps {
  auth: Auth
  history: History
}

interface AnnouncementsState {
  announcements: Announcement[]
  newTodoName: string
  newTodoDescription: string
  loadingAnnouncements: boolean
}

export class MyAnnouncements extends React.PureComponent<AnnouncementsProps, AnnouncementsState> {
  state: AnnouncementsState = {
    announcements: [],
    newTodoName: '',
    newTodoDescription: '',
    loadingAnnouncements: true
  }

  async componentDidMount() {
    try {
      const announcements = await getAnnouncements(this.props.auth.getIdToken())
      this.setState({
        announcements,
        loadingAnnouncements: false
      })
    } catch (e) {
      alert(`Failed to fetch announcements: ${e.message}`)
    }
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newTodoName: event.target.value })
  }

  handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newTodoDescription: event.target.value })
  }

  onEditButtonClick = (todoId: string) => {
    this.props.history.push(`/announcements/${todoId}/edit`)
  }

  onTodoDelete = async (announcementId: string) => {
    try {
      await deleteAnnouncement(this.props.auth.getIdToken(), announcementId)
      this.setState({
        announcements: this.state.announcements.filter(announcement => announcement.announcementId != announcementId)
      })
    } catch {
      alert('Todo deletion failed')
    }
  }

  onTodoCheck = async (pos: number) => {
    try {
      const announcement = this.state.announcements[pos]
      await patchAnnouncement(this.props.auth.getIdToken(), announcement.announcementId, {
        published: announcement.published === 1 ? 0 : 1
      })
      this.setState({
        announcements: update(this.state.announcements, {
          [pos]: { published: { $set: announcement.published === 1 ? 0 : 1 } }
        })
      })
    } catch {
      alert('Todo publishing failed')
    }
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    if (!this.state.newTodoName) {
      alert('Announcement title should not be null')
      return
    }

    if (!this.state.newTodoDescription) {
      alert('Announcement description should not be null')
      return
    }

    try {
      const newAnnouncement = await createAnnouncement(this.props.auth.getIdToken(), {
        name: this.state.newTodoName,
        description: this.state.newTodoDescription,
      })
      this.setState({
        announcements: [...this.state.announcements, newAnnouncement],
        newTodoName: '',
        newTodoDescription: ''
      })
      alert('Announcement added successfully')
    } catch {
      alert('Announcement creation failed')
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">My announcements</Header>

        {this.renderCreateAnnouncementInput()}

        {this.renderAnnouncements()}
      </div>
    )
  }

  renderCreateAnnouncementInput() {
    return (
      <Grid.Row>
        <Grid.Column width={8}>
          <form onSubmit={this.handleSubmit}>
            <Input
              fluid
              placeholder="Announcement title"
              onChange={this.handleNameChange}
            />
            <Input
              fluid
              placeholder="Announcement description"
              onChange={this.handleDescriptionChange}
            />
            <button
              className="ui button"
              type="submit"
            >
              Save announcement
            </button>
          </form>
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
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
        {this.state.announcements.map((announcement, pos) => {
          return (
            <Grid.Row key={announcement.announcementId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onTodoCheck(pos)}
                  checked={announcement.published === 1}
                />
              </Grid.Column>
              <Grid.Column width={5} verticalAlign="middle">
                {announcement.name}
              </Grid.Column>
              <Grid.Column width={7} verticalAlign="middle">
                {announcement.description}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(announcement.announcementId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onTodoDelete(announcement.announcementId)}
                >
                  <Icon name="delete" />
                </Button>
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

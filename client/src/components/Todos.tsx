import { History } from 'history'
import * as React from 'react'
import {
  Divider,
  Grid,
  Header,
  Image,
  Loader
} from 'semantic-ui-react'

import { getAllAnnouncement } from '../api/announcement-api'
import Auth from '../auth/Auth'
import { Announcement } from '../types/Announcement'

interface TodosProps {
  auth: Auth
  history: History
}

interface TodosState {
  todos: Announcement[]
  loadingTodos: boolean
}

export class Todos extends React.PureComponent<TodosProps, TodosState> {
  state: TodosState = {
    todos: [],
    loadingTodos: true
  }

  async componentDidMount() {
    try {
      const todos = await getAllAnnouncement(this.props.auth.getIdToken())
      this.setState({
        todos,
        loadingTodos: false
      })
    } catch (e) {
      alert(`Failed to fetch todos: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Public announcements</Header>

        {this.renderTodos()}
      </div>
    )
  }

  renderTodos() {
    if (this.state.loadingTodos) {
      return this.renderLoading()
    }

    return this.renderTodosList()
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

  renderTodosList() {
    return (
      <Grid padded>
        {this.state.todos.map((todo, pos) => {
          return (
            <Grid.Row key={todo.announcementId}>
              <Grid.Column width={5} verticalAlign="middle">
                {todo.name}
              </Grid.Column>
              <Grid.Column width={11} verticalAlign="middle">
                {todo.description}
              </Grid.Column>

                {todo.attachmentUrl && (
                  <Image src={todo.attachmentUrl} size="small" wrapped />
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

import * as React from 'react'
import Auth from '../auth/Auth'
import { History } from 'history'
import { Announcement } from '../types/Announcement'
import { createAnnouncement, deleteTodo, getAnnouncements, patchTodo } from '../api/announcement-api'
import update from 'immutability-helper'
import { Button, Checkbox, Divider, Grid, Header, Icon, Image, Input, Loader } from 'semantic-ui-react'

interface TodosProps {
  auth: Auth
  history: History
}

interface TodosState {
  todos: Announcement[]
  newTodoName: string
  newTodoDescription: string
  loadingTodos: boolean
}

export class MyAnnouncements extends React.PureComponent<TodosProps, TodosState> {
  state: TodosState = {
    todos: [],
    newTodoName: '',
    newTodoDescription: '',
    loadingTodos: true
  }

  async componentDidMount() {
    try {
      const todos = await getAnnouncements(this.props.auth.getIdToken())
      this.setState({
        todos,
        loadingTodos: false
      })
    } catch (e) {
      alert(`Failed to fetch todos: ${e.message}`)
    }
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newTodoName: event.target.value })
  }

  handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newTodoDescription: event.target.value })
  }

  onEditButtonClick = (todoId: string) => {
    this.props.history.push(`/todos/${todoId}/edit`)
  }

  onTodoDelete = async (announcementId: string) => {
    try {
      await deleteTodo(this.props.auth.getIdToken(), announcementId)
      this.setState({
        todos: this.state.todos.filter(todo => todo.announcementId != announcementId)
      })
    } catch {
      alert('Todo deletion failed')
    }
  }

  onTodoCheck = async (pos: number) => {
    try {
      const todo = this.state.todos[pos]
      await patchTodo(this.props.auth.getIdToken(), todo.announcementId, {
        published: todo.published === 1 ? 0 : 1
      })
      this.setState({
        todos: update(this.state.todos, {
          [pos]: { published: { $set: todo.published === 1 ? 0 : 1 } }
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
      const newTodo = await createAnnouncement(this.props.auth.getIdToken(), {
        name: this.state.newTodoName,
        description: this.state.newTodoDescription,
      })
      this.setState({
        todos: [...this.state.todos, newTodo],
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

        {this.renderTodos()}
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
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onTodoCheck(pos)}
                  checked={todo.published === 1}
                />
              </Grid.Column>
              <Grid.Column width={5} verticalAlign="middle">
                {todo.name}
              </Grid.Column>
              <Grid.Column width={7} verticalAlign="middle">
                {todo.description}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(todo.announcementId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onTodoDelete(todo.announcementId)}
                >
                  <Icon name="delete" />
                </Button>
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

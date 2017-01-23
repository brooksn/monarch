import React, { Component } from 'react'
import { Media, Section, SectionHeader } from 'rebass'
import blogStore, { BLOG_STORE_CHANGE_EVENT, getPages } from '../stores/blogStore.js'
const containerStyle = {
  marginLeft: '2em',
  marginRight: '2em'
}
const articleStyle = {
  textAlign: 'left'
}
const titleStyle = {}
const bodyStyle = {}
export default class Blog extends Component {
  constructor(props) {
    super(props)
    const pages = getPages()
    this.state = {
      pages,
      noPosts: false
    }
  }
  blogStoreChanged() {
    const pages = getPages()
    const noPosts = pages.length > 0
    this.setState({pages, noPosts})
  }
  componentDidMount() {
    blogStore.on(BLOG_STORE_CHANGE_EVENT, this.blogStoreChanged.bind(this))
  }
  componentWillUnmount() {
    blogStore.removeListener(BLOG_STORE_CHANGE_EVENT, this.blogStoreChanged.bind(this))
  }
  render() {
    const posts = this.state.pages.map(page => {
      const dangerousPostContentHTML = {__html: page.content}
      return (
        <article key={page.global_ID} style={articleStyle}>
          <Section>
            <SectionHeader style={titleStyle}
              heading={page.title}
            />
            <Media align="center" img={page.featured_image} />
            <div style={bodyStyle} dangerouslySetInnerHTML={dangerousPostContentHTML} />
          </Section>
        </article>
      )
    })
    const noPosts = this.state.noPosts !== true ? 'Loading posts...' : 'There are no posts to display.'
    return (
      <div style={containerStyle}>
        {posts.length > 0 ? posts : <p>{noPosts}</p>}
      </div>
    )
  }
}

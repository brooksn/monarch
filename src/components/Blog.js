import React from 'react'
import { Section, SectionHeader } from 'rebass'
import blogStore, { BLOG_STORE_CHANGE_EVENT, getPosts } from '../stores/blogStore.js'
const containerStyle = {
  marginLeft: '2em',
  marginRight: '2em'
}
const articleStyle = {
  textAlign: 'left'
}
const titleStyle = {}
const bodyStyle = {}
export default class Blog extends React.Component {
  constructor(props) {
    super(props)
    const storePosts = getPosts()
    const posts = typeof storePosts === 'object' && Array.isArray(storePosts.posts) ? storePosts.posts : []
    this.state = {
      posts,
      noPosts: false
    }
  }
  blogStoreChanged() {
    const json = getPosts()
    if (typeof json === 'object' && Array.isArray(json.posts)) this.setState({posts: json.posts})
    else this.setState({noPosts: true})
  }
  componentDidMount() {
    blogStore.on(BLOG_STORE_CHANGE_EVENT, this.blogStoreChanged.bind(this))
  }
  componentWillUnmount() {
    blogStore.removeListener(BLOG_STORE_CHANGE_EVENT, this.blogStoreChanged.bind(this))
  }
  render() {
    const posts = this.state.posts.map(post => {
      const dangerousPostContentHTML = {__html: post.content}
      return (
        <article key={post.global_ID} style={articleStyle}>
          <Section>
            <SectionHeader style={titleStyle}
              heading={post.title}
            />
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

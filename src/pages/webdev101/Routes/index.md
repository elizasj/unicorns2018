---
date: '2017-04-12T00:00:00Z'
tags: ['javascript', 'MongoDB', 'Express', 'backend', 'webdev101']
title: 'Routing w/Express & MongoDB'
category: 'webdev101'
---

_... Or that time I learned that I don't hate databases & models... I hate naming conventions!_

I'm currently building a simple Morning Pages\*\* app, that upon login accepts a daily entry of at least 750 words, and saves each day's entry to the database. Every time the user submits an entry, they're redirected to the archive of all their posts to date, each of which is a link that upon clicking will redirect the user to a webpage that features the single entry.

Nothing too fancy to start off with, and I won't go over all the HTTP methods that building routes calls for because I've mentioned them [before](https://unicornsfartpixels.github.io/blog/2017/01/11/2017LearningToRead), but below we have a `get` method that is grabbing the logged in user's posts, and rendering them onto the archive page (called `/pages`)

In the routes, `(req, res, next)` is just short form for `(request, response, next)` - so as you can see in our route below we are calling the `.findOne` method on `User`, which is one of two collections in our database (the other being `Posts` where we can find all our individual Morning Pages) and connecting all the pages written by the logged in user to... well, to themselves (one user has many pages, many pages are written by a single user) so that we can see them listed on our webpage. But this all might sound like spaghetti on a plate, so lets look to our code for more clarity 🍝

```javascript
//ROUTE
postRoutes.get('/pages', (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .populate('posts')
    .exec((err, user) => {
      if (err) {
        next(err)
        return
      }
      res.render('pages', { user })
    })
})
```

Above we're accessing the logged in user via the User model (featured just below -- but don't look at it yet!) via which we are trying to point the logged in user's posts toward the user - that's the whole `.populate("posts")` part.

`User.findOne` queries the database's User collection first, to find a user who's id matches the logged in user's. Then the query continues, this time searching the database's Post collection for all posts written by that the logged in user's id. `req.user._id` reaches into the JSON in the database and retrieves the ObjectId reference of all posts written by the logged-in user, and fills the `posts` array as laid out in the User model, with the ObjectId's.

N.B: You are **not** putting the posts inside the user in the database, you are putting a reference to each post in the posts array that is in the user collection in the database (made possible by the User model schema, which we're about to see.)

Kay, now you can look at the model for our users!

```javascript
//MODEL User.js
const userSchema = new Schema(
  {
    username: String,
    password: String,
    posts: [{ type: Schema.ObjectId, ref: 'Post' }],
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
)

const User = mongoose.model('User', userSchema)
module.exports = User
```

In the above code, we see how Express and MongoDB communicate: via models made available to us through Mongoose, an Object Document Mapper or ODM (_eh?_) which pretty much acts as a go-between for our database and our app (_oh!_) turning the data stored in the db into javascript objects ripe and ready for us to play with (_ah!_)

Notice that in `userSchema` you have some key/value pairings, one of which features a link to... _another schema?_ As you can see there's a `ref:'Post'` in there that points to the Post model. That link and reference is what allows us to populate our user's posts array with post ObjectIds, up above in our route.

```javascript
//VIEW
<% if (user) { %>
  <section>
      <h2>All Your Morning Pages</h2>
  </section>

  <section>
      <% user.posts.forEach((post) => { %>
          page:
          <a href="/page/<%= post._id %>">
              <%= post.text %>
          </a><br>
          <%  }) %>
  </section>
  <div class="nav">
      <ul>
          <li><a href="/">Index</a></li>
          <li><a href="/logout">Logout</a></li>
          <li><a href="/private-page">Back to private</a></li>
          <li><a href="/page">single page</a></li>
      </ul>
  </div>
  <% } %>
```

Here's where my hatred of databases turned into a serious annoyance with naming conventions: Views. While the above view is
pretty straightforward, it took me a minute to get there. I kept confusing myself between `/pages` which featured the archives of all morning pages per user, `/page` which renders a single morning page, a post request, and `posts` in the database ... seems pretty silly when it's all laid out in front of you on a screen, but when you're trouble shooting with your peers, talking about the pages page, the page page, wich route makes what post request and grabbing posts from the database to link to each user (who writes Morning Pages, not posts!!) Things can get... confusing.

Here though, we see a fairly simple example of how you can grab things from the database and have them render out on to the web which despite how underwhelming the photographic evidence of my success might look, I find pretty damn exciting, #allthepossibilities!

![Image](https://raw.githubusercontent.com/unicornsfartpixels/unicornsfartpixels.github.io/02b63c08ed2fbad22296033b4bca040afb30f16e/media/morningpages.png)

But wait! There's more. We have links, but we don't have what they link to yet. How would we render a single post onto a new webpage?

```javascript
//ROUTE
postRoutes.get('/page/:_id', (req, res, next) => {
  let user = req.user._id
  let page = req.params._id

  Post.findById(page, (err, post) => {
    if (err) {
      next(err)
    }

    res.render('page', { post, user })
  })
})
```

Something new is happening in our routes, can you spot it? In this get request, we're trying to get a single unique page (`/page`) to render out for each of the unique posts we linked on our archives page (`/pages`). You might have noticed that we're 'getting' `page/:id` - don't be thrown off by the colon, it's part of mongoose's syntax for communicating between Express and MongoDB. It's in times like these that I mentally swap out `_id` for something ridiculous like `banana` so I remember that the colon aka ':' is syntax, and the rest is up to me.

I tend to like to keep everything that refers to the same thing named the same across all concerns, but not everyone does this. I personally find that gives me an added layer of clarity, which is always nice. It also makes your code more readable which is pretty important if you consider that 80%+ of our time as devs is spent maintaining other people's code. And so I name it `_id`, because that's what we've been calling it everwhere else.

```javascript
//MODEL Post.js
const postSchema = new Schema(
  {
    author: { type: Schema.ObjectId, ref: 'User' },
    text: String,
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
)

const Post = mongoose.model('Post', postSchema)
module.exports = Post
```

The rest is pretty straightforward if you've read through everything. Our Post model features a link and reference to the User schema that looks pretty similar the one we saw in our User model. And then here below we see very simply, how to render out the text of the individual Morning Page we clicked on.

```javascript
//VIEW
<% if (user) { %>
	<section>
		<h2>A page</h2>
	</section>

	<section>
		<%- post.text -%>
	</section>

	<div class="nav">
		<ul>
			<li><a href="/">Index</a></li>
			<li><a href="/logout">Logout</a></li>
			<li><a href="/pages">Back to pages</a></li>
		</ul>
	</div>
<% } %>
```

![Image](https://raw.githubusercontent.com/unicornsfartpixels/unicornsfartpixels.github.io/02b63c08ed2fbad22296033b4bca040afb30f16e/media/morningpage.png)

There are a lot of moving parts that need to be accounted for here, and this is but a teeny tiny little test app with all of 10 routes so far. You can imagine the levels of complexity that some apps can reach ⚡⚡

\*\*I've been toying off an on with keeping [Morning Pages](http://juliacameronlive.com/basic-tools/morning-pages/) since a friend turned me on to what is apparently a "bedrock tool of creative recovery" a few years ago. If you've never heard of Julia Cameron's Morning Pages, they consist in the daily practice of writing three notebook pages (approx. 750 words give or take) worth of stream of consciousness, and whatever else might be cramping up your headspace. You're suppose to do them as soon as possible after waking up, and over time this simple exercise is suppose help you become more creative in your work.

Sometimes I can keep it up for weeks at a time, other times I forget to do it completely. But whatever my mood on a particular day may be, the overall experience of extracting half sleepy thoughts from my head and putting them somewhere (anywhere) other than inside my crowded mind (isn't yours?) has so far been just pleasant enough that I decided to build myself an app to house my pages.

Because as charming as notebooks are, those tiny hand muscles I trained so well all throughout elementary and high school are now old and tired. And so I type. Or maybe they're old and tired because I type. 🐔 🤔 🍳 Either way, it makes for a more fluid writing experience. Plus I can add fun things like graphs, a login to keep my pages private and safe, word count and word analysis to track myself over time.

export const dummy = (blogs) => {
  return 1;
};

export const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

export const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }
  let favorite = blogs[0];

  blogs.forEach((blog) => {
    if (blog.likes > favorite.likes) {
      favorite = blog;
    }
  });

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes,
  };
};

export const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null;
  let authors = [];
  blogs.forEach((blog) => {
    let existingAuthor = authors.find((a) => a.name === blog.author);

    if (existingAuthor) {
      existingAuthor.blogs += 1;
    } else {
      authors.push({
        name: blog.author,
        blogs: 1,
      });
    }
  });

  let maxAuthor = authors[0];

  authors.forEach((author) => {
    if (author.blogs > maxAuthor.blogs) {
      maxAuthor = author;
    }
  });

  return {
    author: maxAuthor.name,
    blogs: maxAuthor.blogs,
  };
};

export const mostLikes = (blogs) => {
  if (blogs.length === 0) return null;

  let authors = [];

  blogs.forEach((blog) => {
    let existingAuthor = authors.find((a) => a.name === blog.author);

    if (existingAuthor) {
      existingAuthor.likes += blog.likes;
    } else {
      authors.push({
        name: blog.author,
        likes: blog.likes,
      });
    }
  });

  let maxAuthor = authors[0];

  authors.forEach((author) => {
    if (author.likes > maxAuthor.likes) {
      maxAuthor = author;
    }
  });

  return {
    author: maxAuthor.name,
    likes: maxAuthor.likes,
  };
};

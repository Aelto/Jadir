const dbQuery = require('./db-query.js');

class Post {
  constructor({ id, title, date, author_id, content, tags, author, score, image_url }) {
    this.id = id;
    this.title = title;
    this.date = date;
    this.author_id = author_id;
    this.content = content;
    this.tags = tags;
    this.author = author;
    this.score = score;
    this.image_url = image_url;
  }
}

exports.getRecentPosts = async function(offset, number) {
  return Array.from(await dbQuery(`select * from posts order by date desc limit ?, ?`, [
    offset, offset + number
  ])).map(postResult => new Post(postResult));
}
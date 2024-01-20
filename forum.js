const connection = require('./dbConnect');
const r = require('./requestHandle');
const util = require('util');
const myU = require('./utils');


async function postList() {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const results = await query('SELECT user_member.mName, project.forum.*FROM project.user_member JOIN  project.forum ON project.user_member.mId =  project.forum.mId');
    return r.requestHandle(true, "", 0, results)
  } catch (error) {
    console.log(`error ${error}`);
    return r.requestHandle(false, `${error}`, 1, "")
  }
}

async function getComment(postId) {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const results = await query('SELECT * FROM project.forum_comment WHERE postId =?', [postId]);
    return r.requestHandle(true, "", 0, results)
  } catch (error) {
    console.log(`error ${error}`);
    return r.requestHandle(false, `${error}`, 1, "")
  }
}

async function createPost(post) {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const checkCreatePostActive = await query('SELECT * FROM project.user_member WHERE mId = ? AND createPost = ?', [post.mId, 1]);

    if (checkCreatePostActive.length > 0) {
      const results = await query('INSERT INTO project.forum SET ?', post);
      console.log('New post added successfully.');
      return r.requestHandle(true, 'New post added successfully.', 0, "")
    } else {
      return r.requestHandle(false, 'This user create post active is 0', 1, "")
    }
  } catch (error) {
    console.log(`Error: ${error}`);
    return r.requestHandle(false, `${error}`, 2, "")
  }
}

async function createComment(comment) {
  try {
    const query = util.promisify(connection.query).bind(connection);

    const checkCreateCommentActive = await query('SELECT * FROM project.user_member WHERE mId = ? AND createComment = ?', [comment.mId, 1]);
    
    if (checkCreateCommentActive.length > 0) {

      check = await query('SELECT * FROM project.forum WHERE postId =? ', [comment.postId]);
      console.log(check)
      if (check.length >0) {
        const results = await query('INSERT INTO project.forum_comment SET ?', [comment]);
        console.log('New comment added successfully.');
        return r.requestHandle(true, 'New comment added successfully.', 0, "commentId :" + comment.commentId)
        
      } else {
        return r.requestHandle(false, "post is not exist", 1, "")
       
      }

    } else {
      return r.requestHandle(false, 'This user create comment active is 0', 2, "")
    }
  } catch (error) {
    console.log(`error ${error}`);
    return r.requestHandle(false, `${error}`, 3, "")
  }
}


async function changeCreatePostActive(mId) {
  try {
    const query = util.promisify(connection.query).bind(connection);
    check = await query('SELECT * FROM project.user_member WHERE mId = ? AND createPost = ?', [mId, 1]);

    if (check.length > 0) {
      results = await query('UPDATE project.user_member SET createPost = ? WHERE mId = ?', [0, mId]);
      console.log('Edit Create Post  to 0 successfully.');
      return r.requestHandle(true, "Edit Create Post  to 0 successfully", 0, "");
    } else {
      results = await query('UPDATE project.user_member SET createPost = ? WHERE mId = ?', [1, mId]);
      console.log('Edit Create Post Active to 1 successfully.');
      return r.requestHandle(true, "Edit Create Post Active to 1 successfully", 0, "");
    }
  } catch (error) {
    console.log(`Error: ${error}`);
    return r.requestHandle(false, `${error}`, 1, "");
  }
}


async function changeCreateCommentActive(mId) {

  try {
    const query = util.promisify(connection.query).bind(connection);
    check = await query('SELECT * FROM project.user_member WHERE mId = ? AND createComment = ?', [mId, 1]);

    if (check.length > 0) {
      results = await query('UPDATE project.user_member SET createComment = ? WHERE mId = ?', [0, mId]);
      console.log('Edit Create comment  to 0 successfully.');
      return r.requestHandle(true, "Edit Create comment  to 0 successfully", 0, "");
    } else {
      results = await query('UPDATE project.user_member SET createComment = ? WHERE mId = ?', [1, mId]);
      console.log('Edit Create Post Active to 1 successfully.');
      return r.requestHandle(true, "Edit Create comment Active to 1 successfully", 0, "");
    }
  } catch (error) {
    console.log(`Error: ${error}`);
    return r.requestHandle(false, `${error}`, 1, "");
  }
}





module.exports = {
  postList: postList,
  createPost: createPost,
  createComment: createComment,
  getComment: getComment,
  changeCreatePostActive: changeCreatePostActive,
  changeCreateCommentActive, changeCreateCommentActive
};
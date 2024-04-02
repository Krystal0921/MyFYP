const connection = require("./dbConnect");
const r = require("./requestHandle");
const util = require("util");
const myU = require("./utils");
const fs = require("fs");

async function postList() {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const results = await query(
      "SELECT user_member.mName, project.forum.* FROM project.user_member JOIN project.forum ON project.user_member.mId = project.forum.mId ORDER BY createAt DESC"
    );

    if (results.length > 0) {
      const posts = [];

      for (const post of results) {
        const imagePath = "./image/" + post.postId + "/" + post.postImage;
        const imageBase64 = await readImageAsBase64(imagePath);
        post.image = imageBase64;
        posts.push(post);
      }

      return r.requestHandle(true, "", 0, posts);
    } else {
      return r.requestHandle(false, "", 1, "");
    }
  } catch (error) {
    console.log(`error ${error}`);
    return r.requestHandle(false, `${error}`, 1, "");
  }
}

async function getPostDetail(postId) {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const results = await query(
      `SELECT f.title, f.content, f.postImage, f.createAt, u.mName, u.mPhoto
      FROM project.forum f
      JOIN project.user_member u ON f.mId = u.mId
      WHERE f.postId = ?`,
      [postId]
    );

    const posts = [];
    for (const post of results) {
      const imagePath = "./image/" + postId + "/" + post.postImage;
      const imageBase64 = await readImageAsBase64(imagePath);
      post.image = imageBase64;
      posts.push(post);
    }

    return r.requestHandle(true, "", 0, posts);
  } catch (error) {
    console.log(`error ${error}`);
    return r.requestHandle(false, `${error}`, 1, "");
  }
}

async function getComment(postId) {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const results = await query(
      "SELECT * FROM project.forum_comment WHERE postId =?",
      [postId]
    );
    return r.requestHandle(true, "", 0, results);
  } catch (error) {
    console.log(`error ${error}`);
    return r.requestHandle(false, `${error}`, 1, "");
  }
}

async function createPost(post) {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const checkCreatePostActive = await query(
      "SELECT * FROM project.user_member WHERE mId = ? AND createPost = ?",
      [post.mId, 1]
    );

    if (checkCreatePostActive.length > 0) {
      const imageBase64String = post.image;

      if (!fs.existsSync("./image/" + post.postId)) {
        await fs.mkdirSync("./image/" + post.postId, (error) => {
          if (error) console.log(error);
          else console.log("OK");
        });
      }

      const outputPath = "./image/" + post.postId + "/" + post.postImage;

      base64ToImage(imageBase64String, outputPath);

      await query(
        "INSERT INTO  project.forum  (postId, mId, title, content, postImage, createAt) VALUES (?, ?, ?, ?, ?, ?)",
        [
          post.postId,
          post.mId,
          post.title,
          post.content,
          post.postImage,
          post.createAt,
        ]
      );

      console.log("New post added successfully.");
      return r.requestHandle(true, "New post added successfully.", 0, "");
    } else {
      return r.requestHandle(false, "This user create post active is 0", 1, "");
    }
  } catch (error) {
    console.log(`Error: ${error}`);
    return r.requestHandle(false, `${error}`, 2, "");
  }
}

function base64ToImage(base64String, outputPath) {
  // Remove the data URL prefix from the base64 string
  const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");

  // Create a buffer from the base64 string
  const imageBuffer = Buffer.from(base64Data, "base64");

  // Write the buffer to the output file
  fs.writeFileSync(outputPath, imageBuffer, "base64");
}

async function createComment(comment) {
  try {
    const query = util.promisify(connection.query).bind(connection);

    const checkCreateCommentActive = await query(
      "SELECT * FROM project.user_member WHERE mId = ? AND createComment = ?",
      [comment.mId, 1]
    );

    if (checkCreateCommentActive.length > 0) {
      check = await query("SELECT * FROM project.forum WHERE postId =? ", [
        comment.postId,
      ]);
      console.log(check);
      if (check.length > 0) {
        const results = await query("INSERT INTO project.forum_comment SET ?", [
          comment,
        ]);
        console.log("New comment added successfully.");
        return r.requestHandle(
          true,
          "New comment added successfully.",
          0,
          "commentId :" + comment.commentId
        );
      } else {
        return r.requestHandle(false, "post is not exist", 1, "");
      }
    } else {
      return r.requestHandle(
        false,
        "This user create comment active is 0",
        2,
        ""
      );
    }
  } catch (error) {
    console.log(`error ${error}`);
    return r.requestHandle(false, `${error}`, 3, "");
  }
}

async function changeCreatePostActive(mId, active) {
  try {
    const query = util.promisify(connection.query).bind(connection);
    check = await query("SELECT * FROM project.user_member WHERE mId = ?", [
      mId,
    ]);

    if (check.length > 0) {
      results = await query(
        "UPDATE project.user_member SET createPost = ? WHERE mId = ?",
        [active, mId]
      );
      console.log("Edit Create Post active successfully.");
      return r.requestHandle(
        true,
        "Edit Create Post active successfully",
        0,
        ""
      );
    } else {
      return r.requestHandle(false, "do no have this member", 1, "");
    }
  } catch (error) {
    console.log(`Error: ${error}`);
    return r.requestHandle(false, `${error}`, 2, "");
  }
}

async function changeCreateCommentActive(mId, active) {
  try {
    const query = util.promisify(connection.query).bind(connection);
    check = await query("SELECT * FROM project.user_member WHERE mId = ?", [
      mId,
    ]);

    if (check.length > 0) {
      results = await query(
        "UPDATE project.user_member SET createComment = ? WHERE mId = ?",
        [active, mId]
      );
      console.log("Edit Create comment active successfully.");
      return r.requestHandle(
        true,
        "Edit Create comment active successfully",
        0,
        ""
      );
    } else {
      return r.requestHandle(false, "do no have this member", 1, "");
    }
  } catch (error) {
    console.log(`Error: ${error}`);
    return r.requestHandle(false, `${error}`, 2, "");
  }
}

function readImageAsBase64(imagePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(imagePath, { encoding: "base64" }, (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
}

module.exports = {
  postList: postList,
  createPost: createPost,
  createComment: createComment,
  getComment: getComment,
  changeCreatePostActive: changeCreatePostActive,
  changeCreateCommentActive: changeCreateCommentActive,
  getPostDetail: getPostDetail,
  readImageAsBase64: readImageAsBase64,
};

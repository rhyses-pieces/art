const { Client } = require('@notionhq/client');
const { NotionToMarkdown } = require('notion-to-md');
require('dotenv').config();
const imageToShortcode = require('../_helpers/images');

module.exports = async function () {
  try {
    const notion = new Client({ auth: process.env.NOTION_TOKEN });
    const n2m = new NotionToMarkdown({ notionClient: notion });

    const dbId = process.env.NOTION_DB;
    const db = await notion.databases.query({
      database_id: dbId,
      sorts: [
        {
          property: "Date",
          direction: "descending",
        }
      ],
    });

    const getContent = async (id) => {
      const mdBlocks = await n2m.pageToMarkdown(id);
      let contentMdString = n2m.toMarkdownString(mdBlocks);
      contentMdString = imageToShortcode(contentMdString);

      return {
        content: contentMdString,
      }
    }

    const posts = db.results.map((result) => ({
      id: result.id,
      title: result.properties["Name"].title.pop().plain_text,
      content: undefined,
      date: result.created_time,
      cover: result.cover?.file?.url || result.cover?.external?.url,
		  coverAlt: result.properties["Cover Alt"]?.rich_text.pop()?.plain_text || "",
    }));

    for (i = 0; i < posts.length; i++) {
      const post = await getContent(posts[i].id);
      posts[i].content = post.content;
    }

    return posts;

  } catch (error) {
    console.error(error);
    return;
  }
}


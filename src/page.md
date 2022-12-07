---
layout: 'post.njk'
pagination:
  data: notion
  size: 1
  alias: post
  addAllPagesToCollection: true
tags: post
eleventyComputed:
  title: "{{ post.title }}"
  date: "{{ post.date }}"
permalink: "{{ post.title | slug }}/index.html"
---

{{ post.content }}
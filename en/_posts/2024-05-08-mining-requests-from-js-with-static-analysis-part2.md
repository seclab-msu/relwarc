---
layout: post
title: Mining HTTP requests from client-side JS with static analysis — part 2
lang: en
author: "Daniil Sigalov (@asterite3)"
---

In {% if page.excerpt %}[the previous post](/en/mining-requests-from-js-with-static-analysis){% else %}the previous post{% endif %}
we looked at the basic idea behind the algorithm and even built a small analyzer based on it.
In this post I'll talk a bit more about the principles our algorithm works on, including
how it determines function argument values and handles objects like `XMLHttpRequest`, plus
a few notes on the supported operations.

document.addEventListener('DOMContentLoaded', () => {
    const blocks = document.querySelectorAll('.wp-block-reign-news-widget');

    blocks.forEach(block => {
        const attributes = JSON.parse(block.getAttribute('data-attributes'));
        fetchPostsAndRender(block, attributes);
    });
});

function fetchPostsAndRender(block, { title, postsPerPage, postCategory, showAuthor }) {
    const apiUrl = '/wp-json/wp/v2/posts?_embed&per_page=' + postsPerPage;

    // Check if 'Select category' is chosen and adjust the API URL accordingly
    let categoryFilter = '';
    if (postCategory.length > 0 && postCategory[0] !== '' && postCategory[0] !== 'all') {
        categoryFilter = '&categories=' + postCategory.join(',');
    }

    const finalUrl = apiUrl + categoryFilter;

    fetch(finalUrl)
        .then(response => response.json())
        .then(posts => renderPosts(block, posts, { title, showAuthor }))
        .catch(error => {
            console.error('Error fetching posts:', error);
            block.innerHTML = '<p>Error loading posts</p>';
        });
}

function renderPosts(block, posts, { title, showAuthor }) {
    block.innerHTML = ''; // Clear existing content

    if (title) {
        const titleElement = document.createElement('h2');
        titleElement.className = 'wp-block-heading';
        titleElement.textContent = title;
        block.appendChild(titleElement);
    }

    if (posts.length === 0) {
        block.innerHTML = '<p>No posts found</p>';
        return;
    }

    const list = document.createElement('ul');
    list.className = 'latest-posts-list';
    posts.forEach(post => {
        const listItem = document.createElement('li');
        listItem.className = 'latest-post-item';

        if (post._embedded && post._embedded['wp:featuredmedia']) {
            const postThumbnail = document.createElement('div');
            postThumbnail.className = 'latest-post-thumb';
            const thumbnailImage = document.createElement('img');
            thumbnailImage.src = post._embedded['wp:featuredmedia'][0].source_url;
            thumbnailImage.alt = post.title.rendered;
            postThumbnail.appendChild(thumbnailImage);
            listItem.appendChild(postThumbnail);
        }

        const contentDiv = document.createElement('div');
        contentDiv.className = 'latest-post-content';

        const postTitle = document.createElement('h4');
        postTitle.className = 'post-title';
        postTitle.innerHTML = post.title.rendered;
        contentDiv.appendChild(postTitle);

        if (showAuthor && post._embedded.author) {
            const authorParagraph = document.createElement('p');
            authorParagraph.className = 'post-author';
            authorParagraph.innerHTML = `By ${post._embedded.author[0].name}`;
            contentDiv.appendChild(authorParagraph);
        }

        const dateParagraph = document.createElement('p');
        dateParagraph.className = 'latest-posts-date';
        dateParagraph.textContent = new Date(post.date).toLocaleDateString();
        contentDiv.appendChild(dateParagraph);

        listItem.appendChild(contentDiv);
        list.appendChild(listItem);
    });
    block.appendChild(list);
}

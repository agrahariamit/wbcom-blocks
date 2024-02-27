import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, RangeControl, SelectControl, ToggleControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
	const { title, postsPerPage, postCategory, showAuthor } = attributes;

	// Fetch the latest posts based on the block's attributes
	const latestPosts = useSelect((select) => {
		const query = {
			per_page: postsPerPage,
			_embed: true
		};

		if (postCategory && postCategory.length > 0 && postCategory[0] !== '') {
			query.categories = postCategory;
		}

		return select('core').getEntityRecords('postType', 'post', query);
	}, [postsPerPage, postCategory]);

	// Fetch the categories for the SelectControl
	const categories = useSelect((select) => {
		const terms = select('core').getEntityRecords('taxonomy', 'category', { per_page: -1 });
		return terms && terms.length ? terms : [];
	}, []);

	const blockProps = useBlockProps();
	const inspectorControls = (
		<InspectorControls>
			<PanelBody title={__('Settings', 'reign')}>
				<TextControl
					label={__('Title', 'reign')}
					value={title}
					onChange={(newTitle) => setAttributes({ title: newTitle })}
				/>
				<RangeControl
					label={__('Number of posts to show', 'reign')}
					value={postsPerPage}
					onChange={(newPostsPerPage) => setAttributes({ postsPerPage: newPostsPerPage })}
					min={1}
					max={10}
				/>
				<ToggleControl
					label={__('Show Author', 'reign')}
					checked={showAuthor}
					onChange={(newValue) => setAttributes({ showAuthor: newValue })}
				/>
				<SelectControl
					label={__('Select post category', 'reign')}
					value={postCategory}
					onChange={(newPostCategory) => setAttributes({ postCategory: Array.isArray(newPostCategory) ? newPostCategory : [newPostCategory] })}
					options={[
						{ value: '', label: __('Select category', 'reign') },
						...categories.map((cat) => ({ value: cat.id, label: cat.name }))
					]}
					multiple
				/>
			</PanelBody>
		</InspectorControls>
	);

	const livePreview = (
		<div {...blockProps}>
			<div className="latest-posts-preview">
				<h2 className="wp-block-heading">{title || __('Latest Posts', 'reign')}</h2>
				<ul className="latest-posts-list">
					{latestPosts && latestPosts.length > 0 ? (
						latestPosts.map((post) => (
							<li key={post.id} className="latest-post-item">
								<div class="latest-post-thumb">
									{post._embedded && post._embedded['wp:featuredmedia'] && (
										<img
											src={post._embedded['wp:featuredmedia'][0].media_details.sizes.thumbnail ?
												post._embedded['wp:featuredmedia'][0].media_details.sizes.thumbnail.source_url :
												post._embedded['wp:featuredmedia'][0].source_url}
											alt={post.title.rendered}
											width="150"
											height="150"
											class="latest-posts-thumbnail"
										/>
									)}
								</div>
								<div class="latest-post-content">
									<h4 class="post-title" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
									{showAuthor && post._embedded && post._embedded.author && post._embedded.author.length > 0 && (
										<p className="post-author">By {post._embedded.author[0].name}</p>
									)}
									<p className="latest-posts-date">{new Date(post.date).toLocaleDateString()}</p>
								</div>
							</li>
						))
					) : (
						<p>{__('No posts found', 'reign')}</p>
					)}
				</ul>
			</div>
		</div>
	);

	return (
		<>
			{inspectorControls}
			{livePreview}
		</>
	);
}
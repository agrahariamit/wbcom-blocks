import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { TextControl, SelectControl, TextareaControl } from '@wordpress/components';
import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
	const { title, loginRedirect, loginRedirectUrl, loginDescription } = attributes;

	// Function to update attributes
	const onChangeTitle = (newTitle) => {
		setAttributes({ title: newTitle });
	};

	const onChangeLoginRedirect = (newLoginRedirect) => {
		setAttributes({ loginRedirect: newLoginRedirect });
	};

	const onChangeLoginRedirectUrl = (newLoginRedirectUrl) => {
		setAttributes({ loginRedirectUrl: newLoginRedirectUrl });
	};

	const onChangeLoginDescription = (newLoginDescription) => {
		setAttributes({ loginDescription: newLoginDescription });
	};

	return (
		<div {...useBlockProps()}>
			<h4 className="bp-login-editor-title">(BuddyPress) Login</h4>
			<div className="bp-login-settings">
				<TextControl
					label={__('Title', 'reign')}
					value={title}
					onChange={onChangeTitle}
				/>
				<SelectControl
					label={__('Login Redirect', 'reign')}
					value={loginRedirect}
					options={[
						{ label: __('Current Page', 'reign'), value: 'current' },
						{ label: __('Profile Page', 'reign'), value: 'profile' },
						{ label: __('Activity Page', 'reign'), value: 'activity' },
						{ label: __('Custom Page', 'reign'), value: 'custom' },
					]}
					onChange={onChangeLoginRedirect}
				/>
				{loginRedirect === 'custom' && (
					<TextControl
						label={__('Custom Redirect URL', 'reign')}
						value={loginRedirectUrl}
						onChange={onChangeLoginRedirectUrl}
					/>
				)}
				<TextareaControl
					label={__('Login Description', 'reign')}
					value={loginDescription}
					onChange={onChangeLoginDescription}
				/>
			</div>
		</div>
	);
}

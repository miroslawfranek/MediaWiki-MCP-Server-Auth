import { z } from 'zod';
/* eslint-disable n/no-missing-import */
import type { McpServer, RegisteredTool } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { CallToolResult, TextContent, ToolAnnotations } from '@modelcontextprotocol/sdk/types.js';
/* eslint-enable n/no-missing-import */
import { makeSessionApiRequest, getPageUrl } from '../common/utils.js';

export function createPageTool( server: McpServer ): RegisteredTool {
	return server.tool(
		'create-page',
		'Creates a wiki page with the provided content.',
		{
			source: z.string().describe( 'Page content in the format specified by the contentModel parameter' ),
			title: z.string().describe( 'Wiki page title' ),
			comment: z.string().describe( 'Reason for creating the page' ).optional(),
			contentModel: z.string().describe( 'Type of content on the page. Defaults to "wikitext"' ).optional()
		},
		{
			title: 'Create page',
			readOnlyHint: false,
			destructiveHint: true
		} as ToolAnnotations,
		async (
			{ source, title, comment, contentModel }
		) => handleCreatePageTool( source, title, comment, contentModel )
	);
}

async function handleCreatePageTool(
	source: string,
	title: string,
	comment?: string,
	contentModel?: string
): Promise<CallToolResult> {
	let data: any = null;

	try {
		// Use session-based API with edit action (which can create pages)
		data = await makeSessionApiRequest( {
			action: 'edit',
			title: title,
			text: source,
			summary: comment || 'Created via MCP',
			createonly: 'true', // This ensures we only create, not update existing
			contentmodel: contentModel || 'wikitext',
			format: 'json'
		}, true );
	} catch ( error ) {
		return {
			content: [
				{ type: 'text', text: `Failed to create page: ${ ( error as Error ).message }` } as TextContent
			],
			isError: true
		};
	}

	if ( data === null ) {
		return {
			content: [
				{ type: 'text', text: 'Failed to create page: No data returned from API' } as TextContent
			],
			isError: true
		};
	}

	if ( data.error ) {
		return {
			content: [
				{ type: 'text', text: `Failed to create page: ${ data.error.info }` } as TextContent
			],
			isError: true
		};
	}

	return {
		content: createPageToolResultSession( data, title )
	};
}

function createPageToolResultSession( result: any, title: string ): TextContent[] {
	return [
		{
			type: 'text',
			text: `Page created successfully: ${ getPageUrl( title ) }`
		},
		{
			type: 'text',
			text: [
				'Create result:',
				`Result: ${ result.edit?.result || 'Success' }`,
				`Page ID: ${ result.edit?.pageid || 'N/A' }`,
				`Title: ${ title }`,
				`New revision ID: ${ result.edit?.newrevid || 'N/A' }`,
				`Timestamp: ${ result.edit?.newtimestamp || 'N/A' }`
			].join( '\n' )
		}
	];
}
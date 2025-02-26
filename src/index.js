/**
 * All Sites Menu.
 *
 * @author Per Søderlind
 * @date  10.06.2021
 * @class AllSitesMenu
 */

import { addSearch } from './modules/search.js';
import { IndexedDB } from './modules/db.js';
import { loadSites } from './modules/rest.js';
import { observeContainer, observeMenuHeight } from './modules/observe.js';
import { refreshAdminbar } from './modules/refresh.js';
import { siteMenu } from './modules/menu.js';

const dbVersionNumber = 2;

document.addEventListener('DOMContentLoaded', async () => {
	const $wpadminbar = document.getElementById('wpadminbar');
	if (!$wpadminbar) {
		return;
	}
	const el = {
		load: document.querySelector('#wp-admin-bar-load-more'),
		menu: document.querySelector('#wp-admin-bar-my-sites-list'),
		timestamp: document.querySelector('#load-more-timestamp'),
	};

	if (pluginAllSitesMenu.displaySearch === true) {
		addSearch();
	}

	const db = new IndexedDB('allsites', 'sites', [
		'id,name,url', // version 1.
		'id,name,url,timestamp', // version 2, add timestamp. More on versioning at https://dexie.org/docs/Tutorial/Design#database-versioning
	]);

	observeMenuHeight(el.menu);
	await populateDB(db);

	const observedLoadMore = observeContainer(el.load, async () => {
		const sites = await db.read(pluginAllSitesMenu.orderBy);
		const sitesMenu = sites.reduce((acc, site) => {
			return acc + siteMenu(site);
		}, '');
		el.load.insertAdjacentHTML('beforeBegin', sitesMenu);
		refreshAdminbar();

		el.load.style.display = 'none';
		observedLoadMore.unobserve(el.load);
	});
});

/**
 * Populate the database with sites.
 *
 * @author Per Søderlind
 * @param {IndexedDB} db
 * @param {object} el
 */
async function populateDB(db) {
	const data = await db.getFirstRow();
	if (
		typeof data !== 'undefined' &&
		typeof data.timestamp !== 'undefined' &&
		pluginAllSitesMenu.timestamp > data.timestamp
	) {
		await db.delete();
	}

	if ((await db.count()) === 0) {
		loadSites(db, 0);
	}
}

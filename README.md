# Super Admin All Sites Menu
* Note:* Private branch for compatibility with [custom network site info field plugin](https://github.com/jvarn/custom-network-site-info-field).

> Also available at https://wordpress.org/plugins/super-admin-all-sites-menu/

[Use](#use) | [Prerequisite](#prerequisite) | [Install](#install) | [Filters](#filters) | [Demo](#demo) | [Changelog](CHANGELOG.md)

For the super admin, replace WP Admin Bar My Sites menu with an All Sites menu.

- Doesn't use `switch_to_blog()`, i.e. Super Admin All Sites Menu is faster and uses less resources than the WP Admin Bar My Sites menu.
- Subsite menu data are stored locally in IndexedDB (did I say it's fast?). The local storage is updated when;
  - the plugin is activated.
  - a site is added or deleted.
  - you change a blog name.
  - IndexedDB is out of sync with site changes.
  - [Restricted Site Access](https://github.com/10up/restricted-site-access) is activated or deactivated.
- When subsite menu data is updated, REST is used and it's done in increments (100 sites per increment).
- List all subsites. WP Admin Bar My Sites only list sites you're a local admin on.
- Mark sites that has [restricted site access](https://github.com/10up/restricted-site-access) with a red icon.
- Sites menu is sorted alphabetically.
- Search filter.
- Add more menu choices:
  - Under "Network Admin"
    - Add New Site
  - Per subsite.
    - 'New Page'
    - 'Users'
    - 'Plugins'
    - 'Settings'

>Inspired by [WP REST API vs admin-ajax.php vs Must-Use Plugin: Handling AJAX Requests in WordPress](https://deliciousbrains.com/comparing-wordpress-rest-api-performance-admin-ajax-php/), I wrote [a must-use plugin](https://gist.github.com/soderlind/0de1272f1be1b3c79d43dd2c51dbddca) that makes the plugin go from fast to faster (ca 60% faster). Save [the file](https://gist.githubusercontent.com/soderlind/0de1272f1be1b3c79d43dd2c51dbddca/raw/2a5797f9d9ed5f0fb9e7e2a912870a8d9c51cfb3/mu-super-admin-all-sites-menu.php) in `mu-plugins`. 

## Use

<img src=".wordpress-org/screenshot-1.gif">

## IndexedDB

Menu data are stored locally in IndexedDB.

<img src=".wordpress-org/screenshot-2.png">

## Prerequisite

- WordPress Multisite
- A modern browser, IE 11 isn't supported.

## Install

> Also available at https://wordpress.org/plugins/super-admin-all-sites-menu/

- [Download the plugin](https://github.com/soderlind/super-admin-all-sites-menu/archive/refs/heads/main.zip)
- [Upload and network activate the plugin](https://wordpress.org/support/article/managing-plugins/#manual-upload-via-wordpress-admin)

## Filters

You can use the following filters to override the defaults:

- `all_sites_menu_order_by`
  - Sort menu by. Default value is `name`, accepts `id`, `url` or `name`
    ```php
    add_filter( 'all_sites_menu_order_by', function( string $order_by ) : string {
    	return 'url';
    } );
    ```
- `all_sites_menu_load_increments`
  - REST load increments. Default value is 100.
  ```php
  add_filter( 'all_sites_menu_load_increments', function( int $increments ) : int {
  	return 300;
  } );
  ```
- `all_sites_menu_plugin_trigger`
  - Trigger an update of local storage (IndexedDB) when a plugin is (de)activated. Default is `[ 'restricted-site-access/restricted_site_access.php' ]`.
    > Note: Must be an array and each element in the array must point to the main plugin file. Syntax `'plugin-dir/plugin-file.php'`
  ```php
   add_filter( 'all_sites_menu_plugin_trigger', function( array $plugins ) : array {
  	return [
  		'restricted-site-access/restricted_site_access.php',
  		'myplugin/myplugin.php',
  	];
  } );
  ```
- `all_sites_menu_search_threshold`
  - Don't display search field if there's less than N subsites. Default value is 20.
  ```php
  add_filter( 'all_sites_menu_search_threshold', function( int $increments ) : int {
  	return 40;
  } );
  ```
- `all_sites_menu_force_refresh_expiration`
  - How often a forced refresh should be taken. Default value is `3600`. Set the value to `0` to disable forced refresh.
    ```php
    add_filter( 'all_sites_menu_force_refresh_expiration', function( int $seconds ) : int {
    	return 3600;
    } );
    ```

## Demo

Test the plugin on a WordPress Multisite with 100 sites, locally, using [VS Code dev containers](https://code.visualstudio.com/docs/remote/containers).

0. You must [have docker installed](https://code.visualstudio.com/docs/remote/containers#_system-requirements).
1. In VS Code, install the [Remote - Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension.
1. Clone Super Admin All Sites Menu: `git clone https://github.com/soderlind/super-admin-all-sites-menu`
1. In `super-admin-all-sites-menu`, open VS Code: `code .`
1. When VS Code opens, click on **Reopen container**
1. Wait until the container is ready, then open http://localhost:8080/wp-admin/
   - Username: `admin`
   - Password: `password`

## Flow

```mermaid
sequenceDiagram
	  Actor User
    participant Menu
    participant IndexedDB
    participant WordPress
		User->>Menu: Open the menu
    Menu->>IndexedDB: Check if IndexedDB in sync
		IndexedDB->>Menu: Update sites menu
		Note over Menu,IndexedDB: If in sync.
    IndexedDB->>WordPress: Request sites
		Note over IndexedDB,WordPress: If not in sync.
		WordPress->>IndexedDB: Get sites
		IndexedDB->>IndexedDB: Update IndexedDB
    IndexedDB->>Menu: Update sites menu
		Menu->>User: Read Menu


```

## Changelog

See [CHANGELOG.md](CHANGELOG.md)

## Credits

- [Dexie.js](https://github.com/dfahlander/Dexie.js), which has an Apache License Version 2.0
- Submmenu offset adjustment: https://qiita.com/zephyr7501/items/dd0967fddabd888b28c4
- CSS for search field from https://github.com/trepmal/my-sites-search

## Copyright and License

Super Admin All Sites Menu is copyright 2021 Per Soderlind

Super Admin All Sites Menu is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 2 of the License, or (at your option) any later version.

Super Admin All Sites Menu is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU Lesser General Public License along with the Extension. If not, see http://www.gnu.org/licenses/.

/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { LitElement, html, css } from 'lit-element';
import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../store.js';
import { navigate, headerBackButtonClicked, initializeModuwareApiAsync, loadLanguageTranslation, getPlatformInfo, loadStoredSettings, loadHistoryList } from '../actions/app.js';
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-scroll-effects/effects/waterfall.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@moduware/morph-tabbar/morph-tabbar.js';
import '@moduware/morph-tabbar-item/morph-tabbar-item.js';
import '@moduware/morph-pages/morph-pages.js';
import './icons.js';
import 'webview-tile-header/webview-tile-header';
import { registerTranslateConfig, use, translate, get } from "@appnest/lit-translate";
import * as translation from '../translations/language.js';
import StorageKeys from '../enums/StorageKeys';
import {
	SharedStyles
} from './shared-styles.js';

class MyApp extends connect(store)(LitElement) {

	static get properties() {
		return {
			platform: {
				type: String,
				reflect: true
			},
			appTitle: { type: String },
			_page: { type: String },
			_language: { type: String },
			_showInstruction: { type: Boolean }
		};
	}

  static get styles() {
    return [
      SharedStyles,
      css`
        main {
          display: block;
        }

        .main-content {
          display: flex;
          flex-grow: 1;
        }

        .page {
          display: none;
          flex-grow: 1;
          position: relative;
        }

        .page[active] {
          display: block;
        }
      }
      `
    ];
  }

	render() {
		return html`
      <main role="main" class="main-content">
          <ambient-temperature-page  class="page" ?active="${this._page === "ambient-temperature-page"}"></ambient-temperature-page>
          <object-temperature-page  class="page" ?active="${this._page === "object-temperature-page"}"></object-temperature-page>
          <forehead-temperature-page  class="page" ?active="${this._page === "forehead-temperature-page"}"></forehead-temperature-page>
          <saved-readings-page  class="page" ?active="${this._page === "saved-readings-page"}"></saved-readings-page>
          <error-page  class="page" ?active="${this._page === "error-page"}"></error-page>
      </main>
    `;
	}

	constructor() {
		super();
		//this._page = "temperature-page"; // default page to avoid morph-pages confusions
		store.dispatch(getPlatformInfo());
		// To force all event listeners for gestures to be passive.
		// See https://www.polymer-project.org/3.0/docs/devguide/settings#setting-passive-touch-gestures
		setPassiveTouchGestures(true);
	}

	// Load the initial language and mark that the strings has been loaded.
	async connectedCallback() {

		/** this is to register the language translation loader from lit-translate */
		registerTranslateConfig({
			loader: (lang) => Promise.resolve(translation[lang])
		});

		super.connectedCallback();
	}

	firstUpdated() {
		store.dispatch(loadStoredSettings());
		store.dispatch(loadHistoryList());
		store.dispatch(loadLanguageTranslation());
		store.dispatch(navigate("/ambient-temperature-page"));
		store.dispatch(initializeModuwareApiAsync());
	}

	updated(changedProperties) {
		if (changedProperties.has('_page')) {
		}

		if (changedProperties.has('_language')) {
			use(this._language);
		}
	}

	stateChanged(state) {
		this.platform = state.app.platform;
		this._page = state.app.page;
		this._language = state.app.language;
		this._showInstruction = state.app.showInstruction;
	}
}

window.customElements.define('my-app', MyApp);

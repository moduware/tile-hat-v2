/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { html, css } from 'lit-element';
import { PageViewElement } from './page-view-element.js';
import { removeReading, navigate } from '../actions/app.js';
import { store } from '../store.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { ResetStyles } from '../vendor/reset.css.js';
import { SharedStyles } from './shared-styles.js';
import './icons.js';
import { registerTranslateConfig, use, translate } from "@appnest/lit-translate";
import * as translation from '../translations/language.js';
import '@moduware/morph-list-view/morph-list-view.js';
import '@moduware/morph-list-view-item/morph-list-view-item.js';
import '@moduware/morph-list-view-title/morph-list-view-title.js';
import '@moduware/morph-swipeout/morph-swipeout.js';
import '@moduware/morph-button/morph-button.js';

class SavedReadingsPage extends connect(store)(PageViewElement) {

	constructor() {
		super();
		this._historyList = [];
	}

	static get properties() {
		return {
			_page: { type: String },
			_language: { type: String },
			_historyList: { type: Array }
		};
	}

	static get styles() {
		return [
			SharedStyles,
			css``
		];
	}

	updated(changedProperties) {
		if (changedProperties.has('_language')) {
			use(this._language);
		}
	}

	async connectedCallback() {
		registerTranslateConfig({
			loader: (lang) => Promise.resolve(translation[lang])
		});

		super.connectedCallback();
	}

	render() {
		return html`
		<div>
        <a style="color:black"  @click="${() => store.dispatch(navigate('/ambient-temperature-page'))}">Ambient temp<a/>
        <br/>

        <br/>
        <a  style="color:black" @click="${() => store.dispatch(navigate('/object-temperature-page'))}">Object Temperature<a/>

        <br/>
        <br/>
        <a style="color:black" @click="${() => store.dispatch(navigate('/forehead-temperature-page'))}">forehead temperature<a/>

        <br/>
        <br/>
        <a style="color:red" href="#">history<a/>
      </div>
		`;
	}

	_groupByDate(historyList) {
		const dateGroups = historyList.reduce((dateGroups, item) => {
			const date = item.id;
			const jsDate = new Date(date);
			let day = moment(jsDate).local().startOf('day');

			if (!dateGroups[day]) {
				dateGroups[day] = [];
			}
			dateGroups[day].push(item);
			return dateGroups;
		}, {});


		// To add it in the array format
		const groupArrays = Object.keys(dateGroups).map((date) => {
			return {
				date,
				items: dateGroups[date]
			};
		});
		return groupArrays;
	}

	_formatDate(date) {
		let jsDate = new Date(date);
		let otherDates = moment(jsDate).fromNow();

		var callback = function () {
			return "[" + otherDates + "]";
		};

		var result = moment(jsDate).calendar(null, {
			sameDay: '[Today]',
			nextDay: 'DD/MM/YYYY',
			nextWeek: 'DD/MM/YYYY',
			lastDay: '[Yesterday]',
			lastWeek: 'DD/MM/YYYY',
			sameElse: 'DD/MM/YYYY'
		});

		if (result === 'Today') {
			return translate('history.list.today');
		} else if (result === 'Yesterday') {
			return translate('history.list.yesterday');
		} else {
			return result;
		}
	}


	stateChanged(state) {
		this._page = state.app.page;
		this._language = state.app.language;
		this._historyList = this._groupByDate(state.app.historyList);
	}
}

window.customElements.define('saved-readings-page', SavedReadingsPage);

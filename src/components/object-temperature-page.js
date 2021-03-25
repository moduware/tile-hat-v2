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
import { addReading, navigate } from '../actions/app.js';
import { store } from '../store.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { SharedStyles } from './shared-styles.js';
import './icons.js';
import * as Utils from '../lib/Utils';
import { registerTranslateConfig, use, translate } from "@appnest/lit-translate";
import * as translation from '../translations/language.js';
import TemperatureUnit from '../enums/TemperatureUnit';
import MeasureType from '../enums/MeasureType';

class ObjectTemperaturePage extends connect(store)(PageViewElement) {


	static get styles() {
		return [
			SharedStyles,
			css``
		];
	}

	render() {
		return html`
		<div>
        <a style="color:black" @click="${() => store.dispatch(navigate('/ambient-temperature-page'))}">Ambient temp<a/>
        <br/>

        <br/>
        <a  style="color:red" href="#">Object Temperature<a/>

        <br/>
        <br/>
        <a style="color:black" @click="${() => store.dispatch(navigate('/forehead-temperature-page'))}">forehead temperature<a/>
		<br/>
        <br/>
        <a style="color:black" @click="${() => store.dispatch(navigate('/saved-readings-page'))}">history<a/>
      </div>
    `;
	}

	_saveClickHandler() {

		var time = moment();
		var reading = {
			id: time.valueOf(),
			temperature: this._temperature,
			humidity: this._humidity,
			unit: this._unit,
			measureType: this._measureType,
			label: ''
		};
		store.dispatch(addReading(reading));
	}


	static get properties() {
		return {
			_page: { type: String },
			_language: { type: String },
			_temperature: { type: Number },
			_unit: { type: Object },
			_humidity: { type: String },
			_measureType: { type: String }
		};
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
	stateChanged(state) {
		this._page = state.app.page;
		this._language = state.app.language;
		this._unit = state.app.unit;
		this._humidity = state.app.humidity;
		this._measureType = state.app.measureType;

		if (state.app.measureType === MeasureType.Ambient) {
			if (this._unit.name === TemperatureUnit.Fahrenheit.name) {
				this._temperature = Utils.Celsius2Farenheit(state.app.ambientTemperature);
			} else {
				this._temperature = state.app.ambientTemperature;
			}
		} else {
			if (this._unit.name === TemperatureUnit.Fahrenheit.name) {
				this._temperature = Utils.Celsius2Farenheit(state.app.objectTemperature);
			} else {
				this._temperature = state.app.objectTemperature;
			}
		}
	}
}

window.customElements.define('object-temperature-page', ObjectTemperaturePage);

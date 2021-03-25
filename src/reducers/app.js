/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import {
	UPDATE_PAGE,
	MODUWARE_API_READY,
	LOAD_LANGUAGE_TRANSLATION,
	GET_PLATFORM,
	DATA_RECEIVED,
	TEMPERATURE_UNIT_CHANGED,
	MEASURE_TYPE_CHANGED,
	SHOW_INSTRUCTION_TOGGLED,
	ADD_READING,
	SAVE_READING,
	HISTORY_LIST_CHANGED,
	REMOVE_READING
} from '../actions/app.js';

import TemperatureUnit from '../enums/TemperatureUnit';
import MeasureType from '../enums/MeasureType';

const INITIAL_STATE = {
	page: 'instructions-page',
	apiReady: false,
	language: 'en',
	platform: '',
	ambientTemperature: 0,
	objectTemperature: 0,
	humidity: 0,
	historyList: [],
	unit: TemperatureUnit.Celsius,
	measureType: MeasureType.Ambient,
	showInstruction: false,
	toBeSavedReading: null
};

const app = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case MODUWARE_API_READY:
			return {
				...state,
				apiReady: true
			};
		case GET_PLATFORM:
			return {
				...state,
				platform: action.platform
			};
		case UPDATE_PAGE:
			return {
				...state,
				page: action.page
			};
		case LOAD_LANGUAGE_TRANSLATION:
			return {
				...state,
				language: action.language
			};
		case DATA_RECEIVED:
			return {
				...state,
				ambientTemperature: action.ambientTemperature,
				objectTemperature: action.objectTemperature,
				humidity: action.humidity
			};
		case TEMPERATURE_UNIT_CHANGED:
			return {
				...state,
				unit: action.unit
			};
		case MEASURE_TYPE_CHANGED:
			return {
				...state,
				measureType: action.measureType
			};
		case SHOW_INSTRUCTION_TOGGLED:
			return {
				...state,
				showInstruction: action.showInstruction
			};
		case ADD_READING:
			return {
				...state,
				toBeSavedReading: action.toBeSavedReading
			};
		case SAVE_READING:
			return {
				...state,
				historyList: [...state.historyList, action.reading]
			};
		case REMOVE_READING:
			return {
				...state,
				historyList: state.historyList.filter(item => {
					if (item.id === action.id) {
						return false;
					}
					return true;
				})
			};
		case HISTORY_LIST_CHANGED:
			return {
				...state,
				historyList: action.historyList
			};
		default:
			return state;
	}
};

export default app;

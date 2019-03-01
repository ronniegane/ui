import React from 'react';
import MenuItem from 'material-ui/MenuItem';
import heroes from 'dotaconstants/build/heroes.json';
import items from 'dotaconstants/build/items.json';
import { getTimeRange } from './ScenariosColumns';

export default function getFormFieldData(metadata, strings) {
  const {
    teamScenariosQueryParams, itemCost, gameDurationBucket, timings,
  } = metadata;
  return {
    heroList: Object.keys(heroes).map(id => ({
      text: heroes[id] && heroes[id].localized_name,
      value: (
        <MenuItem
          primaryText={heroes[id] && heroes[id].localized_name}
          leftIcon={<img src={`${process.env.REACT_APP_API_HOST}${heroes[id] && heroes[id].icon}`} alt="" />}
        />
      ),
      altValue: id,
    }))
      .sort((a, b) => a.text && a.text.localeCompare(b.text)),

    itemList: Object.keys(items).filter(item => items[item].cost >= itemCost && !item.startsWith('recipe_')).map(item => ({
      text: items[item].dname,
      value: (
        <MenuItem
          primaryText={items[item].dname}
          leftIcon={<img src={`${process.env.REACT_APP_API_HOST}${items[item].img}`} alt="" />}
        />
      ),
      altValue: item,
    }))
      .sort((a, b) => a.text && a.text.localeCompare(b.text)),

    laneRoleList: [1, 2, 3, 4].map(role => ({ text: strings[`lane_role_${role}`], value: role.toString() })),

    miscList: teamScenariosQueryParams.map(scenario => ({ text: strings[`scenarios_${scenario}`], value: scenario })),

    gameDurationList: gameDurationBucket.map(time => ({ text: getTimeRange(time, gameDurationBucket), value: time.toString() })),

    timingList: timings.map(time => ({ text: getTimeRange(time, timings), value: time.toString() })),
  };
}

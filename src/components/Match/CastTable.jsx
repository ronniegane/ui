import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Tabs,
  Tab,
} from 'material-ui/Tabs';
import heroes from 'dotaconstants/build/heroes.json';
import { inflictorWithValue } from '../Visualizations';
import Table from '../Table/Table';

const castsColumns = strings => [{
  displayName: strings.th_name,
  field: 'name',
  displayFn: (row, col, field) => (
    <div>
      <span>{inflictorWithValue(field)}</span>
      {/* <span>{items[field] ? items[field].dname : field}</span> */}
    </div>),
}, {
  displayName: strings.th_casts,
  tooltip: strings.tooltip_casts,
  field: 'casts',
  displayFn: (row, col, field) => field || '-',
}, {
  displayName: strings.th_hits,
  tooltip: strings.tooltip_hits,
  field: 'hero_hits',
  displayFn: (row, col, field) => field || '-',
}, {
  displayName: strings.th_damage,
  tooltip: strings.tooltip_damage,
  field: 'damage_inflictor',
  displayFn: (row, col, field) => field || '-',
}];

const getCastArray = (pm) => {
  // Get from ability_uses, item_uses
  const resultArray = [];
  const targets = ['ability_uses', 'item_uses'];
  targets.forEach((target) => {
    if (pm[target]) {
      Object.keys(pm[target]).forEach((key) => {
        resultArray.push({
          name: key,
          val: pm[target][key],
          casts: pm[target][key],
          hero_hits: (pm.hero_hits || {})[key],
          damage_inflictor: (pm.damage_inflictor || {})[key],
        });
      });
    }
  });
  resultArray.sort((a, b) => b.val - a.val);
  return resultArray;
};

const CastTable = ({
  match,
  strings,
}) => (
  <Tabs>
    {match.players.map(p =>
      (
        <Tab key={p.player_slot} icon={<img src={heroes[p.hero_id] && process.env.REACT_APP_API_HOST + heroes[p.hero_id].img} height={30} alt="" />}>
          <Table
            data={getCastArray(p)}
            columns={castsColumns(strings)}
          />
        </Tab>
      ))
    }
  </Tabs>);

CastTable.propTypes = {
  match: PropTypes.shape({}),
  strings: PropTypes.shape({}),
};

const mapStateToProps = state => ({
  strings: state.app.strings,
});

export default connect(mapStateToProps)(CastTable);

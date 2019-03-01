import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { fromNow, abbreviateNumber } from '../../utility';
import Table from '../Table';

function jsonResponse(response) {
  return response.json();
}

function reverse(a) {
  const temp = [];
  const len = a.length;
  for (let i = (len - 1); i > 0; i -= 1) {
    temp.push(a[i]);
  }
  return temp;
}

const columns = [
  { displayName: 'key', field: 'key' },
  { displayName: 'value', field: 'value' },
];

const tableStyle = {
  flexGrow: 1,
  overflowX: 'auto',
  boxSizing: 'border-box',
  padding: '15px',
};

class Status extends React.Component {
  static propTypes = {
    strings: PropTypes.shape({}),
  }

  state = {
    result: {},
  }

  componentDidMount() {
    fetch(`${process.env.REACT_APP_API_HOST}/api/status`)
      .then(jsonResponse)
      .then(json => this.setState({ result: json }));
  }
  render() {
    const { strings } = this.props;
    return (
      <div style={{
 display: 'flex', flexDirection: 'row', flexWrap: 'wrap', fontSize: '10px',
}}
      >
        <Helmet title={strings.title_status} />
        <Table
          style={tableStyle}
          data={Object.keys(this.state.result)
          .filter(key => typeof (this.state.result[key]) !== 'object')
          .map(key => ({ key, value: this.state.result[key] }))}
          columns={columns}
        />
        <Table
          style={tableStyle}
          data={Object.keys(this.state.result.health || {})
          .map(key => ({
            key,
            value: `${abbreviateNumber(this.state.result.health[key].metric)}/${abbreviateNumber(this.state.result.health[key].threshold)}`,
          }))}
          columns={columns}
        />
        <Table
          style={tableStyle}
          data={(this.state.result.last_added || [])
          .map(match => ({ key: match.match_id, value: fromNow(match.start_time + match.duration) }))}
          columns={columns}
        />
        <Table
          style={tableStyle}
          data={(this.state.result.last_parsed || [])
          .map(match => ({ key: match.match_id, value: fromNow(match.start_time + match.duration) }))}
          columns={columns}
        />
        <Table
          style={tableStyle}
          data={Object.keys(this.state.result.load_times || {})
          .map(key => ({ key, value: this.state.result.load_times[key] }))}
          columns={columns}
        />
        <Table
          style={tableStyle}
          data={reverse((this.state.result.api_paths || [])
          .map(row => ({ key: row.hostname, value: row.count })))
          }
          columns={columns}
        />
        <Table
          style={tableStyle}
          data={reverse((this.state.result.retriever || [])
          .map(row => ({ key: row.hostname, value: row.count })))
          }
          columns={columns}
        />
      </div>);
  }
}

const mapStateToProps = state => ({
  strings: state.app.strings,
});

export default connect(mapStateToProps)(Status);
